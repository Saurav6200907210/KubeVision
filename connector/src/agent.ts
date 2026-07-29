import WebSocket from 'ws';
import { k8sService } from './k8s.service';

interface RpcRequest {
  reqId: string;
  type: string;
  payload?: any[];
}

export class ConnectorAgent {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private backendUrl: string;
  private token: string;

  constructor(backendUrl: string, token: string) {
    this.backendUrl = backendUrl;
    this.token = token;
  }

  public start() {
    this.connect();
  }

  private connect() {
    console.log(`Connecting to KubeVision backend...`);
    const wsUrl = `${this.backendUrl}/ws/connector?token=${this.token}`;
    
    this.ws = new WebSocket(wsUrl);

    this.ws.on('open', () => {
      console.log('Connected to KubeVision successfully.');
      if (this.reconnectTimer) {
        clearInterval(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    });

    this.ws.on('message', async (data) => {
      let request: RpcRequest;
      try {
        request = JSON.parse(data.toString());
      } catch (err) {
        console.error('Failed to parse RPC request', err);
        return;
      }

      const { reqId, type, payload } = request;
      
      try {
        // Find method on k8sService
        const method = (k8sService as any)[type];
        if (typeof method !== 'function') {
          throw new Error(`Method ${type} not found on local k8s proxy.`);
        }

        const args = Array.isArray(payload) ? payload : [];
        const result = await method.apply(k8sService, args);
        
        this.ws?.send(JSON.stringify({ reqId, payload: result }));
      } catch (err: any) {
        console.error(`RPC Error handling ${type}:`, err);
        this.ws?.send(JSON.stringify({ reqId, error: err.message || 'Unknown error' }));
      }
    });

    this.ws.on('close', () => {
      console.log('Connection closed. Reconnecting in 5 seconds...');
      this.scheduleReconnect();
    });

    this.ws.on('error', (err) => {
      console.error('WebSocket Error:', err);
      // Close will be emitted after error, triggering reconnect
    });
  }

  private scheduleReconnect() {
    if (!this.reconnectTimer) {
      this.reconnectTimer = setTimeout(() => {
        this.reconnectTimer = null;
        this.connect();
      }, 5000);
    }
  }
}
