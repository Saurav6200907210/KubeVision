import express from 'express';
import { k8sService } from '../services/k8s.service';
import { cleanK8sObjectForYaml } from '../utils/yaml';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { namespace } = req.query;
    const pods = await k8sService.getPods(namespace as string);
    res.json(pods);
  } catch (error) {
    next(error);
  }
});

router.get('/:namespace/:name', async (req, res, next) => {
  try {
    const { namespace, name } = req.params;
    const pod = await k8sService.getPod(namespace, name);
    const events = await k8sService.getEvents(namespace, `involvedObject.name=${name}`);
    
    res.json({
      ...pod,
      events,
      yaml: cleanK8sObjectForYaml(pod)
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:namespace/:name', async (req, res, next) => {
  try {
    const { namespace, name } = req.params;
    await k8sService.deletePod(namespace, name);
    res.json({ message: 'Pod deleted successfully' });
  } catch (error) {
    next(error);
  }
});

router.get('/:namespace/:name/logs', async (req, res, next) => {
  try {
    const { namespace, name } = req.params;
    const { container } = req.query;
    const logs = await k8sService.getPodLogs(namespace, name, container as string);
    res.send(logs);
  } catch (error) {
    next(error);
  }
});

export default router;
