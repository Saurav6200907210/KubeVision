"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorAgent = void 0;
const ws_1 = __importDefault(require("ws"));
const k8s_service_1 = require("./k8s.service");
class ConnectorAgent {
    constructor(backendUrl, token) {
        this.ws = null;
        this.reconnectTimer = null;
        this.backendUrl = backendUrl;
        this.token = token;
    }
    start() {
        this.connect();
    }
    connect() {
        console.log(`Connecting to KubeVision backend...`);
        const wsUrl = `${this.backendUrl}/ws/connector?token=${this.token}`;
        this.ws = new ws_1.default(wsUrl);
        this.ws.on('open', () => {
            console.log('Connected to KubeVision successfully.');
            if (this.reconnectTimer) {
                clearInterval(this.reconnectTimer);
                this.reconnectTimer = null;
            }
        });
        this.ws.on('message', async (data) => {
            let request;
            try {
                request = JSON.parse(data.toString());
            }
            catch (err) {
                console.error('Failed to parse RPC request', err);
                return;
            }
            const { reqId, type, payload } = request;
            try {
                // Find method on k8sService
                const method = k8s_service_1.k8sService[type];
                if (typeof method !== 'function') {
                    throw new Error(`Method ${type} not found on local k8s proxy.`);
                }
                const args = Array.isArray(payload) ? payload : [];
                const result = await method.apply(k8s_service_1.k8sService, args);
                this.ws?.send(JSON.stringify({ reqId, payload: result }));
            }
            catch (err) {
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
    scheduleReconnect() {
        if (!this.reconnectTimer) {
            this.reconnectTimer = setTimeout(() => {
                this.reconnectTimer = null;
                this.connect();
            }, 5000);
        }
    }
}
exports.ConnectorAgent = ConnectorAgent;
