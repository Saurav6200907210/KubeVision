import React, { useState } from 'react';
import { useNamespaces } from '../hooks/useK8s';
import { Loader2, Search, Eye } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { StatusBadge } from '../components/shared/StatusBadge';
import { ResourceDetailsModal } from '../components/shared/ResourceDetailsModal';

export default function Namespaces() {
  const [search, setSearch] = useState('');
  const [selectedNamespace, setSelectedNamespace] = useState<string | null>(null);
  const { data: namespaces, isLoading } = useNamespaces();

  const filtered = namespaces?.filter((ns: any) => 
    ns.metadata.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Namespaces</h2>
          <p className="text-muted-foreground">Logical boundaries for your cluster resources.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search namespaces..."
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Age</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading namespaces...
                      </div>
                    </td>
                  </tr>
                ) : filtered?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                      No namespaces found.
                    </td>
                  </tr>
                ) : (
                  filtered?.map((ns: any) => {
                    const creationTime = new Date(ns.metadata.creationTimestamp);
                    const age = Math.round((Date.now() - creationTime.getTime()) / (1000 * 60 * 60 * 24));

                    return (
                      <tr key={ns.metadata.uid} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle font-medium">{ns.metadata.name}</td>
                        <td className="p-4 align-middle">
                          <StatusBadge status={ns.status.phase} />
                        </td>
                        <td className="p-4 align-middle text-muted-foreground">{age}d</td>
                        <td className="p-4 align-middle text-right">
                          <button 
                            onClick={() => setSelectedNamespace(ns.metadata.name)}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
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

      {selectedNamespace && (
        <ResourceDetailsModal 
          type="namespaces"
          name={selectedNamespace}
          onClose={() => setSelectedNamespace(null)}
        />
      )}
    </div>
  );
}
