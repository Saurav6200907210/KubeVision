// @ts-nocheck
import * as k8s from '@kubernetes/client-node';
import { pool } from '../db';
import { cleanK8sObjectForYaml } from '../utils/yaml';
import { PassThrough } from 'stream';

export class K8sService {
  private kc: k8s.KubeConfig;
  private coreV1Api: k8s.CoreV1Api;
  private appsV1Api: k8s.AppsV1Api;
  private log: k8s.Log;

  constructor() {
    this.kc = new k8s.KubeConfig();
    // Default to default client, but this will be overridden when a cluster is connected
    try {
      this.kc.loadFromDefault();
    } catch (e) {
      console.warn("Could not load default kubeconfig, waiting for cluster connect.");
    }
    this.coreV1Api = this.kc.makeApiClient(k8s.CoreV1Api);
    this.appsV1Api = this.kc.makeApiClient(k8s.AppsV1Api);
    this.log = new k8s.Log(this.kc);
  }

  public loadFromConfig(configString: string) {
    this.kc = new k8s.KubeConfig();
    this.kc.loadFromString(configString);
    this.coreV1Api = this.kc.makeApiClient(k8s.CoreV1Api);
    this.appsV1Api = this.kc.makeApiClient(k8s.AppsV1Api);
    this.log = new k8s.Log(this.kc);
  }

  public async validateKubeconfig(configString: string): Promise<boolean> {
    try {
      const tempKc = new k8s.KubeConfig();
      tempKc.loadFromString(configString);
      const tempApi = tempKc.makeApiClient(k8s.CoreV1Api);
      // Try to get namespaces as a validation step
      await tempApi.listNamespace();
      return true;
    } catch (error) {
      console.error("Kubeconfig validation failed:", error);
      return false;
    }
  }

  public async getClusterInfo() {
    const versionRes = await this.kc.makeApiClient(k8s.VersionApi).getCode() as any;
    const body = versionRes.body || versionRes;
    return {
      version: body.gitVersion || 'unknown',
      platform: body.platform || 'unknown',
    };
  }

  // --- Namespaces ---
  public async getNamespaces() {
    const res = await this.coreV1Api.listNamespace();
    return (res.body || res).items;
  }

  public async getNamespace(name: string) {
    const res = await this.coreV1Api.readNamespace({ name });
    return (res.body || res);
  }

  // --- Nodes ---
  public async getNodes() {
    const res = await this.coreV1Api.listNode();
    return (res.body || res).items;
  }

  public async getNode(name: string) {
    const res = await this.coreV1Api.readNode({ name });
    return (res.body || res);
  }

  // --- Pods ---
  public async getPods(namespace?: string) {
    if (namespace && namespace !== 'all') {
      const res = await this.coreV1Api.listNamespacedPod({ namespace });
      return (res.body || res).items;
    } else {
      const res = await this.coreV1Api.listPodForAllNamespaces();
      return (res.body || res).items;
    }
  }

  public async getPod(namespace: string, name: string) {
    const res = await this.coreV1Api.readNamespacedPod({ name, namespace });
    return (res.body || res);
  }

  public async deletePod(namespace: string, name: string) {
    const res = await this.coreV1Api.deleteNamespacedPod({ name, namespace });
    return (res.body || res);
  }

  public async getPodLogs(namespace: string, name: string, container?: string) {
    try {
      const res = await this.coreV1Api.readNamespacedPodLog({ 
        name, 
        namespace, 
        container,
        tailLines: 500,
        timestamps: true
      });
      return (res.body || res);
    } catch (e: any) {
      throw new Error(`Failed to fetch logs: ${e.message}`);
    }
  }

  // --- Deployments ---
  public async getDeployments(namespace?: string) {
    if (namespace && namespace !== 'all') {
      const res = await this.appsV1Api.listNamespacedDeployment({ namespace });
      return (res.body || res).items;
    } else {
      const res = await this.appsV1Api.listDeploymentForAllNamespaces();
      return (res.body || res).items;
    }
  }

  public async getDeployment(namespace: string, name: string) {
    const res = await this.appsV1Api.readNamespacedDeployment({ name, namespace });
    return (res.body || res);
  }

  public async scaleDeployment(namespace: string, name: string, replicas: number) {
    const res = await this.appsV1Api.patchNamespacedDeploymentScale(
      { name, namespace, body: { spec: { replicas } } },
      { headers: { "Content-Type": "application/merge-patch+json" } }
    );
    return (res.body || res);
  }

  public async deleteDeployment(namespace: string, name: string) {
    const res = await this.appsV1Api.deleteNamespacedDeployment({ name, namespace });
    return (res.body || res);
  }

  // --- Services ---
  public async getServices(namespace?: string) {
    if (namespace && namespace !== 'all') {
      const res = await this.coreV1Api.listNamespacedService({ namespace });
      return (res.body || res).items;
    } else {
      const res = await this.coreV1Api.listServiceForAllNamespaces();
      return (res.body || res).items;
    }
  }

  public async getService(namespace: string, name: string) {
    const res = await this.coreV1Api.readNamespacedService({ name, namespace });
    return (res.body || res);
  }

  // --- Events ---
  public async getEvents(namespace?: string, fieldSelector?: string) {
    if (namespace && namespace !== 'all') {
      const res = await this.coreV1Api.listNamespacedEvent({ namespace, fieldSelector });
      return (res.body || res).items;
    } else {
      const res = await this.coreV1Api.listEventForAllNamespaces({ fieldSelector });
      return (res.body || res).items;
    }
  }

  // --- Dashboard Stats ---
  public async getDashboardStats() {
    const [nodes, pods, deployments, services, namespaces] = await Promise.all([
      this.coreV1Api.listNode().then(res => (res.body || res).items.length).catch((err) => { console.error("Node error:", err); return 0; }),
      this.coreV1Api.listPodForAllNamespaces().then(res => (res.body || res).items.length).catch((err) => { console.error("Pod error:", err); return 0; }),
      this.appsV1Api.listDeploymentForAllNamespaces().then(res => (res.body || res).items.length).catch((err) => { console.error("Dep error:", err); return 0; }),
      this.coreV1Api.listServiceForAllNamespaces().then(res => (res.body || res).items.length).catch((err) => { console.error("Svc error:", err); return 0; }),
      this.coreV1Api.listNamespace().then(res => (res.body || res).items.length).catch((err) => { console.error("NS error:", err); return 0; }),
    ]);

    return {
      nodes, pods, deployments, services, namespaces
    };
  }

  // --- Analytics ---
  public async getAnalytics() {
    const [pods, deployments, services] = await Promise.all([
      this.coreV1Api.listPodForAllNamespaces().then(res => (res.body || res).items).catch(() => []),
      this.appsV1Api.listDeploymentForAllNamespaces().then(res => (res.body || res).items).catch(() => []),
      this.coreV1Api.listServiceForAllNamespaces().then(res => (res.body || res).items).catch(() => []),
    ]);

    // Aggregate Pods by Namespace
    const podsByNamespace: Record<string, number> = {};
    pods.forEach(pod => {
      const ns = pod.metadata?.namespace || 'unknown';
      podsByNamespace[ns] = (podsByNamespace[ns] || 0) + 1;
    });

    // Aggregate Deployments by Namespace
    const deploymentsByNamespace: Record<string, number> = {};
    deployments.forEach(dep => {
      const ns = dep.metadata?.namespace || 'unknown';
      deploymentsByNamespace[ns] = (deploymentsByNamespace[ns] || 0) + 1;
    });

    // Aggregate Services by Type
    const servicesByType: Record<string, number> = {};
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

// Singleton instance
export const k8sService = new K8sService();
