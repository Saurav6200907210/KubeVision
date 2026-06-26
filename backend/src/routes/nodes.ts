import express from 'express';
import { k8sService } from '../services/k8s.service';
import { cleanK8sObjectForYaml } from '../utils/yaml';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const nodes = await k8sService.getNodes();
    res.json(nodes);
  } catch (error) {
    next(error);
  }
});

router.get('/:name', async (req, res, next) => {
  try {
    const { name } = req.params;
    const node = await k8sService.getNode(name);
    const events = await k8sService.getEvents(undefined, `involvedObject.name=${name}`);
    
    res.json({
      ...node,
      events,
      yaml: cleanK8sObjectForYaml(node)
    });
  } catch (error) {
    next(error);
  }
});

export default router;
