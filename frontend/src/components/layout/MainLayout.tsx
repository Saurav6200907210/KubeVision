import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Server, Box, Cuboid, Network, Component, Settings, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClusterStore } from '@/stores/cluster.store';

const Sidebar = () => {
  const location = useLocation();
  const { cluster } = useClusterStore();

  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Namespaces', path: '/namespaces', icon: Box },
    { name: 'Pods', path: '/pods', icon: Cuboid },
    { name: 'Deployments', path: '/deployments', icon: Component },
    { name: 'Services', path: '/services', icon: Network },
    { name: 'Nodes', path: '/nodes', icon: Server },
    { name: 'Topology', path: '/topology', icon: Network },
    { name: 'Analytics', path: '/analytics', icon: LayoutDashboard },
  ];

  return (
    <div className="w-64 border-r border-border bg-card h-screen flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary tracking-tight">KubeVision</h1>
      </div>
      
      <div className="p-4 border-b border-border">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-semibold">Active Cluster</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></div>
          <span className="font-medium truncate">{cluster?.name || 'Local Cluster'}</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
          const Icon = link.icon;
          
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </div>
    </div>
  );
};

const Header = () => {
  const navigate = useNavigate();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const query = (e.target as HTMLInputElement).value;
      if (query.trim()) {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search resources... (Press Enter)" 
            onKeyDown={handleSearch}
            className="w-full bg-muted/50 border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* User profile / extra actions can go here */}
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
          A
        </div>
      </div>
    </header>
  );
};

export default function MainLayout() {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
