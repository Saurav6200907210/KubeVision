import React, { useState, useEffect } from 'react';
import { useClusterStore } from '../stores/cluster.store';
import { Link, useNavigate } from 'react-router-dom';
import { Server, Loader2, AlertCircle, ArrowLeft, Download, Monitor, Apple, MonitorCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import api from '../lib/api';

export default function ClusterConnect() {
  const { setConnected } = useClusterStore();
  const navigate = useNavigate();
  
  const [sessionId, setSessionId] = useState<string>('');
  const [pairingCode, setPairingCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string>('');
  const [os, setOs] = useState<'win' | 'macos' | 'linux'>('win');
  const [showHelp, setShowHelp] = useState(false);
  
  // Base URL calculation to dynamically give the user the correct backend URL
  const backendBaseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') : 'http://localhost:4000';

  useEffect(() => {
    // Generate or retrieve session ID
    let currentSession = localStorage.getItem('sessionId');
    if (!currentSession) {
      currentSession = crypto.randomUUID();
      localStorage.setItem('sessionId', currentSession);
    }
    setSessionId(currentSession);
  }, []);

  const handleGenerateCode = async () => {
    try {
      setIsGenerating(true);
      setError('');
      const res = await api.post('/connector/pair', { sessionId });
      setPairingCode(res.data.code);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to generate pairing code');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVerify = async () => {
    try {
      setIsVerifying(true);
      setError('');
      // Try to fetch namespaces to verify the connection works
      await api.get('/namespaces');
      
      setConnected(true, {
        id: 'local-cluster',
        name: 'Local Cluster',
        context: 'local',
        server: 'Local Connector'
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError('Connection not established yet. Make sure the connector is running.');
    } finally {
      setIsVerifying(false);
    }
  };

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-background p-4 relative">
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
      
      <div className="w-full max-w-xl">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Server className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <Card className="border-border/50 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Connect Local Cluster</CardTitle>
            <CardDescription>Use the KubeVision Local Connector to securely connect your local Kubernetes cluster without exposing it.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {!pairingCode ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Generate a pairing code to link your local machine with this session.
                </p>
                <button
                  onClick={handleGenerateCode}
                  disabled={isGenerating || !sessionId}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-2"
                >
                  {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Generate Pairing Code
                </button>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-6 bg-muted/30 rounded-xl text-center border border-border/50">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Your Pairing Code</h3>
                  <div className="text-4xl font-mono font-bold tracking-widest text-primary">
                    {pairingCode}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Expires in 5 minutes</p>
                </div>

                <div className="space-y-4">
                  <div className="mb-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-600 dark:text-blue-400 transition-all duration-300">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Prerequisite
                      </h3>
                      <button 
                        onClick={() => setShowHelp(!showHelp)}
                        className="text-xs flex items-center gap-1 hover:underline focus:outline-none font-medium bg-blue-500/20 px-2 py-1 rounded"
                      >
                        {showHelp ? "Hide help" : "Need help?"}
                      </button>
                    </div>
                    <p>Ensure your local Kubernetes cluster (e.g., Minikube or Docker Desktop) is running before starting the connector.</p>
                    
                    {showHelp && (
                      <div className="mt-4 p-3 bg-white/60 dark:bg-black/30 rounded-md border border-blue-500/10 text-left space-y-4 text-xs text-foreground/90 shadow-sm animate-in fade-in slide-in-from-top-2">
                        <div>
                          <strong className="text-foreground block mb-1">1. Sabse pehle Docker start karein</strong>
                          <p>Ensure karein ki aapke system par Docker Desktop application open hai aur background mein chal rahi hai. (Docker icon aapke taskbar mein hona chahiye aur "Engine running" dikhana chahiye).</p>
                        </div>
                        <div>
                          <strong className="text-foreground block mb-1">2. Minikube Start Command</strong>
                          <p className="mb-1">Apna terminal (PowerShell) open karein aur Minikube ko Docker driver ke sath start karne ke liye ye command chalayein:</p>
                          <pre className="bg-muted/80 p-2 rounded overflow-x-auto text-muted-foreground border border-border/50 font-mono"><code>minikube start --driver=docker</code></pre>
                          <p className="mt-1 opacity-80 italic">Note: Ye command Docker ke andar ek container banayega aur usme poora Kubernetes cluster setup karega. Isme thoda time lag sakta hai.</p>
                        </div>
                        <div>
                          <strong className="text-foreground block mb-1">3. Verify karein ki cluster chal gaya hai</strong>
                          <p className="mb-1">Jab upar wali command complete ho jaye, to ye check karne ke liye ki sab kuch theek se chal raha hai, ye command run karein:</p>
                          <pre className="bg-muted/80 p-2 rounded overflow-x-auto text-muted-foreground border border-border/50 font-mono"><code>kubectl get nodes</code></pre>
                          <p className="mt-1 opacity-80 italic">(Aapko minikube naam ka ek node dikhega jiska status Ready hoga.)</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold mb-2">1. Download Connector</h3>
                  
                  <div className="flex gap-2 mb-4">
                    <button 
                      onClick={() => setOs('win')} 
                      className={`flex-1 py-2 px-3 rounded-md border text-sm flex items-center justify-center gap-2 transition-colors ${os === 'win' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                    >
                      <Monitor className="w-4 h-4" /> Windows
                    </button>
                    <button 
                      onClick={() => setOs('macos')} 
                      className={`flex-1 py-2 px-3 rounded-md border text-sm flex items-center justify-center gap-2 transition-colors ${os === 'macos' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                    >
                      <Apple className="w-4 h-4" /> macOS
                    </button>
                    <button 
                      onClick={() => setOs('linux')} 
                      className={`flex-1 py-2 px-3 rounded-md border text-sm flex items-center justify-center gap-2 transition-colors ${os === 'linux' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                    >
                      <MonitorCheck className="w-4 h-4" /> Linux
                    </button>
                  </div>

                  <a 
                    href={`https://github.com/Saurav6200907210/KubeVision/releases/latest/download/kubevision-connector-${os === 'win' ? 'win.exe' : os === 'macos' ? 'macos' : 'linux'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center rounded-md border border-primary/20 bg-primary/10 hover:bg-primary/20 text-primary h-10 px-4 font-medium transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download kubevision-connector{os === 'win' ? '.exe' : ''}
                  </a>

                  <h3 className="text-sm font-semibold mt-6 mb-2">2. Open Terminal and Start</h3>
                  <p className="text-xs text-muted-foreground mb-2">Run this command in the folder where you downloaded the file:</p>
                  <div className="relative group">
                    <pre className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto border border-border/50">
                      <code>
                        {os === 'win' ? '.\\kubevision-connector-win.exe' : os === 'macos' ? 'chmod +x ./kubevision-connector-macos && ./kubevision-connector-macos' : 'chmod +x ./kubevision-connector-linux && ./kubevision-connector-linux'} pair {pairingCode} -u {backendBaseUrl}
                        <br/>
                        {os === 'win' ? '.\\kubevision-connector-win.exe' : os === 'macos' ? './kubevision-connector-macos' : './kubevision-connector-linux'} start
                      </code>
                    </pre>
                  </div>
                </div>

                <button
                  onClick={handleVerify}
                  disabled={isVerifying}
                  className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying Connection...
                    </>
                  ) : (
                    'I have started the connector'
                  )}
                </button>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
