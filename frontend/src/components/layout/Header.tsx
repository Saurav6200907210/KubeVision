import React from 'react';
import { useUIStore } from '../../stores/ui.store';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, Monitor, User } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header() {
  const { theme, setTheme, setCommandPaletteOpen } = useUIStore();
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center flex-1 max-w-md">
        <button 
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center w-full bg-muted/50 hover:bg-muted border border-border/50 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-all group shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <Search className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
          <span>Search resources...</span>
          <div className="ml-auto flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-medium shadow-sm">Ctrl</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-medium shadow-sm">K</kbd>
          </div>
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border border-background"></span>
        </button>
        
        <div className="h-5 w-px bg-border mx-2"></div>
        
        <div className="flex items-center bg-muted/50 rounded-full p-0.5 border border-border/50">
          <button 
            onClick={() => setTheme('light')}
            className={`p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Sun className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setTheme('system')}
            className={`p-1.5 rounded-full transition-all ${theme === 'system' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setTheme('dark')}
            className={`p-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>
        
        <div className="h-5 w-px bg-border mx-2"></div>
        
        <button className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm hover:bg-primary/20 transition-colors">
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
