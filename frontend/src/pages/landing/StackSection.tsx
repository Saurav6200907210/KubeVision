import React from 'react';
import { motion } from 'framer-motion';

const TECH_STACK = [
  "React", "TypeScript", "TailwindCSS", "Framer Motion", 
  "React Query", "React Flow", "Recharts", "Node.js", 
  "Express", "PostgreSQL", "Docker", "Kubernetes"
];

export default function StackSection() {
  return (
    <section id="stack" className="py-32 bg-background border-t border-border/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0,transparent_70%)]" />
      
      <div className="mx-auto max-w-6xl px-6 text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-semibold tracking-tight md:text-3xl mb-12"
        >
          Built on a modern, reliable stack
        </motion.h2>
        
        <div className="flex flex-wrap items-center justify-center gap-4 max-w-4xl mx-auto">
          {TECH_STACK.map((tech, i) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, type: 'spring' }}
              animate={{
                y: [0, -8, 0],
              }}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(59,130,246,0.1)' }}
              className="px-6 py-3 rounded-full border border-border/60 bg-card shadow-sm font-medium text-sm text-foreground transition-colors cursor-default"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${3 + Math.random()}s`,
                animationIterationCount: 'infinite',
                animationName: 'float'
              }}
            >
              {tech}
            </motion.div>
          ))}
        </div>
        
        <style>{`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0px); }
          }
        `}</style>
      </div>
    </section>
  );
}
