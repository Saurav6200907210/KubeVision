# KubeVision Local Connector

The KubeVision Local Connector is a lightweight, cross-platform Node.js agent that bridges your local Kubernetes clusters (Minikube, Kind, Docker Desktop, k3d, etc.) to the KubeVision dashboard.

## Architecture

```mermaid
graph TD
    Browser[Web Browser] -->|HTTPS/WSS| Cloudflare[Cloudflare Pages - Frontend]
    Browser -->|API Requests| Backend[KubeVision Backend Node.js]
    Backend <-->|Secure WebSocket RPC| Connector[Local Connector Agent]
    Connector <-->|reads ~/.kube/config| K8s[Local Kubernetes API]
```

## Sequence Diagram (Pairing Flow)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant B as Backend
    participant C as Connector CLI

    U->>B: POST /api/pair (Generate Code)
    B-->>U: Returns 6-digit Code (e.g. 123456)
    U->>C: Runs `kubevision-connector pair 123456`
    C->>B: POST /api/connect { code: "123456" }
    B-->>C: Returns long-lived JWT token
    C->>B: Connects via wss://...
    B-->>U: Frontend Verification Succeeds
```

## Installation Guide

### Via NPM
```bash
npm install -g kubevision-connector
```

### Via Binaries
Download the latest binaries for your platform (Windows MSI, macOS PKG, Linux AppImage) from the [Releases](#) page.

## Developer Guide

### Prerequisites
- Node.js 20+

### Setup
```bash
git clone <repo>
cd kubevision/connector
npm install
```

### Running Locally
```bash
npm run dev
```

### Testing the Pairing Flow Locally
1. Start the backend (`npm run dev` in `/backend`).
2. Start the frontend (`npm run dev` in `/frontend`) and click "Generate Pairing Code".
3. Pair the connector locally: `npm run dev -- pair <CODE>`
4. Start the connector: `npm run dev -- start`
