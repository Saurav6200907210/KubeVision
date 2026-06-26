import express from 'express';
import { k8sService } from '../services/k8s.service';
import { cleanK8sObjectForYaml } from '../utils/yaml';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { namespace } = req.query;
    const services = await k8sService.getServices(namespace as string);
    res.json(services);
  } catch (error) {
    next(error);
  }
});

router.get('/:namespace/:name', async (req, res, next) => {
  try {
    const { namespace, name } = req.params;
    const service = await k8sService.getService(namespace, name);
    const events = await k8sService.getEvents(namespace, `involvedObject.name=${name}`);
    
    res.json({
      ...service,
      events,
      yaml: cleanK8sObjectForYaml(service)
    });
  } catch (error) {
    next(error);
  }
});

export default router;
