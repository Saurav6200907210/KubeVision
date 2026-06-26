import express from 'express';
import { k8sService } from '../services/k8s.service';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { namespace } = req.query;
    
    // Fetch all required resources
    const [namespaces, deployments, pods, services] = await Promise.all([
      k8sService.getNamespaces(),
      k8sService.getDeployments(namespace as string),
      k8sService.getPods(namespace as string),
      k8sService.getServices(namespace as string)
    ]);

    // Build graph for React Flow
    const nodes: any[] = [];
    const edges: any[] = [];

    // Add Cluster node
    nodes.push({ id: 'cluster', type: 'custom', data: { label: 'Cluster', type: 'cluster' }, position: { x: 0, y: 0 } });

    // In a real topology, we would compute exact positions or let a layout engine (like dagre) handle it on the frontend.
    // Here we just provide the nodes and edges.

    // Add Namespaces
    namespaces.forEach((ns: any) => {
      const nsName = ns.metadata.name;
      if (namespace && namespace !== 'all' && nsName !== namespace) return;
      
      const nsId = `ns-${nsName}`;
      nodes.push({ id: nsId, type: 'custom', data: { label: nsName, type: 'namespace' }, position: { x: 0, y: 0 } });
      edges.push({ id: `e-cluster-${nsId}`, source: 'cluster', target: nsId });
    });

    // Add Deployments
    deployments.forEach((dep: any) => {
      const nsName = dep.metadata.namespace;
      const depName = dep.metadata.name;
      const depId = `dep-${nsName}-${depName}`;
      
      nodes.push({ id: depId, type: 'custom', data: { label: depName, type: 'deployment' }, position: { x: 0, y: 0 } });
      edges.push({ id: `e-ns-${nsName}-${depId}`, source: `ns-${nsName}`, target: depId });
    });

    // Add Pods
    pods.forEach((pod: any) => {
      const nsName = pod.metadata.namespace;
      const podName = pod.metadata.name;
      const podId = `pod-${nsName}-${podName}`;
      
      // Try to find parent deployment via owner references (ReplicaSet -> Deployment)
      // For simplicity in this graph, we connect pods to namespace if no direct owner is easily mapped
      // Or if it's managed by a ReplicaSet, we can infer the deployment name
      let parentId = `ns-${nsName}`;
      
      if (pod.metadata.ownerReferences && pod.metadata.ownerReferences.length > 0) {
        const owner = pod.metadata.ownerReferences[0];
        if (owner.kind === 'ReplicaSet') {
          // ReplicaSet name usually matches Deployment name + hash
          const hashIndex = owner.name.lastIndexOf('-');
          if (hashIndex > 0) {
            const depName = owner.name.substring(0, hashIndex);
            parentId = `dep-${nsName}-${depName}`;
          }
        }
      }

      nodes.push({ id: podId, type: 'custom', data: { label: podName, type: 'pod', status: pod.status.phase }, position: { x: 0, y: 0 } });
      edges.push({ id: `e-${parentId}-${podId}`, source: parentId, target: podId });
    });

    // Add Services
    services.forEach((svc: any) => {
      const nsName = svc.metadata.namespace;
      const svcName = svc.metadata.name;
      const svcId = `svc-${nsName}-${svcName}`;
      
      nodes.push({ id: svcId, type: 'custom', data: { label: svcName, type: 'service' }, position: { x: 0, y: 0 } });
      edges.push({ id: `e-ns-${nsName}-${svcId}`, source: `ns-${nsName}`, target: svcId });
      
      // In a real topology, we would map service selectors to pod labels
      // to draw edges between Services and Pods.
    });

    res.json({ nodes, edges });
  } catch (error) {
    next(error);
  }
});

export default router;
