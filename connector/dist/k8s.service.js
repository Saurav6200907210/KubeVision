"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.k8sService = exports.K8sService = void 0;
// @ts-nocheck
const k8s = __importStar(require("@kubernetes/client-node"));
class K8sService {
    constructor() {
        this.kc = new k8s.KubeConfig();
        try {
            this.kc.loadFromDefault();
        }
        catch (e) {
            console.warn("Could not load default kubeconfig.");
        }
        this.coreV1Api = this.kc.makeApiClient(k8s.CoreV1Api);
        this.appsV1Api = this.kc.makeApiClient(k8s.AppsV1Api);
        this.log = new k8s.Log(this.kc);
    }
    async getClusterInfo() {
        const versionRes = await this.kc.makeApiClient(k8s.VersionApi).getCode();
        const body = versionRes.body || versionRes;
        return {
            version: body.gitVersion || 'unknown',
            platform: body.platform || 'unknown',
        };
    }
    async getNamespaces() {
        const res = await this.coreV1Api.listNamespace();
        return (res.body || res).items;
    }
    async getNamespace(name) {
        const res = await this.coreV1Api.readNamespace({ name });
        return (res.body || res);
    }
    async getNodes() {
        const res = await this.coreV1Api.listNode();
        return (res.body || res).items;
    }
    async getNode(name) {
        const res = await this.coreV1Api.readNode({ name });
        return (res.body || res);
    }
    async getPods(namespace) {
        if (namespace && namespace !== 'all') {
            const res = await this.coreV1Api.listNamespacedPod({ namespace });
            return (res.body || res).items;
        }
        else {
            const res = await this.coreV1Api.listPodForAllNamespaces();
            return (res.body || res).items;
        }
    }
    async getPod(namespace, name) {
        const res = await this.coreV1Api.readNamespacedPod({ name, namespace });
        return (res.body || res);
    }
    async deletePod(namespace, name) {
        const res = await this.coreV1Api.deleteNamespacedPod({ name, namespace });
        return (res.body || res);
    }
    async getPodLogs(namespace, name, container) {
        try {
            const res = await this.coreV1Api.readNamespacedPodLog({
                name,
                namespace,
                container,
                tailLines: 500,
                timestamps: true
            });
            return (res.body || res);
        }
        catch (e) {
            throw new Error(`Failed to fetch logs: ${e.message}`);
        }
    }
    async getDeployments(namespace) {
        if (namespace && namespace !== 'all') {
            const res = await this.appsV1Api.listNamespacedDeployment({ namespace });
            return (res.body || res).items;
        }
        else {
            const res = await this.appsV1Api.listDeploymentForAllNamespaces();
            return (res.body || res).items;
        }
    }
    async getDeployment(namespace, name) {
        const res = await this.appsV1Api.readNamespacedDeployment({ name, namespace });
        return (res.body || res);
    }
    async scaleDeployment(namespace, name, replicas) {
        const res = await this.appsV1Api.patchNamespacedDeploymentScale({ name, namespace, body: { spec: { replicas } } }, { headers: { "Content-Type": "application/merge-patch+json" } });
        return (res.body || res);
    }
    async deleteDeployment(namespace, name) {
        const res = await this.appsV1Api.deleteNamespacedDeployment({ name, namespace });
        return (res.body || res);
    }
    async getServices(namespace) {
        if (namespace && namespace !== 'all') {
            const res = await this.coreV1Api.listNamespacedService({ namespace });
            return (res.body || res).items;
        }
        else {
            const res = await this.coreV1Api.listServiceForAllNamespaces();
            return (res.body || res).items;
        }
    }
    async getService(namespace, name) {
        const res = await this.coreV1Api.readNamespacedService({ name, namespace });
        return (res.body || res);
    }
    async getEvents(namespace, fieldSelector) {
        if (namespace && namespace !== 'all') {
            const res = await this.coreV1Api.listNamespacedEvent({ namespace, fieldSelector });
            return (res.body || res).items;
        }
        else {
            const res = await this.coreV1Api.listEventForAllNamespaces({ fieldSelector });
            return (res.body || res).items;
        }
    }
    async getDashboardStats() {
        const [nodes, pods, deployments, services, namespaces] = await Promise.all([
            this.coreV1Api.listNode().then(res => (res.body || res).items.length).catch(() => 0),
            this.coreV1Api.listPodForAllNamespaces().then(res => (res.body || res).items.length).catch(() => 0),
            this.appsV1Api.listDeploymentForAllNamespaces().then(res => (res.body || res).items.length).catch(() => 0),
            this.coreV1Api.listServiceForAllNamespaces().then(res => (res.body || res).items.length).catch(() => 0),
            this.coreV1Api.listNamespace().then(res => (res.body || res).items.length).catch(() => 0),
        ]);
        return { nodes, pods, deployments, services, namespaces };
    }
    async getAnalytics() {
        const [pods, deployments, services] = await Promise.all([
            this.coreV1Api.listPodForAllNamespaces().then(res => (res.body || res).items).catch(() => []),
            this.appsV1Api.listDeploymentForAllNamespaces().then(res => (res.body || res).items).catch(() => []),
            this.coreV1Api.listServiceForAllNamespaces().then(res => (res.body || res).items).catch(() => []),
        ]);
        const podsByNamespace = {};
        pods.forEach(pod => {
            const ns = pod.metadata?.namespace || 'unknown';
            podsByNamespace[ns] = (podsByNamespace[ns] || 0) + 1;
        });
        const deploymentsByNamespace = {};
        deployments.forEach(dep => {
            const ns = dep.metadata?.namespace || 'unknown';
            deploymentsByNamespace[ns] = (deploymentsByNamespace[ns] || 0) + 1;
        });
        const servicesByType = {};
        services.forEach(svc => {
            const type = svc.spec?.type || 'unknown';
            servicesByType[type] = (servicesByType[type] || 0) + 1;
        });
        return {
            podsByNamespace: Object.entries(podsByNamespace).map(([name, value]) => ({ name, value })),
            deploymentsByNamespace: Object.entries(deploymentsByNamespace).map(([name, value]) => ({ name, value })),
            servicesByType: Object.entries(servicesByType).map(([name, value]) => ({ name, value })),
        };
    }
}
exports.K8sService = K8sService;
exports.k8sService = new K8sService();
