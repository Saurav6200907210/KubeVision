import express from 'express';
import { k8sService } from '../services/k8s.service';
import { query } from '../db';
import { cleanK8sObjectForYaml } from '../utils/yaml';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const namespaces = await k8sService.getNamespaces();
    res.json(namespaces);
  } catch (error) {
    next(error);
  }
});

router.get('/:name', async (req, res, next) => {
  try {
    const { name } = req.params;
    const namespace = await k8sService.getNamespace(name);
    const events = await k8sService.getEvents(name);
    
    res.json({
      ...namespace,
      events,
      yaml: cleanK8sObjectForYaml(namespace)
    });
  } catch (error) {
    next(error);
  }
});

export default router;
