import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUIStore } from '../../stores/ui.store';
import { useClusterStore } from '../../stores/cluster.store';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Server, Box, Cuboid, Network, Component, Settings, ChevronLeft, ChevronRight, Boxes } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();
  const { cluster } = useClusterStore();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Namespaces', path: '/dashboard/namespaces', icon: Box },
    { name: 'Nodes', path: '/dashboard/nodes', icon: Server },
    { name: 'Pods', path: '/dashboard/pods', icon: Cuboid },
    { name: 'Deployments', path: '/dashboard/deployments', icon: Component },
    { name: 'Services', path: '/dashboard/services', icon: Network },
    { name: 'Topology', path: '/dashboard/topology', icon: Network },
    { name: 'Analytics', path: '/dashboard/analytics', icon: LayoutDashboard },
  ];

  return (
    <motion.div 
      initial={false}
      animate={{ width: isSidebarCollapsed ? 80 : 280 }}
      className="border-r border-border bg-card/50 backdrop-blur-xl h-screen flex flex-col relative z-20 shrink-0"
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            <Boxes className="h-5 w-5" />
          </div>
          {!isSidebarCollapsed && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xl font-bold tracking-tight whitespace-nowrap">
              KubeVision
            </motion.span>
          )}
        </div>
        <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-muted text-muted-foreground absolute -right-3 top-5 bg-card border border-border shadow-sm z-50">
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
      
      <div className="p-4 border-b border-border/50">
        {!isSidebarCollapsed ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-semibold">Active Cluster</div>
            <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-lg border border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse shrink-0"></div>
              <span className="font-medium truncate text-sm">{cluster?.name || 'Local Cluster'}</span>
            </div>
          </motion.div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></div>
          </div>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-none">
        {links.map((link) => {
          const isActive = location.pathname === link.path || (link.path !== '/dashboard' && location.pathname.startsWith(link.path));
          const Icon = link.icon;
          
          return (
            <Link
              key={link.path}
              to={link.path}
              title={isSidebarCollapsed ? link.name : undefined}
              className="relative flex items-center rounded-lg outline-none group"
            >
              {isActive && (
                <motion.div 
                  layoutId="activeSidebarIndicator"
                  className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20 z-0"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className={cn(
                "relative z-10 flex items-center gap-3 w-full p-2.5 transition-colors",
                isSidebarCollapsed ? "justify-center" : "px-3"
              )}>
                <Icon className={cn(
                  "w-5 h-5 transition-all group-hover:scale-110", 
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                {!isSidebarCollapsed && (
                  <span className={cn(
                    "text-sm font-medium whitespace-nowrap",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}>
                    {link.name}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border/50">
        <Link
          to="/dashboard/settings"
          title={isSidebarCollapsed ? "Settings" : undefined}
          className="flex items-center gap-3 p-2.5 rounded-lg transition-colors text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground group"
        >
          <Settings className="w-5 h-5 transition-transform group-hover:rotate-45" />
          {!isSidebarCollapsed && <span>Settings</span>}
        </Link>
      </div>
    </motion.div>
  );
}
