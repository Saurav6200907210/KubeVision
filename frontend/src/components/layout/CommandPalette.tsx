import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../stores/ui.store';
import { useNavigate } from 'react-router-dom';
import { Search, Command, FileCode, Box, Server, Cuboid, Network } from 'lucide-react';

export function CommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  const handleAction = (path: string) => {
    navigate(path);
    setCommandPaletteOpen(false);
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-24"
        onClick={() => setCommandPaletteOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-lg bg-card border border-border shadow-2xl rounded-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center border-b border-border px-4 py-3">
            <Search className="w-5 h-5 text-muted-foreground mr-3" />
            <input
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              placeholder="Type a command or search..."
            />
            <div className="flex gap-1">
              <kbd className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground border border-border">ESC</kbd>
            </div>
          </div>
          
          <div className="p-2 max-h-[300px] overflow-y-auto">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigation</div>
            <button onClick={() => handleAction('/dashboard')} className="w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-primary/10 hover:text-primary transition-colors text-left text-foreground">
              <Command className="w-4 h-4 mr-3 text-muted-foreground" /> Go to Dashboard
            </button>
            <button onClick={() => handleAction('/dashboard/pods')} className="w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-primary/10 hover:text-primary transition-colors text-left text-foreground">
              <Cuboid className="w-4 h-4 mr-3 text-muted-foreground" /> View Pods
            </button>
            <button onClick={() => handleAction('/dashboard/deployments')} className="w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-primary/10 hover:text-primary transition-colors text-left text-foreground">
              <Box className="w-4 h-4 mr-3 text-muted-foreground" /> View Deployments
            </button>
            <button onClick={() => handleAction('/dashboard/services')} className="w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-primary/10 hover:text-primary transition-colors text-left text-foreground">
              <Network className="w-4 h-4 mr-3 text-muted-foreground" /> View Services
            </button>
            <button onClick={() => handleAction('/dashboard/nodes')} className="w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-primary/10 hover:text-primary transition-colors text-left text-foreground">
              <Server className="w-4 h-4 mr-3 text-muted-foreground" /> View Nodes
            </button>
            
            <div className="px-2 py-1.5 mt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</div>
            <button className="w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-primary/10 hover:text-primary transition-colors text-left text-foreground">
              <FileCode className="w-4 h-4 mr-3 text-muted-foreground" /> Create Resource from YAML
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
