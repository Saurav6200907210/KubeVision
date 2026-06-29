import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { Network } from 'lucide-react';

const initialNodes = [
  { id: '1', position: { x: 250, y: 0 }, data: { label: 'Ingress (nginx)' }, type: 'input' },
  { id: '2', position: { x: 250, y: 100 }, data: { label: 'Service (frontend-svc)' } },
  { id: '3', position: { x: 250, y: 200 }, data: { label: 'Deployment (frontend)' } },
  { id: '4', position: { x: 100, y: 300 }, data: { label: 'Pod (frontend-a)' } },
  { id: '5', position: { x: 250, y: 300 }, data: { label: 'Pod (frontend-b)' } },
  { id: '6', position: { x: 400, y: 300 }, data: { label: 'Pod (frontend-c)' } },
  { id: '7', position: { x: 250, y: 450 }, data: { label: 'Node (worker-1)' }, type: 'output' },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#3b82f6' } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#3b82f6' } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#10b981' } },
  { id: 'e3-5', source: '3', target: '5', animated: true, style: { stroke: '#10b981' } },
  { id: 'e3-6', source: '3', target: '6', animated: true, style: { stroke: '#10b981' } },
  { id: 'e4-7', source: '4', target: '7', animated: true, style: { stroke: '#8b5cf6' } },
  { id: 'e5-7', source: '5', target: '7', animated: true, style: { stroke: '#8b5cf6' } },
  { id: 'e6-7', source: '6', target: '7', animated: true, style: { stroke: '#8b5cf6' } },
];

export default function TopologySection() {
  const nodes = useMemo(() => initialNodes, []);
  const edges = useMemo(() => initialEdges, []);

  return (
    <section className="py-24 border-t border-border/50 relative">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <Network className="w-8 h-8 text-primary" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight md:text-4xl"
          >
            Interactive Topology Graph
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            See exactly how your traffic flows. Map relationships from Ingress to Node instantly.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="h-[600px] rounded-2xl border border-border/50 bg-card overflow-hidden shadow-2xl relative"
        >
          <ReactFlow 
            nodes={nodes} 
            edges={edges} 
            fitView 
            className="bg-muted/10"
            nodesConnectable={false}
            nodesDraggable={true}
            zoomOnScroll={false}
            preventScrolling={false}
          >
            <Background color="#ccc" gap={16} />
            <Controls />
            <MiniMap 
              nodeColor={(node) => {
                switch (node.type) {
                  case 'input': return '#3b82f6';
                  case 'output': return '#8b5cf6';
                  default: return '#10b981';
                }
              }}
              maskColor="rgba(0, 0, 0, 0.2)"
            />
          </ReactFlow>
        </motion.div>
      </div>
    </section>
  );
}
