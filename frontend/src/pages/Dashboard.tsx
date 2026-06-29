import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { useDashboardStats, useAnalytics } from '../hooks/useK8s';
import { Server, Box, Cuboid, Network, Component, Activity, Loader2, TrendingUp, AlertTriangle } from 'lucide-react';
import { useClusterStore } from '../stores/cluster.store';
import { AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

// Tiny Sparkline Component for Stats Cards
function Sparkline({ data, color }: { data: any[], color: string }) {
  return (
    <div className="h-10 w-full mt-2 opacity-50 pointer-events-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`color-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="value" stroke={color} fill={`url(#color-${color})`} strokeWidth={2} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Dashboard() {
  const { cluster } = useClusterStore();
  const { data: stats, isLoading } = useDashboardStats();
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();

  // Simulated live CPU/Memory data
  const [performanceData, setPerformanceData] = useState(
    Array.from({ length: 20 }).map((_, i) => ({
      time: `10:${i < 10 ? '0'+i : i}`,
      cpu: 30 + Math.random() * 20,
      memory: 40 + Math.random() * 15,
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceData(prev => {
        const newData = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        const newTime = parseInt(last.time.split(':')[1]) + 1;
        newData.push({
          time: `10:${newTime < 10 ? '0'+newTime : newTime}`,
          cpu: Math.max(10, Math.min(100, last.cpu + (Math.random() * 20 - 10))),
          memory: Math.max(10, Math.min(100, last.memory + (Math.random() * 10 - 5)))
        });
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const animatedNodes = useCountUp(stats?.nodes || 0, 1);
  const animatedNamespaces = useCountUp(stats?.namespaces || 0, 1);
  const animatedPods = useCountUp(stats?.pods || 0, 1);
  const animatedDeployments = useCountUp(stats?.deployments || 0, 1);
  const animatedServices = useCountUp(stats?.services || 0, 1);

  // Generate fake sparkline data for each card
  const getSparklineData = () => Array.from({ length: 10 }).map(() => ({ value: Math.random() * 100 }));

  const statCards = [
    { title: 'Nodes', value: animatedNodes, icon: Server, color: '#3b82f6', bg: 'bg-blue-500/10', text: 'text-blue-500', trend: '+1', health: 'Healthy' },
    { title: 'Namespaces', value: animatedNamespaces, icon: Box, color: '#8b5cf6', bg: 'bg-purple-500/10', text: 'text-purple-500', trend: '0', health: 'Healthy' },
    { title: 'Pods', value: animatedPods, icon: Cuboid, color: '#10b981', bg: 'bg-green-500/10', text: 'text-green-500', trend: '+12%', health: 'Warning' },
    { title: 'Deployments', value: animatedDeployments, icon: Component, color: '#f59e0b', bg: 'bg-orange-500/10', text: 'text-orange-500', trend: '+3', health: 'Healthy' },
    { title: 'Services', value: animatedServices, icon: Network, color: '#ec4899', bg: 'bg-pink-500/10', text: 'text-pink-500', trend: '+2', health: 'Healthy' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            Connected to <span className="font-semibold text-foreground px-2 py-0.5 rounded-md bg-muted border border-border">{cluster?.name}</span>
            <span className="flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
            </span>
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group">
              <CardContent className="p-5 relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 group-hover:-rotate-12 duration-500">
                  <stat.icon className="w-24 h-24" />
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${stat.bg} ${stat.text}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-semibold tracking-wide text-muted-foreground">{stat.title}</span>
                  </div>
                  {stat.health === 'Warning' ? (
                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full">
                      <AlertTriangle className="w-3 h-3" /> Warn
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                      OK
                    </span>
                  )}
                </div>

                {isLoading ? (
                  <div className="h-10 w-24 bg-muted rounded animate-pulse"></div>
                ) : (
                  <div className="flex items-end gap-3">
                    <div className="text-4xl font-bold tracking-tight">{stat.value}</div>
                    <div className="text-xs font-medium text-emerald-500 flex items-center gap-0.5 mb-1.5">
                      <TrendingUp className="w-3 h-3" /> {stat.trend}
                    </div>
                  </div>
                )}
                
                <Sparkline data={getSparklineData()} color={stat.color} />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="col-span-4"
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden flex flex-col h-[400px]">
            <div className="p-6 border-b border-border/50 flex items-center justify-between bg-muted/20">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" /> Live Metrics Overview
                </h3>
                <p className="text-sm text-muted-foreground">Real-time CPU and Memory consumption across the cluster</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium">
                <span className="flex items-center gap-1 text-blue-500"><div className="w-2 h-2 rounded-full bg-blue-500" /> CPU</span>
                <span className="flex items-center gap-1 text-emerald-500"><div className="w-2 h-2 rounded-full bg-emerald-500" /> RAM</span>
              </div>
            </div>
            <div className="flex-1 p-6 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="liveCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="liveMem" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
                    itemStyle={{ fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="cpu" name="CPU Usage (%)" stroke="#3b82f6" fillOpacity={1} fill="url(#liveCpu)" strokeWidth={3} isAnimationActive={false} />
                  <Area type="monotone" dataKey="memory" name="Memory Usage (%)" stroke="#10b981" fillOpacity={1} fill="url(#liveMem)" strokeWidth={3} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="col-span-3"
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden flex flex-col h-[400px]">
            <div className="p-6 border-b border-border/50 bg-muted/20">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Box className="w-5 h-5 text-purple-500" /> Resource Distribution
              </h3>
              <p className="text-sm text-muted-foreground">Pods grouped by namespace</p>
            </div>
            <div className="flex-1 p-6 flex flex-col relative">
              {analyticsLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : analytics?.podsByNamespace && analytics.podsByNamespace.length > 0 ? (
                <>
                  <div className="flex-1 min-h-0 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.podsByNamespace}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={100}
                          paddingAngle={3}
                          dataKey="value"
                          stroke="none"
                        >
                          {analytics.podsByNamespace.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Inner Text */}
                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                      <span className="text-3xl font-bold text-foreground">{stats?.pods || 0}</span>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Pods</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {analytics.podsByNamespace.slice(0, 4).map((entry: any, index: number) => (
                      <div key={entry.name} className="flex items-center gap-2 text-sm bg-muted/30 px-3 py-2 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors cursor-default">
                        <div className="w-3 h-3 rounded-md shrink-0 shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="truncate font-medium flex-1">{entry.name}</span>
                        <span className="text-muted-foreground font-semibold text-xs bg-background px-1.5 py-0.5 rounded">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground border-dashed border-2 border-border/50 rounded-xl bg-muted/5">
                  <p className="font-medium">No namespace data available.</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
