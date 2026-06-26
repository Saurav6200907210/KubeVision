import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

// --- Dashboard ---
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => (await api.get('/dashboard/stats')).data,
    refetchInterval: 15000,
  });
};

export const useAnalytics = () => {
  return useQuery({
    queryKey: ['dashboard', 'analytics'],
    queryFn: async () => (await api.get('/dashboard/analytics')).data,
    refetchInterval: 15000,
  });
};

// --- Topology ---
export const useTopology = (namespace?: string) => {
  return useQuery({
    queryKey: ['topology', namespace || 'all'],
    queryFn: async () => (await api.get('/topology', { params: { namespace } })).data,
  });
};

// --- Namespaces ---
export const useNamespaces = () => {
  return useQuery({
    queryKey: ['namespaces'],
    queryFn: async () => (await api.get('/namespaces')).data,
    refetchInterval: 15000,
  });
};

// --- Pods ---
export const usePods = (namespace?: string) => {
  return useQuery({
    queryKey: ['pods', namespace || 'all'],
    queryFn: async () => (await api.get('/pods', { params: { namespace } })).data,
    refetchInterval: 10000,
  });
};

export const usePod = (namespace: string, name: string) => {
  return useQuery({
    queryKey: ['pods', namespace, name],
    queryFn: async () => (await api.get(`/pods/${namespace}/${name}`)).data,
    refetchInterval: 5000,
  });
};

export const useDeletePod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ namespace, name }: { namespace: string, name: string }) => {
      await api.delete(`/pods/${namespace}/${name}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pods'] });
    },
  });
};

// --- Deployments ---
export const useDeployments = (namespace?: string) => {
  return useQuery({
    queryKey: ['deployments', namespace || 'all'],
    queryFn: async () => (await api.get('/deployments', { params: { namespace } })).data,
    refetchInterval: 15000,
  });
};

// --- Services ---
export const useServices = (namespace?: string) => {
  return useQuery({
    queryKey: ['services', namespace || 'all'],
    queryFn: async () => (await api.get('/services', { params: { namespace } })).data,
    refetchInterval: 15000,
  });
};

// --- Nodes ---
export const useNodes = () => {
  return useQuery({
    queryKey: ['nodes'],
    queryFn: async () => (await api.get('/nodes')).data,
    refetchInterval: 30000,
  });
};

// --- Cluster ---
export const useConnectCluster = () => {
  return useMutation({
    mutationFn: async (data: { name: string, kubeconfig: string }) => {
      return (await api.post('/clusters/connect', data)).data;
    }
  });
};
