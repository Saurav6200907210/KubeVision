import React, { useMemo, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState, Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import { useTopology } from '../hooks/useK8s';
import { Loader2, Server, Box, Component, Network, Cuboid } from 'lucide-react';

const CustomNode = ({ data }: any) => {
  const getIcon = () => {
    switch(data.type) {
      case 'cluster': return <Server className="w-5 h-5 text-blue-500" />;
      case 'namespace': return <Box className="w-5 h-5 text-purple-500" />;
      case 'deployment': return <Component className="w-5 h-5 text-orange-500" />;
      case 'service': return <Network className="w-5 h-5 text-pink-500" />;
      case 'pod': return <Cuboid className="w-5 h-5 text-green-500" />;
      default: return <Box className="w-5 h-5" />;
    }
  };

  const getStatusColor = () => {
    if (!data.status) return 'border-border';
    const s = data.status.toLowerCase();
    if (s === 'running') return 'border-green-500';
    if (s === 'pending') return 'border-yellow-500';
    if (s === 'failed') return 'border-red-500';
    return 'border-border';
  };

  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-card border-2 ${getStatusColor()} flex items-center gap-3 min-w-[150px]`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <div className="p-1.5 bg-muted rounded-md">
        {getIcon()}
      </div>
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{data.type}</div>
        <div className="text-sm font-medium">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export default function Topology() {
  const [namespace, setNamespace] = useState<string>('all');
  const { data: topologyData, isLoading } = useTopology(namespace);

  // Auto-layout simple algorithm: 
  // Cluster at top, Namespaces next level, Deployments/Services next, Pods at bottom.
  const layoutedNodes = useMemo(() => {
    if (!topologyData?.nodes) return [];
    
    const nodes = [...topologyData.nodes];
    const levels: Record<string, number> = {
      'cluster': 0,
      'namespace': 1,
      'deployment': 2,
      'service': 2,
      'pod': 3
    };

    const ySpacing = 150;
    const xSpacing = 250;
    
    // Group nodes by level
    const groupedNodes: Record<number, any[]> = { 0: [], 1: [], 2: [], 3: [] };
    
    nodes.forEach(node => {
      const level = levels[node.data.type as string] ?? 4;
      if (groupedNodes[level]) {
        groupedNodes[level].push(node);
      }
    });

    // Position nodes based on groups
    let positionedNodes: any[] = [];
    Object.keys(groupedNodes).forEach(levelStr => {
      const level = parseInt(levelStr);
      const levelNodes = groupedNodes[level];
      const totalWidth = levelNodes.length * xSpacing;
      const startX = -totalWidth / 2 + xSpacing / 2;

      levelNodes.forEach((node, i) => {
        positionedNodes.push({
          ...node,
          position: {
            x: startX + (i * xSpacing),
            y: level * ySpacing
          }
        });
      });
    });

    return positionedNodes;
  }, [topologyData]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Analyzing cluster topology...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6rem)] w-full flex flex-col space-y-4">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Resource Topology</h2>
          <p className="text-muted-foreground">Interactive dependency graph of your cluster resources.</p>
        </div>
        
        <select 
          className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={namespace}
          onChange={(e) => setNamespace(e.target.value)}
        >
          <option value="all">All Namespaces</option>
          <option value="default">default</option>
          <option value="kube-system">kube-system</option>
        </select>
      </div>

      <div className="flex-1 w-full rounded-xl border border-border bg-muted/20 overflow-hidden relative">
        <ReactFlow
          nodes={layoutedNodes}
          edges={topologyData?.edges || []}
          nodeTypes={nodeTypes}
          fitView
          className="bg-transparent"
        >
          <Background color="#555" gap={16} />
          <Controls className="bg-background border-border fill-foreground" />
          <MiniMap className="bg-background border border-border" nodeColor="#3b82f6" maskColor="rgba(0,0,0,0.2)" />
        </ReactFlow>
      </div>
    </div>
  );
}
