import React, { useState } from 'react';
import { useClusterStore } from '../stores/cluster.store';
import { useNavigate } from 'react-router-dom';
import { useConnectCluster } from '../hooks/useK8s';
import { UploadCloud, Server, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function ClusterConnect() {
  const { setConnected } = useClusterStore();
  const navigate = useNavigate();
  const { mutate: connectCluster, isPending, error } = useConnectCluster();
  
  const [clusterName, setClusterName] = useState('');
  const [kubeconfig, setKubeconfig] = useState('');
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setKubeconfig(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clusterName || !kubeconfig) return;

    connectCluster(
      { name: clusterName, kubeconfig },
      {
        onSuccess: (data) => {
          setConnected(true, data.cluster);
          navigate('/');
        }
      }
    );
  };

  return (
    <div className="flex h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-xl">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Server className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <Card className="border-border/50 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Connect your Cluster</CardTitle>
            <CardDescription>Upload your kubeconfig file to visualize and manage your Kubernetes cluster.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleConnect} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Cluster Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Production Cluster, Minikube, Kind"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={clusterName}
                  onChange={(e) => setClusterName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Kubeconfig</label>
                
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer relative group">
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                  />
                  <UploadCloud className="w-8 h-8 mx-auto text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                  {kubeconfig ? (
                    <span className="text-sm font-medium text-green-500">File uploaded successfully</span>
                  ) : (
                    <>
                      <span className="text-sm font-medium block mb-1">Click to upload or drag and drop</span>
                      <span className="text-xs text-muted-foreground">YAML or JSON kubeconfig file</span>
                    </>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{(error as any).response?.data?.error || error.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isPending || !clusterName || !kubeconfig}
                className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect Cluster'
                )}
              </button>
            </form>
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-muted-foreground mt-8">
          All data remains strictly local. KubeVision does not send your cluster credentials to any external servers.
        </p>
      </div>
    </div>
  );
}
