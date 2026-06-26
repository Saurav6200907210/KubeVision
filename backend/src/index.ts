import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './db/schema';
import { errorHandler } from './middleware/error';

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

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
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

// Basic health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
