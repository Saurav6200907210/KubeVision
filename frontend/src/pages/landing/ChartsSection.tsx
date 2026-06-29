import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];

export default function ChartsSection() {
  const [data, setData] = useState([
    { time: '10:00', cpu: 30, memory: 40 },
    { time: '10:01', cpu: 45, memory: 42 },
    { time: '10:02', cpu: 55, memory: 45 },
    { time: '10:03', cpu: 40, memory: 50 },
    { time: '10:04', cpu: 65, memory: 55 },
    { time: '10:05', cpu: 50, memory: 48 },
  ]);

  const [pieData, setPieData] = useState([
    { name: 'default', value: 400 },
    { name: 'kube-system', value: 300 },
    { name: 'monitoring', value: 300 },
    { name: 'ingress', value: 200 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
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

      setPieData(prev => 
        prev.map(item => ({
          ...item,
          value: Math.max(100, item.value + (Math.random() * 100 - 50))
        }))
      );
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 border-t border-border/50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight md:text-4xl"
          >
            Analytics & Resource Metrics
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Monitor cluster health with real-time animated charts. Never guess where your compute resources are going.
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Area Chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="md:col-span-2 rounded-xl border border-border bg-card p-6 shadow-xl"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Cluster CPU & Memory</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
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
                  <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={2} />
                  <Area type="monotone" dataKey="memory" stroke="#10b981" fillOpacity={1} fill="url(#colorMem)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="rounded-xl border border-border bg-card p-6 shadow-xl flex flex-col"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Pods by Namespace</h3>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1500}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="truncate">{entry.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
