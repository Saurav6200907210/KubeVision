import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Boxes } from 'lucide-react';
import { useCountUp } from '../../hooks/useCountUp';

export default function HeroSection({ ctaLink, ctaText }: { ctaLink: string; ctaText: string }) {
  const [liveData, setLiveData] = useState({ pods: 248, cpu: 42, memory: 4.2 });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData({
        pods: 240 + Math.floor(Math.random() * 20),
        cpu: 35 + Math.floor(Math.random() * 25),
        memory: 3.5 + (Math.random() * 1.5),
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const animatedPods = useCountUp(liveData.pods, 1);
  const animatedCpu = useCountUp(liveData.cpu, 1);
  const animatedMemory = useCountUp(liveData.memory * 10, 1) / 10; // hack for 1 decimal

  return (
    <section className="relative overflow-hidden pt-32 pb-24">
      {/* Animated Background Gradients */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(60% 50% at 50% 0%, oklch(0.62 0.18 265 / 0.18), transparent 70%), radial-gradient(40% 40% at 80% 20%, oklch(0.7 0.15 200 / 0.15), transparent 70%)",
          backgroundSize: '200% 200%'
        }}
      />
      
      <div className="mx-auto max-w-6xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary shadow-[0_0_15px_rgba(59,130,246,0.15)]"
        >
          <motion.span 
            animate={{ opacity: [1, 0.3, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }} 
            className="h-1.5 w-1.5 rounded-full bg-primary" 
          />
          Live preview of production cluster
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-4xl text-5xl font-bold tracking-tight md:text-7xl"
        >
          Your Kubernetes cluster,{" "}
          <span className="bg-gradient-to-r from-primary to-[oklch(0.7_0.15_200)] bg-clip-text text-transparent">
            beautifully visualized
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          KubeVision is a modern dashboard to explore pods, deployments, services
          and topology in real time — connect once with a kubeconfig and you're in.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link to={ctaLink}>
            <button className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-primary px-8 font-medium text-primary-foreground transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <span className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-shimmer" />
              <span className="relative flex items-center gap-2">
                {ctaText} 
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </span>
            </button>
          </Link>
          <a
            href="#features"
            className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-card px-8 font-medium transition-all hover:bg-accent/40 hover:shadow-lg hover:border-primary/30"
          >
            Explore features
          </a>
        </motion.div>

        {/* Live Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, type: 'spring' }}
          className="mx-auto mt-20 max-w-5xl rounded-2xl border border-border/50 bg-card/40 p-2 shadow-2xl shadow-primary/10 backdrop-blur-xl group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="rounded-xl bg-background/80 p-6 relative overflow-hidden border border-border/50">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: "Pods", value: animatedPods, max: 300, color: "text-blue-500" },
                { label: "CPU Usage", value: `${animatedCpu}%`, max: 100, color: "text-green-500" },
                { label: "Memory", value: `${animatedMemory}GB`, max: 8, color: "text-purple-500" },
                { label: "Node Count", value: 12, max: 12, color: "text-orange-500" },
              ].map((s, i) => (
                <motion.div 
                  key={s.label}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="rounded-lg border border-border/50 bg-card p-4 text-left shadow-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Boxes className={`w-12 h-12 ${s.color}`} />
                  </div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{s.label}</div>
                  <div className="mt-2 text-3xl font-bold tracking-tight text-foreground flex items-baseline gap-1">
                    {s.value}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
