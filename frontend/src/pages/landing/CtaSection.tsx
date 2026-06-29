import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CtaSection({ ctaLink }: { ctaLink: string }) {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="mx-auto max-w-4xl px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden p-[1px]"
        >
          {/* Animated Gradient Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] animate-shimmer opacity-50" />
          
          <div className="relative rounded-3xl bg-card border border-border/50 p-12 text-center shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-6 text-foreground relative z-10">
              Ready to see your cluster clearly?
            </h2>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground mb-10 relative z-10">
              Drop in your kubeconfig and experience the most beautiful Kubernetes dashboard ever built. Takes less than a minute.
            </p>
            
            <div className="relative z-10">
              <Link to={ctaLink}>
                <button className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-primary px-10 font-semibold text-primary-foreground transition-transform hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <span className="relative flex items-center gap-2">
                    Launch KubeVision 
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
