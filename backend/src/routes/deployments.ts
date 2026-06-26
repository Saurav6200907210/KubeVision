import express from 'express';
import { k8sService } from '../services/k8s.service';
import { cleanK8sObjectForYaml } from '../utils/yaml';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { namespace } = req.query;
    const deployments = await k8sService.getDeployments(namespace as string);
    res.json(deployments);
  } catch (error) {
    next(error);
  }
});

router.get('/:namespace/:name', async (req, res, next) => {
  try {
    const { namespace, name } = req.params;
    const deployment = await k8sService.getDeployment(namespace, name);
    const events = await k8sService.getEvents(namespace, `involvedObject.name=${name}`);
    
    res.json({
      ...deployment,
      events,
      yaml: cleanK8sObjectForYaml(deployment)
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:namespace/:name/scale', async (req, res, next) => {
  try {
    const { namespace, name } = req.params;
    const { replicas } = req.body;
    
    if (replicas === undefined || typeof replicas !== 'number') {
      return res.status(400).json({ error: 'Replicas must be a number' });
    }

    const result = await k8sService.scaleDeployment(namespace, name, replicas);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.delete('/:namespace/:name', async (req, res, next) => {
  try {
    const { namespace, name } = req.params;
    await k8sService.deleteDeployment(namespace, name);
    res.json({ message: 'Deployment deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
