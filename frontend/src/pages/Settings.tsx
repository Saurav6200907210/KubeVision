import React, { useState } from 'react';
import { useClusterStore } from '../stores/cluster.store';
import { useSettingsStore } from '../stores/settings.store';
import { useUIStore } from '../stores/ui.store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Server, Settings as SettingsIcon, LogOut, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function Settings() {
  const { cluster, setConnected } = useClusterStore();
  const { theme, refreshInterval, defaultNamespace, setSettings } = useSettingsStore();
  const { theme: uiTheme, setTheme: setUiTheme } = useUIStore();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleDisconnect = async () => {
    try {
      await api.post('/clusters/disconnect');
      setConnected(false, null);
      navigate('/connect');
    } catch (error) {
      console.error("Failed to disconnect", error);
    }
  };

  const saveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your dashboard preferences and cluster connection.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" />
            Cluster Connection
          </CardTitle>
          <CardDescription>Details about your currently connected Kubernetes cluster.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Cluster Name</span>
              <p className="text-base font-semibold">{cluster?.name || 'Local Cluster'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Kubernetes Version</span>
              <p className="text-base font-semibold">{cluster?.version || 'Unknown'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <p className="text-base font-semibold text-green-500">Connected</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border">
            <button 
              onClick={handleDisconnect}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 border border-destructive bg-transparent hover:bg-destructive hover:text-destructive-foreground text-destructive h-9 px-4 py-2"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect Cluster
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-primary" />
            Dashboard Preferences
          </CardTitle>
          <CardDescription>Customize your KubeVision experience.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Theme</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={uiTheme}
              onChange={(e) => {
                const val = e.target.value as 'light' | 'dark' | 'system';
                setUiTheme(val);
                setSettings({ theme: val === 'dark' ? 'dark' : 'light' });
              }}
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
              <option value="system">System Default</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Auto-Refresh Interval (Seconds)</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={refreshInterval}
              onChange={(e) => setSettings({ refreshInterval: parseInt(e.target.value) })}
            >
              <option value="5">5 seconds</option>
              <option value="15">15 seconds (Default)</option>
              <option value="30">30 seconds</option>
              <option value="60">60 seconds</option>
              <option value="0">Disabled</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Default Namespace</label>
            <input 
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={defaultNamespace}
              onChange={(e) => setSettings({ defaultNamespace: e.target.value })}
              placeholder="e.g. default"
            />
          </div>

          <button 
            onClick={saveSettings}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            {isSaving ? <Check className="mr-2 h-4 w-4" /> : null}
            {isSaving ? 'Saved!' : 'Save Preferences'}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
