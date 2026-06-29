import React, { useState, useEffect } from 'react';
import { X, FileText, Activity, Server, Clock, Shield, Cuboid, Box, Network, Component } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { YamlViewer } from './YamlViewer';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResourceDetailsModalProps {
  type: 'pods' | 'deployments' | 'services' | 'namespaces' | 'nodes';
  namespace?: string;
  name: string;
  onClose: () => void;
}

const ICONS = {
  pods: Cuboid,
  deployments: Component,
  services: Network,
  namespaces: Box,
  nodes: Server,
};

export function ResourceDetailsModal({ type, namespace, name, onClose }: ResourceDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'yaml' | 'events'>('overview');
  const [isVisible, setIsVisible] = useState(false);
  const Icon = ICONS[type] || Box;

  useEffect(() => {
    setIsVisible(true);
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const closeDrawer = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['resource', type, namespace, name],
    queryFn: async () => {
      const url = namespace ? `/${type}/${namespace}/${name}` : `/${type}/${name}`;
      return (await api.get(url)).data;
    }
  });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div key="drawer-wrapper" className="fixed inset-0 z-50 pointer-events-none flex justify-end">
          <motion.div 
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm pointer-events-auto"
            onClick={closeDrawer}
          />
          <motion.div 
            key="drawer"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full md:w-[800px] h-full bg-card border-l border-border shadow-2xl flex flex-col pointer-events-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/50 bg-muted/20 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl border border-primary/20">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold tracking-tight">{name}</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary uppercase tracking-widest border border-primary/30">
                      {type.slice(0, -1)}
                    </span>
                  </div>
                  {namespace && <p className="text-sm font-medium text-muted-foreground flex items-center gap-1"><Box className="w-3.5 h-3.5" /> {namespace}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={closeDrawer}
                  className="p-2 rounded-lg hover:bg-muted/80 hover:text-foreground transition-colors text-muted-foreground bg-background border border-border shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col min-h-0 bg-background">
              {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <p className="font-medium animate-pulse">Loading {type.slice(0,-1)} details...</p>
                </div>
              ) : !data ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Shield className="w-12 h-12 text-destructive/50" />
                  <p className="font-medium text-lg">Failed to load resource</p>
                  <p className="text-sm">The resource might have been deleted or is inaccessible.</p>
                </div>
              ) : (
                <>
                  <div className="flex border-b border-border/50 bg-muted/10 px-6 gap-6">
                    <button 
                      onClick={() => setActiveTab('overview')}
                      className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-all ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                      <Activity className="w-4 h-4" /> Overview
                    </button>
                    <button 
                      onClick={() => setActiveTab('yaml')}
                      className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-all ${activeTab === 'yaml' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                      <FileText className="w-4 h-4" /> YAML
                    </button>
                    <button 
                      onClick={() => setActiveTab('events')}
                      className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-all ${activeTab === 'events' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                      <Activity className="w-4 h-4" /> Events
                    </button>
                  </div>

                  <div className="flex-1 overflow-auto bg-muted/5 relative">
                    {activeTab === 'overview' && (
                       <div className="p-6 space-y-6">
                         <div className="grid grid-cols-2 gap-4">
                            <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
                              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Created</p>
                              <p className="font-medium flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500" /> {new Date(data.metadata?.creationTimestamp || Date.now()).toLocaleString()}</p>
                            </div>
                            <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
                              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                              <p className="font-medium flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Active
                              </p>
                            </div>
                         </div>
                         <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
                           <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Labels</p>
                           <div className="flex flex-wrap gap-2">
                              {data.metadata?.labels ? Object.entries(data.metadata.labels).map(([k, v]) => (
                                <span key={k} className="px-2.5 py-1 text-xs font-medium bg-muted border border-border rounded-md break-all">
                                  <span className="text-muted-foreground">{k}:</span> {String(v)}
                                </span>
                              )) : <span className="text-sm text-muted-foreground">No labels</span>}
                           </div>
                         </div>
                       </div>
                    )}
                    {activeTab === 'yaml' && (
                      <div className="h-full p-0">
                        <YamlViewer yaml={data.yaml} height="100%" />
                      </div>
                    )}
                    {activeTab === 'events' && (
                       <div className="p-6">
                         <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground border-b border-border/50">
                              <tr>
                                <th className="px-4 py-3 font-semibold tracking-wide">Type</th>
                                <th className="px-4 py-3 font-semibold tracking-wide">Reason</th>
                                <th className="px-4 py-3 font-semibold tracking-wide">Age</th>
                                <th className="px-4 py-3 font-semibold tracking-wide">Message</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                              {!data.events || data.events.length === 0 ? (
                                <tr>
                                  <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground bg-muted/10">
                                    No events found for this resource.
                                  </td>
                                </tr>
                              ) : (
                                data.events.map((event: any, i: number) => {
                                  const age = Math.round((Date.now() - new Date(event.metadata.creationTimestamp).getTime()) / 60000);
                                  return (
                                    <tr key={i} className="hover:bg-muted/50 transition-colors">
                                      <td className="px-4 py-3 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${event.type === 'Warning' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                                          {event.type}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 font-medium text-foreground">{event.reason}</td>
                                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{age}m</td>
                                      <td className="px-4 py-3 text-muted-foreground">{event.message}</td>
                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>
                        </div>
                       </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
