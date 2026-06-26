import React, { useState } from 'react';
import { X, FileText, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { YamlViewer } from './YamlViewer';
import { Loader2 } from 'lucide-react';

interface ResourceDetailsModalProps {
  type: 'pods' | 'deployments' | 'services' | 'namespaces' | 'nodes';
  namespace?: string;
  name: string;
  onClose: () => void;
}

export function ResourceDetailsModal({ type, namespace, name, onClose }: ResourceDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'yaml' | 'events'>('yaml');

  const { data, isLoading } = useQuery({
    queryKey: ['resource', type, namespace, name],
    queryFn: async () => {
      const url = namespace ? `/${type}/${namespace}/${name}` : `/${type}/${name}`;
      return (await api.get(url)).data;
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[80vw] h-[80vh] bg-card border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary/20 text-primary uppercase tracking-wider">
                {type.slice(0, -1)}
              </span>
              <h2 className="text-xl font-bold">{name}</h2>
            </div>
            {namespace && <p className="text-sm text-muted-foreground mt-1">Namespace: {namespace}</p>}
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-h-0 bg-background">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : !data ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Failed to load resource details.
            </div>
          ) : (
            <>
              <div className="flex border-b border-border">
                <button 
                  onClick={() => setActiveTab('yaml')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'yaml' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                >
                  <FileText className="w-4 h-4" />
                  YAML Configuration
                </button>
                <button 
                  onClick={() => setActiveTab('events')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'events' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                >
                  <Activity className="w-4 h-4" />
                  Events
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4">
                {activeTab === 'yaml' ? (
                  <YamlViewer yaml={data.yaml} height="100%" />
                ) : (
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted text-muted-foreground border-b border-border">
                        <tr>
                          <th className="px-4 py-3 font-medium">Type</th>
                          <th className="px-4 py-3 font-medium">Reason</th>
                          <th className="px-4 py-3 font-medium">Age</th>
                          <th className="px-4 py-3 font-medium">Message</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {!data.events || data.events.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                              No events found for this resource.
                            </td>
                          </tr>
                        ) : (
                          data.events.map((event: any, i: number) => {
                            const age = Math.round((Date.now() - new Date(event.metadata.creationTimestamp).getTime()) / 60000);
                            return (
                              <tr key={i} className="hover:bg-muted/30">
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${event.type === 'Warning' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                    {event.type}
                                  </span>
                                </td>
                                <td className="px-4 py-3 font-medium">{event.reason}</td>
                                <td className="px-4 py-3 text-muted-foreground">{age}m</td>
                                <td className="px-4 py-3 text-muted-foreground">{event.message}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
