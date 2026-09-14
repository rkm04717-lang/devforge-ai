import React, { useState } from 'react';
import { 
  FolderCode, 
  Search, 
  PlusCircle, 
  Download, 
  Trash2, 
  ArrowLeft, 
  FolderOpen,
  Globe,
  Gamepad2,
  Server,
  Smartphone,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { Project, ProjectType } from '../types';
import { downloadProjectAsZip } from '../utils/zipExport';

interface ProjectsViewProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
  onOpenNewProject: () => void;
  onDeleteProject: (id: string) => void;
  onUpdateProject?: (project: Project) => void;
  onBack: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onOpenProject,
  onOpenNewProject,
  onDeleteProject,
  onUpdateProject,
  onBack
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const filtered = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.technology.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              Project Repository
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              {projects.length} forged applications ready for editing, live testing & export
            </p>
          </div>
        </div>

        <button
          onClick={onOpenNewProject}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs font-mono uppercase tracking-wider shadow-lg shadow-cyan-950/40 transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Forge New Project</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'game', label: 'Games' },
            { id: 'web_app', label: 'Web Apps' },
            { id: 'api_backend', label: 'Backends' },
            { id: 'mobile_app', label: 'Mobile PWA' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                categoryFilter === cat.id
                  ? 'bg-slate-800 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search projects & stacks..."
            className="w-full bg-[#0b101b] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-[#0b0f19] border border-dashed border-slate-800 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-lg shadow-cyan-950/50">
            <FolderCode className="w-7 h-7 text-cyan-400" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg sm:text-xl font-bold font-mono tracking-wider text-white uppercase">
              NO PROJECTS YET
            </h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Describe what you want to build and DEVFORGE will forge it.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={onOpenNewProject}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs font-mono uppercase tracking-wider shadow-lg shadow-cyan-950/50 hover:shadow-cyan-900/60 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ New Project</span>
            </button>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0b0f19] border border-dashed border-slate-800 space-y-3">
          <FolderCode className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No matching projects found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or forge a new project from scratch.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(proj => (
            <div
              key={proj.id}
              className="p-5 rounded-xl bg-[#0b0f19] border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-semibold border border-slate-700/60">
                    {proj.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(proj.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                {renamingId === proj.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (renameValue.trim() && onUpdateProject) {
                        onUpdateProject({
                          ...proj,
                          name: renameValue.trim(),
                          updatedAt: new Date().toISOString()
                        });
                      }
                      setRenamingId(null);
                    }}
                    className="flex items-center gap-1.5 mb-2"
                  >
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      autoFocus
                      className="w-full bg-[#0d121e] border border-cyan-500/50 rounded px-2 py-1 text-xs text-white font-bold focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="p-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white"
                      title="Save name"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setRenamingId(null)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400"
                      title="Cancel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between gap-2 mb-1.5 group/title">
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                      {proj.name}
                    </h3>
                    {onUpdateProject && (
                      <button
                        onClick={() => {
                          setRenamingId(proj.id);
                          setRenameValue(proj.name);
                        }}
                        className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 opacity-0 group-hover/title:opacity-100 transition-opacity"
                        title="Rename Project"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {proj.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{proj.files.length} Files</span>
                  <span className="text-slate-300 font-medium truncate max-w-[140px] text-right">
                    {proj.technology}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenProject(proj)}
                    className="flex-1 py-2 px-3 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Open Workspace</span>
                  </button>

                  <button
                    onClick={() => downloadProjectAsZip(proj)}
                    title="Export ZIP Archive"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteProject(proj.id)}
                    title="Delete Project"
                    className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
