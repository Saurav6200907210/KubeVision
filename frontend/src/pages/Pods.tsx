import React, { useState } from 'react';
import { usePods } from '../hooks/useK8s';
import { StatusBadge } from '../components/shared/StatusBadge';
import { Loader2, Search, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ResourceDetailsModal } from '../components/shared/ResourceDetailsModal';

export default function Pods() {
  const [namespace, setNamespace] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedPod, setSelectedPod] = useState<{name: string, namespace: string} | null>(null);
  const { data: pods, isLoading } = usePods(namespace);

  const filteredPods = pods?.filter((pod: any) => 
    pod.metadata.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pods</h2>
          <p className="text-muted-foreground">Manage and monitor your Kubernetes pods.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search pods..."
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={namespace}
            onChange={(e) => setNamespace(e.target.value)}
          >
            <option value="all">All Namespaces</option>
            <option value="default">default</option>
            <option value="kube-system">kube-system</option>
          </select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Namespace</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Restarts</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Node</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Age</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading pods...
                      </div>
                    </td>
                  </tr>
                ) : filteredPods?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No pods found.
                    </td>
                  </tr>
                ) : (
                  filteredPods?.map((pod: any) => {
                    const restarts = pod.status?.containerStatuses?.reduce((acc: number, c: any) => acc + c.restartCount, 0) || 0;
                    const creationTime = new Date(pod.metadata.creationTimestamp);
                    const age = Math.round((Date.now() - creationTime.getTime()) / (1000 * 60 * 60 * 24)); // very rough age in days

                    return (
                      <tr key={pod.metadata.uid} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle font-medium">{pod.metadata.name}</td>
                        <td className="p-4 align-middle text-muted-foreground">{pod.metadata.namespace}</td>
                        <td className="p-4 align-middle">
                          <StatusBadge status={pod.status.phase} />
                        </td>
                        <td className="p-4 align-middle">{restarts}</td>
                        <td className="p-4 align-middle text-muted-foreground">{pod.spec.nodeName}</td>
                        <td className="p-4 align-middle text-muted-foreground">{age}d</td>
                        <td className="p-4 align-middle text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setSelectedPod({ name: pod.metadata.name, namespace: pod.metadata.namespace })}
                              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-destructive hover:text-destructive-foreground text-destructive h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
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
