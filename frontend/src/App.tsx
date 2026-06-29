import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useClusterStore } from './stores/cluster.store';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import ClusterConnect from './pages/ClusterConnect';
import Namespaces from './pages/Namespaces';
import Pods from './pages/Pods';
import Deployments from './pages/Deployments';
import Services from './pages/Services';
import Nodes from './pages/Nodes';
import Topology from './pages/Topology';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Search from './pages/Search';
import Landing from './pages/Landing';

import { ThemeProvider } from './components/shared/ThemeProvider';

function App() {
  const { isConnected } = useClusterStore();

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/connect" element={<ClusterConnect />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={isConnected ? <MainLayout /> : <Navigate to="/connect" />}>
          <Route index element={<Dashboard />} />
          <Route path="namespaces" element={<Namespaces />} />
          <Route path="pods" element={<Pods />} />
          <Route path="deployments" element={<Deployments />} />
          <Route path="services" element={<Services />} />
          <Route path="nodes" element={<Nodes />} />
          <Route path="topology" element={<Topology />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="search" element={<Search />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
