import express from 'express';
import cors from 'cors';
import http from 'http';
import WebSocket from 'ws';
import jwt from 'jsonwebtoken';
import { initializeDatabase } from './db/schema';
import { errorHandler } from './middleware/error';
import { connectorManager } from './services/connectorManager';

import clustersRouter from './routes/clusters';
import namespacesRouter from './routes/namespaces';
import podsRouter from './routes/pods';

import deploymentsRouter from './routes/deployments';
import servicesRouter from './routes/services';
import nodesRouter from './routes/nodes';
import dashboardRouter from './routes/dashboard';
import topologyRouter from './routes/topology';
import searchRouter from './routes/search';
import settingsRouter from './routes/settings';
import connectorRouter from './routes/connector';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

import { sessionContext } from './context';

// Routes
app.use((req, res, next) => {
  const sessionId = req.headers['x-session-id'] as string;
  if (sessionId) {
    sessionContext.run(sessionId, next);
  } else {
    next();
  }
});

app.use('/api/clusters', clustersRouter);
app.use('/api/namespaces', namespacesRouter);
app.use('/api/pods', podsRouter);
app.use('/api/deployments', deploymentsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/nodes', nodesRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/topology', topologyRouter);
app.use('/api/search', searchRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/connector', connectorRouter);

// Basic health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

const startServer = async () => {
  try {
    await initializeDatabase();
  } catch (error) {
    console.error('Failed to initialize database, but starting server anyway:', error);
  }
  
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ noServer: true });

  const JWT_SECRET = process.env.JWT_SECRET || 'kubevision-super-secret-key';

  server.on('upgrade', (request, socket, head) => {
    if (request.url && request.url.startsWith('/ws/connector')) {
      // Very basic auth via query param or headers, in real life you'd parse from request.url
      // Let's assume the token is in the query string: /ws/connector?token=...
      const url = new URL(request.url, `http://${request.headers.host}`);
      const token = url.searchParams.get('token');
      
      if (!token) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
        if (err || !decoded || !decoded.sessionId) {
          socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
          socket.destroy();
          return;
        }

        wss.handleUpgrade(request, socket, head, (ws) => {
          connectorManager.addConnection(decoded.sessionId, ws);
        });
      });
    } else {
      socket.destroy();
    }
  });

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
