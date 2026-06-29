import React from "react";
import { Link } from "react-router-dom";
import {
  Server,
  Boxes,
  Network,
  GitBranch,
  Activity,
  ShieldCheck,
  ArrowRight,
  GitBranch as Github,
} from "lucide-react";
import { useClusterStore } from "../stores/cluster.store";

// A simple button component since we don't have the ui/button component
const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { size?: 'default' | 'lg' | 'sm' }>(
  ({ className, size = 'default', ...props }, ref) => {
    const sizeClasses = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-12 rounded-md px-8',
    };
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground font-medium transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${sizeClasses[size]} ${className || ''}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export default function Landing() {
  const { isConnected } = useClusterStore();
  const ctaLink = isConnected ? "/dashboard" : "/connect";
  const ctaText = isConnected ? "Go to Dashboard" : "Connect a Cluster";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Boxes className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">KubeVision</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#workflow" className="hover:text-foreground">Workflow</a>
            <a href="#stack" className="hover:text-foreground">Stack</a>
          </nav>
          <Link to={ctaLink}>
            <Button>Launch Dashboard <ArrowRight className="ml-1 h-4 w-4" /></Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(60% 50% at 50% 0%, oklch(0.62 0.18 265 / 0.18), transparent 70%), radial-gradient(40% 40% at 80% 20%, oklch(0.7 0.15 200 / 0.15), transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Works with Minikube, Kind, K3s & production clusters
          </div>
          <h1 className="mx-auto max-w-3xl text-5xl font-semibold tracking-tight md:text-6xl">
            Your Kubernetes cluster,{" "}
            <span className="bg-gradient-to-r from-primary to-[oklch(0.7_0.15_200)] bg-clip-text text-transparent">
              beautifully visualized
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            KubeVision is a modern dashboard to explore pods, deployments, services
            and topology in real time — connect once with a kubeconfig and you're in.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to={ctaLink}>
              <Button size="lg" className="h-12 px-6 text-base">
                {ctaText} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a
              href="#features"
              className="inline-flex h-12 items-center rounded-md border border-border bg-card px-6 text-base font-medium hover:bg-accent/40"
            >
              See features
            </a>
          </div>

          {/* Preview card */}
          <div className="mx-auto mt-16 max-w-5xl rounded-2xl border border-border bg-card p-2 shadow-2xl shadow-primary/10">
            <div className="rounded-xl bg-muted/40 p-6">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                {[
                  { label: "Nodes", value: "12" },
                  { label: "Pods", value: "248" },
                  { label: "Deployments", value: "37" },
                  { label: "Services", value: "54" },
                  { label: "Namespaces", value: "9" },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-border bg-background p-4 text-left">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
                    <div className="mt-2 text-2xl font-semibold">{s.value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-border bg-background p-4 text-left">
                  <div className="mb-3 text-sm font-medium">Pods by Namespace</div>
                  <div className="flex h-24 items-end gap-2">
                    {[40, 70, 55, 90, 35, 60, 80].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-gradient-to-t from-primary/60 to-primary"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-background p-4 text-left">
                  <div className="mb-3 text-sm font-medium">Cluster Status</div>
                  <ul className="space-y-2 text-sm">
                    {["api-server", "scheduler", "controller", "etcd"].map((s) => (
                      <li key={s} className="flex items-center justify-between">
                        <span className="text-muted-foreground">{s}</span>
                        <span className="inline-flex items-center gap-1.5 text-emerald-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Healthy
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-border bg-background p-4 text-left">
                  <div className="mb-3 text-sm font-medium">Recent Events</div>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li>✓ Scaled <b className="text-foreground">web</b> to 5</li>
                    <li>✓ Pod <b className="text-foreground">api-7f9</b> ready</li>
                    <li>✓ Service <b className="text-foreground">redis</b> created</li>
                    <li>✓ Node <b className="text-foreground">node-3</b> joined</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border/60 bg-muted/30 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Everything you need to run your cluster
            </h2>
            <p className="mt-3 text-muted-foreground">
              Built for engineers who want clarity, not complexity.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { icon: Server, title: "Real-time Resources", desc: "Pods, deployments, services, nodes and namespaces — always live." },
              { icon: Network, title: "Interactive Topology", desc: "Explore cluster → namespace → deployment → pod relationships on a canvas." },
              { icon: Activity, title: "Analytics Dashboard", desc: "Charts for namespace usage, service types and node distribution." },
              { icon: GitBranch, title: "YAML & Logs", desc: "Inspect manifests with Monaco and stream pod logs instantly." },
              { icon: ShieldCheck, title: "Local & Secure", desc: "Your kubeconfig stays on your machine. No third-party services." },
              { icon: Boxes, title: "Multi-Cluster Ready", desc: "Works with Minikube, Kind, K3s and managed production clusters." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-medium">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                From kubeconfig to insight in seconds
              </h2>
              <p className="mt-4 text-muted-foreground">
                Drop in your kubeconfig, name your cluster and you're done. KubeVision
                does the rest — fetching, visualizing and organizing every resource.
              </p>
              <ol className="mt-8 space-y-5">
                {[
                  ["Upload kubeconfig", "YAML or JSON, validated locally."],
                  ["Connect cluster", "We verify the API server and version."],
                  ["Explore", "Browse resources, topology and analytics."],
                ].map(([t, d], i) => (
                  <li key={t} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-medium">{t}</div>
                      <div className="text-sm text-muted-foreground">{d}</div>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-8">
                <Link to={ctaLink}>
                  <Button size="lg">Get started <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
              <pre className="overflow-x-auto rounded-lg bg-[oklch(0.18_0.04_265)] p-4 text-xs leading-relaxed text-[oklch(0.95_0.02_250)]">
{`apiVersion: v1
kind: Config
clusters:
- name: production
  cluster:
    server: https://k8s.example.com
contexts:
- name: prod
  context:
    cluster: production
    user: admin
current-context: prod`}
              </pre>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>kubeconfig.yaml</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Validated
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stack */}
      <section id="stack" className="border-t border-border/60 bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Built on a modern, reliable stack
          </h2>
          <p className="mt-2 text-muted-foreground">
            React · TypeScript · TailwindCSS · React Query · React Flow · Recharts · Node · Express · PostgreSQL
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card px-8 py-16 text-center shadow-xl">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Ready to see your cluster clearly?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Connect your first cluster in under a minute.
          </p>
          <div className="mt-8">
            <Link to={ctaLink}>
              <Button size="lg" className="h-12 px-8 text-base">
                Launch KubeVision <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <Boxes className="h-4 w-4 text-primary" />
            <span>© {new Date().getFullYear()} KubeVision</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="inline-flex items-center gap-1.5 hover:text-foreground">
              <Github className="h-4 w-4" /> GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
