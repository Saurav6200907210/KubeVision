import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';

interface RpcRequest {
  reqId: string;
  type: string;
  payload?: any;
}

interface RpcResponse {
  reqId: string;
  payload?: any;
  error?: string;
}

class ConnectorManager {
  private connections: Map<string, WebSocket> = new Map();
  private pendingRequests: Map<string, { resolve: (val: any) => void, reject: (err: any) => void }> = new Map();

  addConnection(sessionId: string, ws: WebSocket) {
    this.connections.set(sessionId, ws);
    console.log(`Connector connected for session: ${sessionId}`);

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString()) as RpcResponse;
        if (message.reqId && this.pendingRequests.has(message.reqId)) {
          const { resolve, reject } = this.pendingRequests.get(message.reqId)!;
          if (message.error) {
            reject(new Error(message.error));
          } else {
            resolve(message.payload);
          }
          this.pendingRequests.delete(message.reqId);
        }
      } catch (err) {
        console.error('Failed to parse WS message', err);
      }
    });

    ws.on('close', () => {
      console.log(`Connector disconnected for session: ${sessionId}`);
      this.connections.delete(sessionId);
    });

    ws.on('error', (err) => {
      console.error(`Connector error for session: ${sessionId}`, err);
    });
  }

  hasConnection(sessionId: string): boolean {
    return this.connections.has(sessionId);
  }

  async sendRequest(sessionId: string, type: string, payload?: any): Promise<any> {
    const ws = this.connections.get(sessionId);
    if (!ws) {
      throw new Error('No local connector is currently connected for this session.');
    }

    const reqId = uuidv4();
    const request: RpcRequest = { reqId, type, payload };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(reqId, { resolve, reject });

      ws.send(JSON.stringify(request), (err) => {
        if (err) {
          this.pendingRequests.delete(reqId);
          reject(err);
        }
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(reqId)) {
          this.pendingRequests.delete(reqId);
          reject(new Error('Connector request timed out.'));
        }
      }, 30000);
    });
  }
}

export const connectorManager = new ConnectorManager();
