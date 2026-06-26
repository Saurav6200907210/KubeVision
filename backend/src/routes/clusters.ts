import express from 'express';
import { k8sService } from '../services/k8s.service';
import { query } from '../db';

const router = express.Router();

router.post('/connect', async (req, res, next) => {
  try {
    const { kubeconfig, name } = req.body;

    if (!kubeconfig || !name) {
      return res.status(400).json({ error: 'Name and kubeconfig are required' });
    }

    const isValid = await k8sService.validateKubeconfig(kubeconfig);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid kubeconfig or cluster unreachable' });
    }

    // Set connection active
    k8sService.loadFromConfig(kubeconfig);
    const info = await k8sService.getClusterInfo();

    // Store in DB
    const result = await query(
      `INSERT INTO clusters (name, kubeconfig, kubernetes_version, status) 
       VALUES ($1, $2, $3, 'connected') RETURNING id`,
      [name, kubeconfig, info.version]
    );

    res.json({
      message: 'Connected successfully',
      cluster: {
        id: result.rows[0].id,
        name,
        version: info.version,
        status: 'connected'
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/active', async (req, res, next) => {
  try {
    const result = await query(`SELECT id, name, kubernetes_version, status FROM clusters WHERE status = 'connected' LIMIT 1`);
    if (result.rows.length === 0) {
      return res.json({ connected: false });
    }
    res.json({ connected: true, cluster: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.post('/disconnect', async (req, res, next) => {
  try {
    await query(`UPDATE clusters SET status = 'disconnected' WHERE status = 'connected'`);
    res.json({ message: 'Disconnected' });
  } catch (error) {
    next(error);
  }
});

export default router;
