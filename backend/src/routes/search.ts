import express from 'express';
import { k8sService } from '../services/k8s.service';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.json([]);
    }

    const lowerQuery = query.toLowerCase();
    
    // Fetch all resources (this is a simple global search implementation)
    // In a real prod cluster with thousands of resources, you would use field selectors or informers.
    const [namespaces, pods, deployments, services, nodes] = await Promise.all([
      k8sService.getNamespaces(),
      k8sService.getPods('all'),
      k8sService.getDeployments('all'),
      k8sService.getServices('all'),
      k8sService.getNodes()
    ]);

    const results: any[] = [];

    const searchResource = (items: any[], type: string) => {
      items.forEach(item => {
        const name = item.metadata?.name || '';
        if (name.toLowerCase().includes(lowerQuery)) {
          results.push({
            type,
            name,
            namespace: item.metadata?.namespace,
            uid: item.metadata?.uid
          });
        }
      });
    };

    searchResource(namespaces, 'Namespace');
    searchResource(pods, 'Pod');
    searchResource(deployments, 'Deployment');
    searchResource(services, 'Service');
    searchResource(nodes, 'Node');

    res.json(results);
  } catch (error) {
    next(error);
  }
});

export default router;
