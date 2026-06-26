import { create } from 'zustand';

interface ClusterState {
  isConnected: boolean;
  cluster: any | null;
  setConnected: (status: boolean, clusterData?: any) => void;
}

export const useClusterStore = create<ClusterState>((set) => ({
  isConnected: false,
  cluster: null,
  setConnected: (status, clusterData = null) => set({ isConnected: status, cluster: clusterData }),
}));
