import React, { useState } from 'react';
import { usePods, useNamespaces, useDeletePod } from '../hooks/useK8s';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ResourceDetailsModal } from '../components/shared/ResourceDetailsModal';
import { StatusBadge } from '../components/shared/StatusBadge';
import { Loader2, Cuboid, MoreVertical, Trash2, RotateCw, Terminal, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Pods() {
  const [namespace, setNamespace] = useState<string>('');
  const [search, setSearch] = useState('');
  const [selectedPod, setSelectedPod] = useState<{name: string, namespace: string} | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  const { data: pods, isLoading, refetch } = usePods(namespace);
  const { data: namespaces } = useNamespaces();
  const deletePod = useDeletePod();

  const filteredPods = pods?.filter((pod: any) => 
    pod.metadata?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (e: React.MouseEvent, ns: string, name: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete pod ${name}?`)) {
      await deletePod.mutateAsync({ namespace: ns, name });
      setActionMenuOpen(null);
    }
  };

  const handleRestart = (e: React.MouseEvent, ns: string, name: string) => {
    e.stopPropagation();
    // Restarting a pod usually means deleting it so deployment recreates it
    handleDelete(e, ns, name);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Cuboid className="w-8 h-8 text-primary" /> Pods
          </h2>
          <p className="text-muted-foreground mt-1">Manage and monitor container workloads across your cluster.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search pods..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
            />
          </div>
          <select
            className="bg-card border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm appearance-none cursor-pointer"
            value={namespace}
            onChange={(e) => setNamespace(e.target.value)}
          >
            <option value="">All Namespaces</option>
            {namespaces?.map((nsObj: any) => {
              const nsName = typeof nsObj === 'string' ? nsObj : nsObj?.metadata?.name || 'unknown';
              return <option key={nsName} value={nsName}>{nsName}</option>;
            })}
          </select>
          <button 
            onClick={() => refetch()} 
            className="p-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors shadow-sm"
            title="Refresh"
          >
            <RotateCw className={`w-5 h-5 text-muted-foreground ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wide">Name</th>
                <th className="px-6 py-4 font-semibold tracking-wide">Namespace</th>
                <th className="px-6 py-4 font-semibold tracking-wide">Status</th>
                <th className="px-6 py-4 font-semibold tracking-wide">Restarts</th>
                <th className="px-6 py-4 font-semibold tracking-wide">Age</th>
                <th className="px-6 py-4 font-semibold tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse bg-muted/10">
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-3/4"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-1/2"></div></td>
                    <td className="px-6 py-4"><div className="h-5 bg-muted rounded-full w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-8"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-12"></div></td>
                    <td className="px-6 py-4"><div className="h-8 bg-muted rounded w-8 ml-auto"></div></td>
                  </tr>
                ))
              ) : !filteredPods || filteredPods.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <Cuboid className="w-12 h-12 text-muted-foreground/30 mb-3" />
                      <p className="text-lg font-medium">No Pods Found</p>
                      <p className="text-sm">Try adjusting your search or namespace filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPods.map((pod: any) => {
                  const ns = pod.metadata?.namespace || 'default';
                  const name = pod.metadata?.name || 'unknown';
                  const restarts = pod.status.containerStatuses?.reduce((acc: number, curr: any) => acc + curr.restartCount, 0) || 0;
                  const age = Math.round((Date.now() - new Date(pod.metadata.creationTimestamp).getTime()) / 60000);
                  const isMenuOpen = actionMenuOpen === name;

                  return (
                    <tr 
                      key={pod.metadata.uid} 
                      onClick={() => setSelectedPod({ name, namespace: ns })}
                      className="hover:bg-muted/30 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 font-medium text-foreground max-w-[300px] truncate">
                        {name}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        <span className="px-2.5 py-1 bg-muted/50 border border-border/50 rounded-md text-xs">
                          {ns}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={pod.status.phase} />
                      </td>
                      <td className="px-6 py-4">
                        {restarts > 0 ? (
                          <span className="text-orange-500 font-medium bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">{restarts}</span>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {age > 1440 ? `${Math.round(age/1440)}d` : age > 60 ? `${Math.round(age/60)}h` : `${age}m`}
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setActionMenuOpen(isMenuOpen ? null : name); }}
                          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        <AnimatePresence>
                          {isMenuOpen && (
                            <motion.div 
                              key="action-menu"
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-6 top-10 w-48 bg-card border border-border rounded-lg shadow-xl py-1 z-10"
                            >
                              <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedPod({ name, namespace: ns }); setActionMenuOpen(null); }}
                                className="w-full flex items-center px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                              >
                                <Terminal className="w-4 h-4 mr-2" /> View Details
                              </button>
                              <button 
                                onClick={(e) => handleRestart(e, ns, name)}
                                className="w-full flex items-center px-4 py-2 text-sm text-orange-500 hover:bg-orange-500/10 transition-colors"
                              >
                                <RotateCw className="w-4 h-4 mr-2" /> Restart Pod
                              </button>
                              <div className="h-px bg-border/50 my-1"></div>
                              <button 
                                onClick={(e) => handleDelete(e, ns, name)}
                                className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete Pod
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedPod && (
        <ResourceDetailsModal
          type="pods"
          namespace={selectedPod.namespace}
          name={selectedPod.name}
          onClose={() => setSelectedPod(null)}
        />
      )}
    </div>
  );
}
