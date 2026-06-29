import React from 'react';
import { useAnalytics, useDashboardStats } from '../hooks/useK8s';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ComposedChart, Scatter
} from 'recharts';
import { Loader2, Activity, Zap, Server, ShieldAlert, Cpu, HardDrive } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];

const FAKE_TIMELINE = Array.from({ length: 24 }).map((_, i) => ({
  time: `${i}:00`,
  cpu: 20 + Math.random() * 40,
  memory: 40 + Math.random() * 30,
  network: Math.random() * 100,
}));

const FAKE_TOP_CONSUMERS = [
  { name: 'prometheus-server', value: 85, namespace: 'monitoring' },
  { name: 'elasticsearch-0', value: 72, namespace: 'logging' },
  { name: 'api-gateway', value: 65, namespace: 'prod' },
  { name: 'payment-service', value: 45, namespace: 'prod' },
  { name: 'kube-apiserver', value: 40, namespace: 'kube-system' },
];

const FAKE_HEATMAP = Array.from({ length: 12 }).map((_, i) => ({
  name: `node-${i}`,
  score: Math.random() * 100
}));

export default function Analytics() {
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  if (analyticsLoading || statsLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 text-muted-foreground bg-card p-8 rounded-2xl border border-border shadow-lg">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="font-medium tracking-wide">Compiling Enterprise Analytics...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Enterprise Analytics</h2>
          <p className="text-muted-foreground mt-1">Deep-dive into cluster health, performance, and resource utilization.</p>
        </div>
        <div className="flex items-center gap-3 bg-card px-4 py-2 rounded-lg border border-border shadow-sm">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Health Score</span>
            <span className="text-2xl font-bold text-emerald-500">98/100</span>
          </div>
          <Activity className="w-8 h-8 text-emerald-500 opacity-20" />
        </div>
      </div>

      {/* High-level KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-red-500/10 text-red-500 rounded-lg"><ShieldAlert className="w-6 h-6" /></div>
            <div><p className="text-sm text-muted-foreground font-medium">Critical Alerts</p><h4 className="text-2xl font-bold">0</h4></div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-lg"><Zap className="w-6 h-6" /></div>
            <div><p className="text-sm text-muted-foreground font-medium">Restart Trend</p><h4 className="text-2xl font-bold">+2.4%</h4></div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg"><Cpu className="w-6 h-6" /></div>
            <div><p className="text-sm text-muted-foreground font-medium">Avg API Latency</p><h4 className="text-2xl font-bold">42ms</h4></div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg"><HardDrive className="w-6 h-6" /></div>
            <div><p className="text-sm text-muted-foreground font-medium">Storage Used</p><h4 className="text-2xl font-bold">45%</h4></div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Resource Usage Timeline */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Resource Utilization Timeline (24h)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={FAKE_TIMELINE}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="cpu" name="CPU (%)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCpu)" />
                <Area type="monotone" dataKey="memory" name="Memory (%)" stroke="#10b981" fillOpacity={1} fill="url(#colorMem)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top CPU Consumers */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Top CPU Consumers</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FAKE_TOP_CONSUMERS} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="value" name="CPU (mCore)" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pods by Namespace */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Namespace Density</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {analytics?.podsByNamespace ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.podsByNamespace}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {analytics.podsByNamespace.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : null}
          </CardContent>
        </Card>

        {/* Node Utilization Heatmap (Simulated via BarChart) */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Node Utilization Profile</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FAKE_HEATMAP}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'hsl(var(--muted)/0.5)'}} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="score" name="Load Score" radius={[4, 4, 0, 0]}>
                  {FAKE_HEATMAP.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#ef4444' : entry.score > 50 ? '#f59e0b' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
