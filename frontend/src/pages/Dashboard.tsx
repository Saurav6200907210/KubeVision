import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useDashboardStats } from '../hooks/useK8s';
import { Server, Box, Cuboid, Network, Component, Activity } from 'lucide-react';
import { useClusterStore } from '../stores/cluster.store';

export default function Dashboard() {
  const { cluster } = useClusterStore();
  const { data: stats, isLoading, error } = useDashboardStats();

  const statCards = [
    { title: 'Nodes', value: stats?.nodes || 0, icon: Server, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Namespaces', value: stats?.namespaces || 0, icon: Box, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Pods', value: stats?.pods || 0, icon: Cuboid, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Deployments', value: stats?.deployments || 0, icon: Component, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Services', value: stats?.services || 0, icon: Network, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your connected cluster: <span className="font-semibold text-foreground">{cluster?.name}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-16 bg-muted rounded animate-pulse mt-2"></div>
              ) : (
                <div className="text-3xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Cluster Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-dashed border-2 border-border m-4 rounded-lg">
             <div className="text-center text-muted-foreground flex flex-col items-center">
                <Activity className="h-8 w-8 mb-2 opacity-50" />
                <p>Activity timeline visualization will appear here.</p>
             </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Resource Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-dashed border-2 border-border m-4 rounded-lg">
             <div className="text-center text-muted-foreground flex flex-col items-center">
                <Cuboid className="h-8 w-8 mb-2 opacity-50" />
                <p>Resource pie charts will appear here.</p>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
