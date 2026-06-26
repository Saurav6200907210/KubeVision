import React from 'react';
import { useAnalytics, useDashboardStats } from '../hooks/useK8s';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Loader2 } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];

export default function Analytics() {
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  if (analyticsLoading || statsLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  const resourceOverviewData = [
    { name: 'Nodes', value: stats?.nodes || 0 },
    { name: 'Namespaces', value: stats?.namespaces || 0 },
    { name: 'Deployments', value: stats?.deployments || 0 },
    { name: 'Services', value: stats?.services || 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <p className="text-muted-foreground">Visualizations of your cluster's resource distribution.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pods by Namespace */}
        <Card>
          <CardHeader>
            <CardTitle>Pods by Namespace</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {analytics?.podsByNamespace && analytics.podsByNamespace.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.podsByNamespace} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis dataKey="name" tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="value" name="Pods" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        {/* Deployments by Namespace */}
        <Card>
          <CardHeader>
            <CardTitle>Deployments by Namespace</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {analytics?.deploymentsByNamespace && analytics.deploymentsByNamespace.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.deploymentsByNamespace} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis dataKey="name" tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Bar dataKey="value" name="Deployments" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        {/* Services by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Services by Type</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
             {analytics?.servicesByType && analytics.servicesByType.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.servicesByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {analytics.servicesByType.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
             ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
             )}
          </CardContent>
        </Card>

        {/* High-level Resource Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceOverviewData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#333" />
                <XAxis type="number" tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="value" name="Count" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
