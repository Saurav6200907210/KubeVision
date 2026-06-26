import React, { useState } from 'react';
import { useDeployments } from '../hooks/useK8s';
import { Loader2, Search, Trash2, Eye, Scale } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { ResourceDetailsModal } from '../components/shared/ResourceDetailsModal';

export default function Deployments() {
  const [namespace, setNamespace] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedDeployment, setSelectedDeployment] = useState<{name: string, namespace: string} | null>(null);
  const { data: deployments, isLoading } = useDeployments(namespace);

  const filtered = deployments?.filter((dep: any) => 
    dep.metadata.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Deployments</h2>
          <p className="text-muted-foreground">Manage your Kubernetes deployments and scale them.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search deployments..."
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
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Replicas</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Ready</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Age</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading deployments...
                      </div>
                    </td>
                  </tr>
                ) : filtered?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No deployments found.
                    </td>
                  </tr>
                ) : (
                  filtered?.map((dep: any) => {
                    const replicas = dep.spec.replicas || 0;
                    const ready = dep.status.readyReplicas || 0;
                    const creationTime = new Date(dep.metadata.creationTimestamp);
                    const age = Math.round((Date.now() - creationTime.getTime()) / (1000 * 60 * 60 * 24));

                    return (
                      <tr key={dep.metadata.uid} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle font-medium">{dep.metadata.name}</td>
                        <td className="p-4 align-middle text-muted-foreground">{dep.metadata.namespace}</td>
                        <td className="p-4 align-middle">{replicas}</td>
                        <td className="p-4 align-middle">
                          <span className={ready === replicas && replicas > 0 ? "text-green-500" : "text-yellow-500"}>
                            {ready} / {replicas}
                          </span>
                        </td>
                        <td className="p-4 align-middle text-muted-foreground">{age}d</td>
                        <td className="p-4 align-middle text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setSelectedDeployment({ name: dep.metadata.name, namespace: dep.metadata.namespace })}
                              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8 text-blue-500">
                              <Scale className="h-4 w-4" />
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

      {selectedDeployment && (
        <ResourceDetailsModal 
          type="deployments"
          namespace={selectedDeployment.namespace}
          name={selectedDeployment.name}
          onClose={() => setSelectedDeployment(null)}
        />
      )}
    </div>
  );
}
