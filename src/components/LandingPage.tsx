import React from 'react';
import { 
  Terminal, 
  Cpu, 
  Code2, 
  Play, 
  CheckCircle2, 
  Download, 
  Wrench, 
  Layers, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  Smartphone,
  Gamepad2,
  Server
} from 'lucide-react';

interface LandingPageProps {
  onStartForging: () => void;
  onLaunchDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartForging, onLaunchDemo }) => {
  return (
    <div className="w-full bg-[#080b12] text-slate-100 selection:bg-cyan-500/30">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-4 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle background plasma illumination */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/10 to-amber-600/10 blur-[120px] pointer-events-none" />

        <div className="text-center relative z-10 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            SENIOR AI SOFTWARE ENGINEER PLATFORM
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
            DEVFORGE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-amber-400">AI</span>
          </h1>

          <p className="text-xl sm:text-2xl font-mono text-cyan-400/90 font-medium tracking-wide mb-6">
            “Describe it. Forge it.”
          </p>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            Build websites, applications, games and software with an autonomous senior AI development engineer. Complete with multi-file generation, interactive workspace, sandboxed live preview, and automated debugging.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={onStartForging}
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm tracking-wider uppercase shadow-xl shadow-cyan-950/60 transition-all flex items-center justify-center gap-2 group"
            >
              <span>START FORGING</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onLaunchDemo}
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>VIEW DEMO (DRAGON ARENA)</span>
            </button>
          </div>

          {/* Initial 4,500 Forge Tokens Callout */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/70 border border-slate-800 text-xs font-mono text-slate-400">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>New accounts receive <strong className="text-white font-bold">4,500 Forge Tokens</strong> (1,500 Welcome + 3,000 Starter)</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">100% Free Platform</span>
          </div>
        </div>

        {/* IDE Preview Mockup */}
        <div className="mt-14 relative rounded-xl border border-slate-700/60 bg-[#090d16] p-2 shadow-2xl shadow-cyan-950/40 max-w-5xl mx-auto overflow-hidden">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-[#0c111c] text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="ml-2 text-slate-300 font-semibold">dragon-arena / src / game.js</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20">LIVE PREVIEW ACTIVE</span>
              <span className="text-slate-500">60 FPS</span>
            </div>
          </div>

          {/* Workspace split columns simulation */}
          <div className="grid grid-cols-12 gap-0 text-xs font-mono h-64 sm:h-80 overflow-hidden">
            {/* File Tree Left */}
            <div className="col-span-3 bg-[#080b12] border-r border-slate-800 p-3 hidden sm:block text-slate-400">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">PROJECT TREE</div>
              <div className="space-y-1 text-[11px]">
                <div className="text-cyan-400 font-medium">├── index.html</div>
                <div className="text-cyan-400 font-medium">├── style.css</div>
                <div className="text-amber-400 font-medium bg-slate-800/60 px-1 py-0.5 rounded">├── game.js (Active)</div>
                <div className="text-slate-400">├── README.md</div>
              </div>
            </div>

            {/* Code Center */}
            <div className="col-span-12 sm:col-span-5 bg-[#0b0f19] p-4 text-slate-300 overflow-hidden leading-relaxed font-mono">
              <span className="text-slate-600">01</span> <span className="text-purple-400">import</span> &#123; Vector2 &#125; <span className="text-purple-400">from</span> <span className="text-emerald-400">'./physics'</span>;<br/>
              <span className="text-slate-600">02</span> <br/>
              <span className="text-slate-600">03</span> <span className="text-blue-400">class</span> <span className="text-amber-400">DragonEngine</span> &#123;<br/>
              <span className="text-slate-600">04</span> &nbsp;&nbsp;<span className="text-purple-400">constructor</span>(canvas) &#123;<br/>
              <span className="text-slate-600">05</span> &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-cyan-400">this</span>.flamePower = <span className="text-amber-400">100</span>;<br/>
              <span className="text-slate-600">06</span> &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-cyan-400">this</span>.mountVirtualDpad();<br/>
              <span className="text-slate-600">07</span> &nbsp;&nbsp;&#125;<br/>
              <span className="text-slate-600">08</span> &nbsp;&nbsp;<span className="text-blue-400">emitThermalBreath</span>(angle) &#123;<br/>
              <span className="text-slate-600">09</span> &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-cyan-400">this</span>.particles.spawnSwarm(angle);<br/>
              <span className="text-slate-600">10</span> &nbsp;&nbsp;&#125;<br/>
              <span className="text-slate-600">11</span> &#125;
            </div>

            {/* AI Assistant Right */}
            <div className="col-span-4 bg-[#090d16] border-l border-slate-800 p-3 hidden sm:flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-2">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>DEVFORGE SENIOR AI</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  “Architected dual-stick canvas game loop. Thermal particle emitter compiled with zero external dependencies. Live sandbox ready.”
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">HTML5 Canvas</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">Web Audio Synth</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">Touch D-Pad</span>
                </div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] text-emerald-400 flex items-center justify-between">
                <span>ESTIMATED TOKENS: 180</span>
                <span className="font-bold">VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Loop / How It Works */}
      <section className="py-20 border-t border-slate-800/80 bg-[#06080e] px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">SYSTEMATIC WORKFLOW</span>
            <h2 className="text-3xl font-bold text-white mt-2 mb-4">The Senior Engineering Loop</h2>
            <p className="text-slate-400 text-sm">
              DEVFORGE AI does not spit out raw unorganized chat blurbs. It operates through a disciplined 7-phase software engineering cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {[
              { num: '01', title: 'Describe', desc: 'State your vision in natural language' },
              { num: '02', title: 'Plan', desc: 'AI architects tech stack & multi-step roadmap' },
              { num: '03', title: 'Forge', desc: 'Generates cohesive multi-file project code' },
              { num: '04', title: 'Preview', desc: 'Sandboxed browser execution environment' },
              { num: '05', title: 'Test', desc: 'Automated syntax & dependency sanity checks' },
              { num: '06', title: 'Fix & Polish', desc: 'Targeted error diagnosis without blind overwrites' },
              { num: '07', title: 'Export', desc: 'Download complete clean ZIP with README' }
            ].map((step, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#0b0f19] border border-slate-800/90 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-cyan-500/80">{step.num}</span>
                  <h3 className="text-base font-bold text-slate-100 mt-1 mb-1.5">{step.title}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Capabilities */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">ENTERPRISE SCOPE</span>
          <h2 className="text-3xl font-bold text-white mt-2 mb-4">Any Software Domain</h2>
          <p className="text-slate-400 text-sm">
            From zero-dependency browser games to distributed Node/Express APIs and mobile PWA applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl bg-[#0c101c] border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
            <Globe className="w-8 h-8 text-cyan-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Websites & Web Apps</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full-featured dashboards, interactive landing pages, SPA architectures, and responsive utility applications.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#0c101c] border border-slate-800/80 hover:border-indigo-500/40 transition-colors">
            <Gamepad2 className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Canvas & Browser Games</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              60FPS arcade action, Web Audio API sound synthesis, dual desktop/mobile touch controls, and particle systems.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#0c101c] border border-slate-800/80 hover:border-amber-500/40 transition-colors">
            <Server className="w-8 h-8 text-amber-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">APIs & Backends</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Express REST services, microservices, data controllers, and clean architecture with download & run commands.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#0c101c] border border-slate-800/80 hover:border-emerald-500/40 transition-colors">
            <Smartphone className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Mobile & Automation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Progressive Web Apps with standalone display manifests, touch-first ergonomics, and automated workflows.
            </p>
          </div>
        </div>
      </section>

      {/* Supported Languages & Stacks */}
      <section className="py-16 border-t border-slate-800/80 bg-[#070a10] px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-center text-xs font-mono text-slate-400 uppercase tracking-widest mb-8">
            SUPPORTED PROGRAMMING LANGUAGES & FRAMEWORKS
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
            {[
              'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Python', 'Go', 'Rust', 'Java', 'C++', 'C#',
              'React', 'Vue', 'Next.js', 'Node.js', 'Express', 'FastAPI', 'Phaser', 'Web Audio API', 'Canvas 2D', 'SQL'
            ].map((tech) => (
              <span 
                key={tech}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-10 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="font-bold text-slate-300">DEVFORGE AI</span>
          <span>—</span>
          <span className="text-cyan-400">“Describe it. Forge it.”</span>
        </div>
        <p className="text-[11px] text-slate-600">
          Professional AI-Powered Software Engineering Environment • Version 2.4 Production
        </p>
      </footer>
    </div>
  );
};
