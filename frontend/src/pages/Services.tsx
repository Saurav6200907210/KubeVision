import React, { useState } from 'react';
import { useServices } from '../hooks/useK8s';
import { Loader2, Search, Eye } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { StatusBadge } from '../components/shared/StatusBadge';
import { ResourceDetailsModal } from '../components/shared/ResourceDetailsModal';

export default function Services() {
  const [namespace, setNamespace] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedService, setSelectedService] = useState<{name: string, namespace: string} | null>(null);
  const { data: services, isLoading } = useServices(namespace);

  const filtered = services?.filter((svc: any) => 
    svc.metadata.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Services</h2>
          <p className="text-muted-foreground">Network access points for your pods.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search services..."
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
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Namespace</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Cluster IP</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Ports</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading services...
                      </div>
                    </td>
                  </tr>
                ) : filtered?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No services found.
                    </td>
                  </tr>
                ) : (
                  filtered?.map((svc: any) => {
                    return (
                      <tr key={svc.metadata.uid} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle font-medium">{svc.metadata.name}</td>
                        <td className="p-4 align-middle text-muted-foreground">{svc.metadata.namespace}</td>
                        <td className="p-4 align-middle">
                          <StatusBadge status={svc.spec.type} />
                        </td>
                        <td className="p-4 align-middle text-muted-foreground">{svc.spec.clusterIP}</td>
                        <td className="p-4 align-middle text-muted-foreground">
                           {svc.spec.ports?.map((p: any) => `${p.port}/${p.protocol}`).join(', ')}
                        </td>
                        <td className="p-4 align-middle text-right">
                          <button 
                            onClick={() => setSelectedService({ name: svc.metadata.name, namespace: svc.metadata.namespace })}
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

      {selectedService && (
        <ResourceDetailsModal 
          type="services"
          namespace={selectedService.namespace}
          name={selectedService.name}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
}
