import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Code2 } from 'lucide-react';
import { useTypewriter } from '../../hooks/useTypewriter';
import Editor from '@monaco-editor/react';

export default function TerminalSection() {
  const terminalText = `user@kubevision:~$ kubectl get pods -n kube-system
NAME                                      READY   STATUS    RESTARTS   AGE
coredns-5d78c9869d-2m8z9                  1/1     Running   0          42d
etcd-minikube                             1/1     Running   0          42d
kube-apiserver-minikube                   1/1     Running   0          42d
kube-controller-manager-minikube          1/1     Running   0          42d
kube-proxy-7q9h2                          1/1     Running   0          42d
kube-scheduler-minikube                   1/1     Running   0          42d
storage-provisioner                       1/1     Running   1          42d

user@kubevision:~$ kubectl get svc
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   42d
redis-svc    ClusterIP   10.96.2.14   <none>        6379/TCP  2d

user@kubevision:~$ `;

  const yamlText = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-deployment
  labels:
    app: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: nginx:1.21.6-alpine
        ports:
        - containerPort: 80
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"`;

  const { displayedText: termOutput, isTyping: termTyping } = useTypewriter(terminalText, 25, true);
  const { displayedText: yamlOutput } = useTypewriter(yamlText, 35, true);

  return (
    <section className="py-24 relative overflow-hidden bg-muted/20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight md:text-4xl"
          >
            Live Logs & Real-time Configurations
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Say goodbye to static dashboards. Stream pod logs, execute terminal commands, 
            and edit live YAML manifests with a built-in Monaco Editor.
          </motion.p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Terminal */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl border border-border/50 bg-[#1e1e1e] overflow-hidden shadow-2xl shadow-primary/10"
          >
            <div className="flex items-center px-4 py-2 bg-[#2d2d2d] border-b border-[#404040]">
              <div className="flex gap-1.5 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="text-xs text-[#a0a0a0] flex items-center gap-2 font-medium">
                <Terminal className="w-3 h-3" /> bash
              </div>
            </div>
            <div className="p-4 font-mono text-sm h-[320px] overflow-y-auto whitespace-pre-wrap text-[#d4d4d4] leading-relaxed">
              <span className="text-emerald-400 font-semibold">{termOutput}</span>
              {termTyping && <span className="animate-pulse bg-[#d4d4d4] w-2 h-4 inline-block align-middle ml-1" />}
            </div>
          </motion.div>

          {/* Monaco YAML Editor */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl border border-border/50 bg-[#1e1e1e] overflow-hidden shadow-2xl shadow-primary/10 relative"
          >
            <div className="flex items-center px-4 py-2 bg-[#2d2d2d] border-b border-[#404040]">
              <div className="text-xs text-[#a0a0a0] flex items-center gap-2 font-medium">
                <Code2 className="w-3 h-3" /> deployment.yaml
              </div>
            </div>
            <div className="h-[320px] pointer-events-none opacity-80">
              <Editor
                height="100%"
                defaultLanguage="yaml"
                theme="vs-dark"
                value={yamlOutput}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 13,
                  lineNumbers: 'on',
                  readOnly: true,
                  wordWrap: 'on',
                  cursorBlinking: 'smooth',
                  cursorStyle: 'line'
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
