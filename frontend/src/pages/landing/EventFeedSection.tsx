import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const EVENT_TEMPLATES = [
  { text: "Scaled deployment 'web-frontend' to 5 replicas", type: 'success' },
  { text: "Pod 'api-7f92b-xyz' is now ready", type: 'success' },
  { text: "Node 'worker-03' joined the cluster", type: 'info' },
  { text: "ConfigMap 'app-config' mounted successfully", type: 'info' },
  { text: "Secret 'tls-certs' created", type: 'info' },
  { text: "HorizontalPodAutoscaler triggered for 'checkout-service'", type: 'warning' },
  { text: "Ingress 'main-ingress' updated", type: 'success' },
  { text: "Certificate 'domain-tls' renewed", type: 'success' },
  { text: "ImagePullBackOff on pod 'worker-batch-92'", type: 'warning' }
];

export default function EventFeedSection() {
  const [events, setEvents] = useState<{ id: number; text: string; type: string; time: string }[]>([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // Initial events
    setEvents([
      { id: 1, text: "Cluster connection established", type: 'success', time: "Just now" },
    ]);

    const interval = setInterval(() => {
      setCounter(c => c + 1);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (counter === 0) return;
    const randomEvent = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
    const newEvent = {
      id: Date.now(),
      text: randomEvent.text,
      type: randomEvent.type,
      time: "Just now"
    };

    setEvents(prev => [newEvent, ...prev].slice(0, 6)); // keep max 6
  }, [counter]);

  return (
    <section className="py-24 bg-muted/20 border-t border-border/50">
      <div className="mx-auto max-w-6xl px-6 grid gap-12 lg:grid-cols-2 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6"
          >
            <Activity className="w-8 h-8 text-primary" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight md:text-4xl"
          >
            Real-time Activity Stream
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Keep your finger on the pulse. See scaling events, pod restarts, config updates, and errors as they happen.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border bg-card p-6 shadow-2xl relative overflow-hidden min-h-[420px]"
        >
          <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live Events
            </h3>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">default namespace</span>
          </div>
          
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {events.map((ev) => (
                <motion.div
                  key={ev.id}
                  layout
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="flex items-start gap-4 p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="mt-0.5">
                    {ev.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {ev.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                    {ev.type === 'info' && <Info className="w-4 h-4 text-blue-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{ev.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{ev.time}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
