import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useDashboardStats, useAnalytics } from '../hooks/useK8s';
import { Server, Box, Cuboid, Network, Component, Activity, Loader2 } from 'lucide-react';
import { useClusterStore } from '../stores/cluster.store';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

export default function Dashboard() {
  const { cluster } = useClusterStore();
  const { data: stats, isLoading } = useDashboardStats();
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();

  // Simulated live CPU/Memory data since K8s metrics-server might not be available
  const [performanceData, setPerformanceData] = useState([
    { time: '10:00', cpu: 30, memory: 40 },
    { time: '10:01', cpu: 45, memory: 42 },
    { time: '10:02', cpu: 55, memory: 45 },
    { time: '10:03', cpu: 40, memory: 50 },
    { time: '10:04', cpu: 65, memory: 55 },
    { time: '10:05', cpu: 50, memory: 48 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceData(prev => {
        const newData = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        const newTime = parseInt(last.time.split(':')[1]) + 1;
        newData.push({
          time: `10:0${newTime > 9 ? newTime : '0' + newTime}`,
          cpu: Math.max(10, Math.min(100, last.cpu + (Math.random() * 30 - 15))),
          memory: Math.max(10, Math.min(100, last.memory + (Math.random() * 20 - 10)))
        });
        return newData;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
            <CardTitle>CPU & Memory Utilization</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="cpu" name="CPU (%)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={2} />
                <Area type="monotone" dataKey="memory" name="Memory (%)" stroke="#10b981" fillOpacity={1} fill="url(#colorMem)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Pods by Namespace</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px] pb-6 flex flex-col">
            {analyticsLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : analytics?.podsByNamespace && analytics.podsByNamespace.length > 0 ? (
              <>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.podsByNamespace}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {analytics.podsByNamespace.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 px-2">
                  {analytics.podsByNamespace.slice(0, 4).map((entry: any, index: number) => (
                    <div key={entry.name} className="flex items-center gap-2 text-xs truncate">
                      <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="truncate" title={entry.name}>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground border-dashed border-2 border-border rounded-lg">
                <p>No namespace data available.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
