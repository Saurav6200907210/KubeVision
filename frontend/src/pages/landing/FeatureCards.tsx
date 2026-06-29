import React from 'react';
import { motion } from 'framer-motion';
import { Server, Network, Activity, GitBranch, ShieldCheck, Boxes } from 'lucide-react';

export default function FeatureCards() {
  const features = [
    { icon: Server, title: "Real-time Resources", desc: "Pods, deployments, services, nodes and namespaces — always live." },
    { icon: Network, title: "Interactive Topology", desc: "Explore cluster → namespace → deployment → pod relationships on a canvas." },
    { icon: Activity, title: "Analytics Dashboard", desc: "Charts for namespace usage, service types and node distribution." },
    { icon: GitBranch, title: "YAML & Logs", desc: "Inspect manifests with Monaco and stream pod logs instantly." },
    { icon: ShieldCheck, title: "Local & Secure", desc: "Your kubeconfig stays on your machine. No third-party services." },
    { icon: Boxes, title: "Multi-Cluster Ready", desc: "Works with Minikube, Kind, K3s and managed production clusters." },
  ];

  return (
    <section id="features" className="py-24 border-t border-border/50 relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight md:text-4xl"
          >
            Everything you need to run your cluster
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Built for engineers who want clarity, not complexity.
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div 
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
