import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Boxes } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [step, setStep] = useState(0);

  const steps = [
    "Scanning cluster...",
    "Loading nodes...",
    "Loading namespaces...",
    "Loading deployments...",
    "Rendering topology...",
    "Done."
  ];

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setStep(currentStep);
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 600); // Wait a bit after "Done." before triggering complete
      }
    }, 400); // 400ms per step

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <div className="flex flex-col items-center max-w-md w-full px-6 text-center">
        <motion.div
          animate={{ 
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.2, 1] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3, 
            ease: "linear" 
          }}
          className="mb-8 p-4 rounded-2xl bg-primary/10 text-primary"
        >
          <Boxes className="w-12 h-12" />
        </motion.div>
        
        <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-6">
          KubeVision
        </h2>

        <div className="w-full text-left bg-card border border-border/50 rounded-lg p-4 font-mono text-xs text-muted-foreground shadow-2xl">
          <AnimatePresence mode="popLayout">
            {steps.slice(0, step + 1).map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`py-1 ${i === step ? 'text-primary' : 'text-muted-foreground/60'}`}
              >
                <span className="mr-2">&gt;</span> {text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
