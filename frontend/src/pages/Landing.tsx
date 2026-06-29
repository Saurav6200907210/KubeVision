import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Boxes, GitBranch as Github } from "lucide-react";
import { useClusterStore } from "../stores/cluster.store";
import { motion, AnimatePresence } from "framer-motion";

// Sections
import LoadingScreen from "./landing/LoadingScreen";
import HeroSection from "./landing/HeroSection";
import FeatureCards from "./landing/FeatureCards";
import ChartsSection from "./landing/ChartsSection";
import TopologySection from "./landing/TopologySection";
import TerminalSection from "./landing/TerminalSection";
import EventFeedSection from "./landing/EventFeedSection";
import StackSection from "./landing/StackSection";
import CtaSection from "./landing/CtaSection";

export default function Landing() {
  const { isConnected } = useClusterStore();
  const ctaLink = isConnected ? "/dashboard" : "/connect";
  const ctaText = isConnected ? "Go to Dashboard" : "Connect a Cluster";
  
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Nav */}
        <header className="fixed top-0 inset-x-0 z-40 border-b border-border/40 bg-background/60 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2 group cursor-default">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Boxes className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight">KubeVision</span>
            </div>
            <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#stack" className="hover:text-foreground transition-colors">Stack</a>
            </nav>
            <Link to={ctaLink}>
              <button className="h-9 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
                Launch Dashboard
              </button>
            </Link>
          </div>
        </header>

        <main>
          <HeroSection ctaLink={ctaLink} ctaText={ctaText} />
          <ChartsSection />
          <FeatureCards />
          <TerminalSection />
          <TopologySection />
          <EventFeedSection />
          <StackSection />
          <CtaSection ctaLink={ctaLink} />
        </main>

        <footer className="border-t border-border/50 py-12 bg-background">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 text-sm text-muted-foreground md:flex-row">
            <div className="flex items-center gap-2">
              <Boxes className="h-5 w-5 text-primary" />
              <span className="font-medium">© {new Date().getFullYear()} KubeVision by Saurav Kumar. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="https://github.com/Saurav6200907210/KubeVision" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-foreground transition-colors font-medium">
                <Github className="h-4 w-4" /> GitHub
              </a>
            </div>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
