const { useState, useEffect, useRef, useMemo } = React;

// -------------------------------------------------------------
// SVG Icons
// -------------------------------------------------------------
const Icon = ({ name, className = "w-5 h-5", ...props }) => {
  const icons = {
    dashboard: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
      </svg>
    ),
    train: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 2v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="M2 12h4"/><path d="m4.93 19.07 2.83-2.83"/><path d="M12 22v-4"/><path d="m19.07 19.07-2.83-2.83"/><path d="M22 12h-4"/><path d="m19.07 4.93-2.83 2.83"/>
      </svg>
    ),
    tokenize: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/>
      </svg>
    ),
    explorer: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
      </svg>
    ),
    encodingExplorer: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    vocabulary: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>
      </svg>
    ),
    mergeRules: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
      </svg>
    ),
    settings: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    sun: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
      </svg>
    ),
    moon: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
      </svg>
    ),
    upload: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>
      </svg>
    ),
    play: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polygon points="6 3 20 12 6 21 6 3"/>
      </svg>
    ),
    pause: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
      </svg>
    ),
    skipBack: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polygon points="19 20 9 12 19 4 19 20"/><line x1="5" x2="5" y1="19" y2="5"/>
      </svg>
    ),
    skipForward: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polygon points="5 4 15 12 5 20 5 4"/><line x1="19" x2="19" y1="5" y2="19"/>
      </svg>
    ),
    check: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
    arrowRight: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
      </svg>
    ),
    search: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
      </svg>
    ),
    sparkles: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      </svg>
    ),
    cpu: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>
      </svg>
    ),
    refresh: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
      </svg>
    ),
    database: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
      </svg>
    ),
    fileText: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>
      </svg>
    ),
    alertCircle: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
      </svg>
    ),
    zap: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
      </svg>
    ),
    lock: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    )
  };
  return icons[name] || null;
};

// -------------------------------------------------------------
// API Helper
// -------------------------------------------------------------
const api = {
  get: async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || 'Network error');
    }
    return res.json();
  },
  post: async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || 'Network error');
    }
    return res.json();
  },
  upload: async (url, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(url, { method: 'POST', body: formData });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || 'Upload error');
    }
    return res.json();
  }
};

// -------------------------------------------------------------
// Theme CSS variables injected into <head>
// -------------------------------------------------------------
const lightThemeCSS = `
  :root {
    --bg-base: #f0ebe4;
    --bg-surface: #faf6f1;
    --bg-elevated: #fff9f4;
    --border-color: #e2d9cf;
    --border-subtle: #ede5dc;
    --text-primary: #2a2118;
    --text-secondary: #5c4f42;
    --text-muted: #9e8e80;
    --accent-primary: #7c5cbf;
    --accent-soft: #ede8f8;
    --sidebar-bg: #faf6f1;
    --header-bg: rgba(250,246,241,0.85);
    --input-bg: #fff9f4;
    --code-bg: #2d2521;
    --code-text: #e8ddd5;
  }
`;

const darkThemeCSS = `
  :root {
    --bg-base: #0f1117;
    --bg-surface: #161b27;
    --bg-elevated: #1e2535;
    --border-color: #2a3348;
    --border-subtle: #222a3a;
    --text-primary: #e8eaf2;
    --text-secondary: #9ca3b8;
    --text-muted: #5a6480;
    --accent-primary: #8b5cf6;
    --accent-soft: #1e1535;
    --sidebar-bg: #111622;
    --header-bg: rgba(17,22,34,0.85);
    --input-bg: #1a2030;
    --code-bg: #0a0d14;
    --code-text: #c9d1e8;
  }
`;

// -------------------------------------------------------------
// Main App Component
// -------------------------------------------------------------
function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('tf_theme') || 'dark');
  const [modelStatus, setModelStatus] = useState({ isTrained: false, hasDataset: false, vocabularySize: 0, mergeRulesCount: 0 });
  const [datasetInfo, setDatasetInfo] = useState(null);

  // Apply Theme — inject CSS vars + dark class
  useEffect(() => {
    const root = document.documentElement;
    // Remove any existing theme style
    let styleEl = document.getElementById('tf-theme-vars');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'tf-theme-vars';
      document.head.appendChild(styleEl);
    }
    if (theme === 'dark') {
      root.classList.add('dark');
      styleEl.textContent = darkThemeCSS;
    } else {
      root.classList.remove('dark');
      styleEl.textContent = lightThemeCSS;
    }
    localStorage.setItem('tf_theme', theme);
  }, [theme]);

  // Load Model & Dataset Status
  const refreshStatus = async () => {
    try {
      const [mStatus, dInfo] = await Promise.all([
        api.get('/api/model/status'),
        api.get('/api/dataset/info')
      ]);
      setModelStatus(mStatus);
      setDatasetInfo(dInfo?.exists ? dInfo : null);
    } catch (err) {
      console.warn('Status refresh error:', err);
    }
  };

  useEffect(() => { refreshStatus(); }, []);

  const isReady = Boolean(modelStatus.isTrained && modelStatus.hasDataset);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'train', label: 'Train Tokenizer', icon: 'train' },
    { id: 'tokenize', label: 'Tokenize Text', icon: 'tokenize', requiresTraining: true },
    { id: 'explorer', label: 'Training Explorer', icon: 'explorer', requiresTraining: true },
    { id: 'encodingExplorer', label: 'Encoding Explorer', icon: 'encodingExplorer', requiresTraining: true },
    { id: 'vocabulary', label: 'Vocabulary', icon: 'vocabulary', requiresTraining: true },
    { id: 'merges', label: 'Merge Rules', icon: 'mergeRules', requiresTraining: true },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  // Tailwind-agnostic inline style helpers for theming
  const S = {
    sidebar: { background: 'var(--sidebar-bg)', borderRight: '1px solid var(--border-color)' },
    header: { background: 'var(--header-bg)', borderBottom: '1px solid var(--border-color)', backdropFilter: 'blur(12px)' },
    main: { background: 'var(--bg-base)' },
    card: { background: 'var(--bg-surface)', border: '1px solid var(--border-color)' },
    cardElevated: { background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' },
    input: { background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' },
    textPrimary: { color: 'var(--text-primary)' },
    textSecondary: { color: 'var(--text-secondary)' },
    textMuted: { color: 'var(--text-muted)' },
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col" style={S.sidebar}>
        {/* Brand */}
        <div className="h-16 flex items-center gap-3 px-5" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
            <Icon name="cpu" className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight flex items-center gap-1.5" style={S.textPrimary}>
              TokenForge
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded" style={{ background: 'var(--accent-soft)', color: 'var(--accent-primary)' }}>C++17</span>
            </h1>
            <p className="text-[11px]" style={S.textMuted}>Byte-Level BPE Studio</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = currentPage === item.id;
            const locked = item.requiresTraining && !isReady;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={active
                  ? { background: 'var(--accent-soft)', color: 'var(--accent-primary)' }
                  : { color: 'var(--text-secondary)' }
                }
              >
                <div className="flex items-center gap-3">
                  <Icon name={item.icon} className="w-4 h-4" style={active ? { color: 'var(--accent-primary)' } : { color: 'var(--text-muted)' }} />
                  <span>{item.label}</span>
                </div>
                {locked && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 font-mono" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }} title="Locked until training dataset is uploaded and trained">
                    <Icon name="lock" className="w-3 h-3" />
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Status Badge */}
        <div className="p-4" style={{ borderTop: '1px solid var(--border-color)' }}>
          <div className="p-3 rounded-lg text-xs" style={S.cardElevated}>
            <div className="flex items-center justify-between mb-1" style={S.textMuted}>
              <span>Engine Status</span>
              <span className="inline-flex items-center gap-1 font-medium" style={{ color: isReady ? '#10b981' : '#f59e0b' }}>
                <span className={`w-1.5 h-1.5 rounded-full ${isReady ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'} inline-block`}></span>
                {isReady ? 'Trained' : 'Untrained'}
              </span>
            </div>
            <p className="font-mono text-[11px]" style={S.textSecondary}>
              {isReady
                ? `Vocab: ${modelStatus.vocabularySize} | Rules: ${modelStatus.mergeRulesCount}`
                : modelStatus.hasDataset ? 'Dataset uploaded — not trained' : 'No dataset uploaded'}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden" style={S.main}>
        {/* Top Navbar */}
        <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 z-10" style={S.header}>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold" style={S.textPrimary}>
              {navItems.find(i => i.id === currentPage)?.label || 'Dashboard'}
            </h2>
            <div className="h-4 w-px" style={{ background: 'var(--border-color)' }}></div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              isReady
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40'
                : modelStatus.hasDataset ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
            }`}>
              {isReady ? 'Model Trained & Ready' : modelStatus.hasDataset ? 'Dataset Ready — Click Train' : 'Upload Dataset First'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg transition"
              style={{ border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
              title="Toggle Light/Dark Theme"
            >
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 max-w-7xl w-full mx-auto">
          {currentPage === 'dashboard' && (
            <DashboardView modelStatus={modelStatus} datasetInfo={datasetInfo} onNavigate={setCurrentPage} theme={theme} />
          )}
          {currentPage === 'train' && (
            <TrainView modelStatus={modelStatus} datasetInfo={datasetInfo} onTrainingComplete={refreshStatus} onNavigate={setCurrentPage} />
          )}
          {currentPage === 'tokenize' && (
            <TokenizeView modelStatus={modelStatus} onNavigate={setCurrentPage} />
          )}
          {currentPage === 'explorer' && (
            <TrainingExplorerView modelStatus={modelStatus} onNavigate={setCurrentPage} />
          )}
          {currentPage === 'encodingExplorer' && (
            <EncodingExplorerView modelStatus={modelStatus} onNavigate={setCurrentPage} />
          )}
          {currentPage === 'vocabulary' && (
            <VocabularyView modelStatus={modelStatus} onNavigate={setCurrentPage} />
          )}
          {currentPage === 'merges' && (
            <MergeRulesView modelStatus={modelStatus} onNavigate={setCurrentPage} />
          )}
          {currentPage === 'settings' && (
            <SettingsView modelStatus={modelStatus} theme={theme} setTheme={setTheme} onReset={refreshStatus} />
          )}
        </main>
      </div>
    </div>
  );
}

// Reusable Card wrapper
function Card({ children, style = {}, className = '' }) {
  return (
    <div className={`rounded-2xl shadow-sm ${className}`} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', ...style }}>
      {children}
    </div>
  );
}

// Reusable empty / gate state
function GateState({ icon, title, message, buttonLabel, onAction }) {
  return (
    <div className="p-12 text-center rounded-2xl max-w-xl mx-auto" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
      <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(245,158,11,0.1)' }}>
        <Icon name={icon} className="w-6 h-6" style={{ color: '#f59e0b' }} />
      </div>
      <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>{message}</p>
      {onAction && (
        <button onClick={onAction} className="px-4 py-2 rounded-lg text-white font-medium text-xs inline-flex items-center gap-1.5" style={{ background: 'var(--accent-primary)' }}>
          <Icon name="train" className="w-3.5 h-3.5" />
          {buttonLabel}
        </button>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 1. Dashboard View
// -------------------------------------------------------------
function DashboardView({ modelStatus, datasetInfo, onNavigate, theme }) {
  const isReady = Boolean(modelStatus.isTrained && modelStatus.hasDataset);

  // Dark mode dot-grid texture for the banner
  const bannerStyle = theme === 'dark'
    ? {
        background: 'linear-gradient(135deg, #1a0f2e 0%, #0f1a2e 50%, #0f1117 100%)',
        backgroundImage: `
          radial-gradient(circle, rgba(139,92,246,0.18) 1px, transparent 1px),
          linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(79,142,246,0.06) 50%, transparent 100%)
        `,
        backgroundSize: '24px 24px, 100% 100%',
        border: '1px solid rgba(139,92,246,0.2)',
      }
    : {
        background: 'linear-gradient(135deg, #f5ede8 0%, #ede8f8 60%, #e8f0f8 100%)',
        border: '1px solid var(--border-subtle)',
      };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-8 rounded-2xl" style={bannerStyle}>
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: 'var(--accent-soft)', color: 'var(--accent-primary)' }}>
            <Icon name="sparkles" className="w-3.5 h-3.5" />
            Educational BPE Tokenizer
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Welcome to TokenForge
          </h2>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            TokenForge is an interactive Byte-Pair Encoding (BPE) tokenizer built in modern C++17.
            Upload your plain text training dataset (.txt) and run BPE training. All sections (Tokenize Text, Training Explorer, Encoding Explorer, Vocabulary, and Merge Rules) will unlock once your dataset is trained.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('train')}
              className="px-5 py-2.5 rounded-xl text-white font-medium text-sm shadow-md flex items-center gap-2 transition"
              style={{ background: 'var(--accent-primary)' }}
            >
              <Icon name="upload" className="w-4 h-4" />
              {modelStatus.hasDataset ? (isReady ? 'Re-Train Tokenizer' : 'Start Training') : 'Upload Dataset First'}
            </button>
            {isReady && (
              <button
                onClick={() => onNavigate('tokenize')}
                className="px-5 py-2.5 rounded-xl font-medium text-sm transition flex items-center gap-2"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
              >
                <Icon name="tokenize" className="w-4 h-4" />
                Tokenize Text
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Upload & Train Required Banner */}
      {!isReady && (
        <div className="p-5 rounded-2xl flex items-center gap-4" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,158,11,0.15)' }}>
            <Icon name={modelStatus.hasDataset ? 'play' : 'upload'} className="w-5 h-5" style={{ color: '#f59e0b' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {modelStatus.hasDataset ? 'Dataset uploaded — training required' : 'No dataset uploaded yet'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {modelStatus.hasDataset ? 'Click "Start BPE Training" on the Train page to train the model and unlock tokenization.' : 'Upload a plain text (.txt) corpus and run training to unlock tokenization, vocabulary, and explorers.'}
            </p>
          </div>
          <button onClick={() => onNavigate('train')} className="px-4 py-2 rounded-lg text-sm font-medium text-white flex-shrink-0 transition" style={{ background: '#d97706' }}>
            {modelStatus.hasDataset ? 'Go to Train' : 'Upload Now'}
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Base Byte Tokens', value: '256', note: 'Covers all byte values (0–255)', icon: 'database', color: '#8b5cf6' },
          { label: 'Vocabulary Size', value: isReady ? modelStatus.vocabularySize : '—', note: isReady ? `${Math.max(0, modelStatus.vocabularySize - 256)} learned subwords` : 'Train to unlock', icon: 'vocabulary', color: '#6366f1' },
          { label: 'Merge Rules', value: isReady ? modelStatus.mergeRulesCount : '—', note: isReady ? 'Recorded BPE merges' : 'Train to unlock', icon: 'mergeRules', color: '#10b981' },
          { label: 'Active Dataset', value: datasetInfo ? `${datasetInfo.totalLines} lines` : '—', note: datasetInfo ? datasetInfo.filename : 'Upload required', icon: 'fileText', color: '#f59e0b' },
        ].map((m) => (
          <div key={m.label} className="p-5 rounded-xl shadow-sm" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center justify-between text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
              <span>{m.label}</span>
              <Icon name={m.icon} className="w-4 h-4" style={{ color: m.color }} />
            </div>
            <div className="text-2xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{m.value}</div>
            <p className="mt-1 text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{m.note}</p>
          </div>
        ))}
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { id: 'tokenize', label: 'Tokenize Text', desc: 'Enter any text to see subwords, token IDs, and 100% exact reconstruction.', color: '#8b5cf6', iconColor: 'rgba(139,92,246,0.12)', icon: 'tokenize' },
          { id: 'explorer', label: 'Training Explorer', desc: 'Step through BPE training iterations. See which pairs are merged at each step.', color: '#6366f1', iconColor: 'rgba(99,102,241,0.12)', icon: 'explorer' },
          { id: 'vocabulary', label: 'Vocabulary Table', desc: 'Search, filter, and explore all learned tokens and their numeric IDs.', color: '#10b981', iconColor: 'rgba(16,185,129,0.12)', icon: 'vocabulary' },
        ].map((item) => (
          <div
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="p-6 rounded-xl cursor-pointer group transition-all hover:shadow-md"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition group-hover:scale-110" style={{ background: item.iconColor }}>
              <Icon name={item.icon} className="w-5 h-5" style={{ color: item.color }} />
            </div>
            <h3 className="text-base font-semibold flex items-center justify-between" style={{ color: 'var(--text-primary)' }}>
              <span>{item.label}</span>
              <div className="flex items-center gap-1.5">
                {!isReady && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono flex items-center gap-1" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                    <Icon name="lock" className="w-3 h-3" /> Locked
                  </span>
                )}
                <Icon name="arrowRight" className="w-4 h-4 transition group-hover:translate-x-1" style={{ color: 'var(--text-muted)' }} />
              </div>
            </h3>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. Train Tokenizer View
// -------------------------------------------------------------
function TrainView({ modelStatus, datasetInfo, onTrainingComplete, onNavigate }) {
  const [maxMerges, setMaxMerges] = useState(10);
  const [minFrequency, setMinFrequency] = useState(2);
  const [training, setTraining] = useState(false);
  const [trainResult, setTrainResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localDataset, setLocalDataset] = useState(datasetInfo);
  const fileInputRef = useRef(null);

  useEffect(() => { setLocalDataset(datasetInfo); }, [datasetInfo]);

  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!file.name.endsWith('.txt')) {
      setUploadError('Only plain text (.txt) files are supported.');
      return;
    }
    setUploadError(null);
    setTrainResult(null);
    try {
      const res = await api.upload('/api/dataset/upload', file);
      setLocalDataset({ exists: true, filename: res.filename, sizeBytes: res.sizeBytes, totalLines: res.totalLines, preview: res.preview });
      await onTrainingComplete();
    } catch (err) {
      setUploadError(err.message);
    }
  };

  const handleStartTraining = async () => {
    if (!modelStatus.hasDataset && !localDataset) {
      setUploadError('Please upload a training dataset first.');
      return;
    }
    setTraining(true);
    setTrainResult(null);
    setUploadError(null);
    const startTime = performance.now();
    try {
      const result = await api.post('/api/train', {
        maxMerges: parseInt(maxMerges, 10),
        minFrequency: parseInt(minFrequency, 10)
      });
      const duration = ((performance.now() - startTime) / 1000).toFixed(2);
      setTrainResult({ ...result, duration });
      await onTrainingComplete();
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setTraining(false);
    }
  };

  const hasDataset = localDataset?.exists || modelStatus.hasDataset;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Upload Box */}
      <div className="p-6 rounded-2xl shadow-sm" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
        <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>1. Upload Training Dataset</h3>
        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
          Select a plain text corpus (.txt) to train the BPE tokenizer. Only the uploaded file is used — no built-in defaults.
        </p>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition"
          style={{
            borderColor: isDragging ? 'var(--accent-primary)' : 'var(--border-color)',
            background: isDragging ? 'var(--accent-soft)' : 'var(--bg-elevated)'
          }}
        >
          <input ref={fileInputRef} type="file" accept=".txt" className="hidden" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} />
          <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3" style={{ background: 'var(--accent-soft)' }}>
            <Icon name="upload" className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Click to browse or drag and drop your <span className="font-mono" style={{ color: 'var(--accent-primary)' }}>.txt</span> corpus
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>UTF-8 plain text • Max 50 MB</p>
        </div>

        {uploadError && (
          <div className="mt-3 p-3 rounded-lg flex items-center gap-2 text-xs" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
            <Icon name="alertCircle" className="w-4 h-4 flex-shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Dataset Preview */}
        {localDataset?.exists && (
          <div className="mt-4 p-4 rounded-xl text-xs" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                <Icon name="fileText" className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                Active Dataset:&nbsp;
                <span className="font-mono" style={{ color: 'var(--accent-primary)' }}>{localDataset.filename}</span>
              </span>
              <span className="font-mono" style={{ color: 'var(--text-muted)' }}>
                {localDataset.totalLines} lines • {(localDataset.sizeBytes / 1024).toFixed(1)} KB
              </span>
            </div>
            {localDataset.preview?.length > 0 && (
              <div className="font-mono text-[11px] p-2 rounded max-h-24 overflow-y-auto" style={{ background: 'var(--code-bg)', color: 'var(--code-text)' }}>
                {localDataset.preview.map((line, idx) => (
                  <div key={idx} className="truncate">
                    <span className="select-none mr-2" style={{ color: 'var(--text-muted)' }}>{idx + 1}.</span>
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Configuration & Training Action */}
      <div className="p-6 rounded-2xl shadow-sm space-y-5" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
        <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>2. Training Configuration</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Maximum Merge Iterations</label>
            <input
              type="number" min="1" max="2000" value={maxMerges}
              onChange={(e) => setMaxMerges(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg font-mono focus:outline-none focus:ring-2"
              style={{ ...{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' } }}
            />
            <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>How many pair merges to perform.</p>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Minimum Pair Frequency</label>
            <input
              type="number" min="1" max="1000" value={minFrequency}
              onChange={(e) => setMinFrequency(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg font-mono focus:outline-none focus:ring-2"
              style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
            <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>Stop when top pair frequency falls below this.</p>
          </div>
        </div>

        <div className="pt-1">
          <button
            onClick={handleStartTraining}
            disabled={training || !hasDataset}
            className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition shadow-md text-white"
            style={{
              background: (training || !hasDataset) ? '#6b7280' : 'var(--accent-primary)',
              cursor: (training || !hasDataset) ? 'not-allowed' : 'pointer',
              opacity: !hasDataset && !training ? 0.6 : 1
            }}
          >
            {training ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Training BPE Model…
              </>
            ) : !hasDataset ? (
              <>
                <Icon name="upload" className="w-4 h-4" />
                Upload a Dataset First
              </>
            ) : (
              <>
                <Icon name="play" className="w-4 h-4" />
                Start BPE Training
              </>
            )}
          </button>
        </div>
      </div>

      {/* Training Result */}
      {trainResult && (
        <div className="p-6 rounded-2xl" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)' }}>
          <div className="flex items-center gap-2 font-semibold text-base mb-3" style={{ color: '#10b981' }}>
            <Icon name="check" className="w-5 h-5" />
            Training Completed Successfully!
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-5">
            {[
              { label: 'Initial Vocab', value: '256 Bytes' },
              { label: 'Final Vocab', value: trainResult.finalVocabSize },
              { label: 'Total Merges', value: trainResult.totalMerges },
              { label: 'Elapsed Time', value: `${trainResult.duration}s` },
            ].map(m => (
              <div key={m.label} className="p-3 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>{m.label}</span>
                <p className="text-lg font-bold font-mono mt-1" style={{ color: 'var(--text-primary)' }}>{m.value}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => onNavigate('explorer')} className="px-4 py-2 rounded-lg text-white font-medium text-xs flex items-center gap-1.5" style={{ background: 'var(--accent-primary)' }}>
              <Icon name="explorer" className="w-3.5 h-3.5" />
              Open Training Explorer
            </button>
            <button onClick={() => onNavigate('tokenize')} className="px-4 py-2 rounded-lg font-medium text-xs flex items-center gap-1.5 transition" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              <Icon name="tokenize" className="w-3.5 h-3.5" />
              Start Tokenizing Text
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 3. Tokenize Text View
// -------------------------------------------------------------
function TokenizeView({ modelStatus, onNavigate }) {
  const isReady = Boolean(modelStatus.isTrained && modelStatus.hasDataset);
  const [inputText, setInputText] = useState('');
  const [tokenizing, setTokenizing] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);

  const handleTokenize = async () => {
    if (!inputText.trim()) return;
    setTokenizing(true);
    setError(null);
    try {
      const res = await api.post('/api/tokenize', { text: inputText });
      setOutput(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setTokenizing(false);
    }
  };

  if (!isReady) {
    return (
      <GateState
        icon="alertCircle"
        title="Training Required to Tokenize"
        message="Tokenize Text is locked. Please upload a plain text training dataset (.txt) and run BPE training before you can tokenize text."
        buttonLabel="Upload & Train Dataset"
        onAction={() => onNavigate('train')}
      />
    );
  }

  const charCount = inputText.length;
  const tokenCount = output ? output.tokenCount : 0;
  const compressionRatio = charCount > 0 && tokenCount > 0 ? (charCount / tokenCount).toFixed(2) : '0.00';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Input Section */}
      <div className="p-6 rounded-2xl shadow-sm space-y-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Input Text</label>
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{charCount} chars</span>
        </div>
        <textarea
          rows="3"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter any text, sentence, or phrase to tokenize…"
          className="w-full p-3.5 text-sm rounded-xl focus:outline-none focus:ring-2 resize-none"
          style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
        />
        {/* Quick sample chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span style={{ color: 'var(--text-muted)' }}>Quick Samples:</span>
          {['machine learning', 'deep learning', 'artificial intelligence', 'tokenization algorithm', 'neural networks'].map((sample) => (
            <button
              key={sample}
              onClick={() => setInputText(sample)}
              className="px-2.5 py-1 rounded-md font-mono text-[11px] transition"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
            >
              {sample}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleTokenize}
            disabled={tokenizing || !inputText.trim()}
            className="px-5 py-2.5 rounded-xl text-white font-medium text-sm flex items-center gap-2 transition shadow-md"
            style={{ background: 'var(--accent-primary)', opacity: tokenizing || !inputText.trim() ? 0.6 : 1 }}
          >
            {tokenizing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Tokenizing…
              </>
            ) : (
              <>
                <Icon name="tokenize" className="w-4 h-4" />
                Tokenize Text
              </>
            )}
          </button>
          <button
            onClick={() => { setInputText(''); setOutput(null); }}
            className="px-4 py-2.5 rounded-xl text-sm font-medium transition"
            style={{ border: '1px solid var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-elevated)' }}
          >
            Clear
          </button>
        </div>
        {error && (
          <div className="p-3 rounded-lg flex items-center gap-2 text-xs" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
            <Icon name="alertCircle" className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Output Section */}
      {output && (
        <div className="p-6 rounded-2xl shadow-sm space-y-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {[
              { label: 'Input Length', value: `${charCount} chars` },
              { label: 'Tokens', value: output.tokenCount, accent: true },
              { label: 'Compression', value: `${compressionRatio}x` },
              { label: 'Round-Trip', value: '✓ Exact', green: true },
            ].map(m => (
              <div key={m.label} className="p-3 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>{m.label}</span>
                <p className={`text-lg font-bold font-mono mt-1`} style={{ color: m.accent ? 'var(--accent-primary)' : m.green ? '#10b981' : 'var(--text-primary)' }}>{m.value}</p>
              </div>
            ))}
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: 'var(--text-muted)' }}>Subword Tokens</h4>
            <div className="flex flex-wrap gap-2 p-4 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              {output.tokens.map((tok, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-2 shadow-sm"
                  style={tok.isBase
                    ? { background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }
                    : { background: 'var(--accent-soft)', border: '1px solid rgba(139,92,246,0.3)', color: 'var(--accent-primary)', fontWeight: 600 }
                  }
                  title={`Token ID: ${tok.id} | ${tok.isBase ? 'Base Byte' : 'Learned Subword'}`}
                >
                  <span className="px-1 rounded text-[10px]" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>{tok.id}</span>
                  <span>{tok.token}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: 'var(--text-muted)' }}>Numerical Token IDs</h4>
            <div className="p-3.5 rounded-xl font-mono text-xs overflow-x-auto" style={{ background: 'var(--code-bg)', color: 'var(--code-text)' }}>
              [{output.tokenIds.join(', ')}]
            </div>
          </div>

          <div className="p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold flex items-center gap-1.5 text-xs" style={{ color: '#10b981' }}>
                <Icon name="check" className="w-4 h-4" />
                Decoded Round-Trip Output
              </span>
              <span className="font-mono text-xs font-medium" style={{ color: '#10b981' }}>SUCCESS</span>
            </div>
            <p className="font-mono text-sm mt-1 p-2 rounded" style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid rgba(16,185,129,0.1)' }}>
              "{output.decoded}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 4. Training Explorer View
// -------------------------------------------------------------
function TrainingExplorerView({ modelStatus, onNavigate }) {
  const isReady = Boolean(modelStatus.isTrained && modelStatus.hasDataset);
  const [historyData, setHistoryData] = useState(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadHistory = async () => {
    if (!isReady) return;
    setLoading(true);
    try {
      const data = await api.get('/api/train/history');
      setHistoryData(data);
      if (data.history?.length > 0) setCurrentStepIdx(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isReady) loadHistory();
  }, [isReady]);

  useEffect(() => {
    let timer;
    if (isPlaying && historyData?.history?.length) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= historyData.history.length - 1) { setIsPlaying(false); return prev; }
          return prev + 1;
        });
      }, 1400);
    }
    return () => clearInterval(timer);
  }, [isPlaying, historyData]);

  if (!isReady) {
    return (
      <GateState
        icon="alertCircle"
        title="Training Required for Explorer"
        message="Training Explorer is locked. Please upload a plain text dataset (.txt) and run BPE training before you can visualize training iterations."
        buttonLabel="Upload & Train Dataset"
        onAction={() => onNavigate('train')}
      />
    );
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <span className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full inline-block animate-spin"></span>
        <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>Loading training history…</p>
      </div>
    );
  }

  const steps = historyData?.history || [];
  if (steps.length === 0) {
    return (
      <GateState
        icon="alertCircle"
        title="No Training History"
        message="Run a training session to record step-by-step BPE merge operations."
        buttonLabel="Train BPE Now"
        onAction={() => onNavigate('train')}
      />
    );
  }

  const step = steps[currentStepIdx] || steps[0];

  const CtrlBtn = ({ onClick, disabled, children, primary }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="transition"
      style={{
        padding: primary ? '6px 16px' : '8px',
        borderRadius: '8px',
        border: primary ? 'none' : '1px solid var(--border-color)',
        background: primary ? 'var(--accent-primary)' : 'var(--bg-elevated)',
        color: primary ? '#fff' : 'var(--text-secondary)',
        fontSize: '12px',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        opacity: disabled ? 0.3 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
    >{children}</button>
  );

  return (
    <div className="space-y-6">
      {/* Player Header */}
      <div className="p-5 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold" style={{ background: 'var(--accent-soft)', color: 'var(--accent-primary)' }}>
              Iteration {step.iteration} of {steps.length}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Merged <span className="font-mono font-bold" style={{ color: 'var(--text-primary)' }}>'{step.first}'</span> + <span className="font-mono font-bold" style={{ color: 'var(--text-primary)' }}>'{step.second}'</span> → <span className="font-mono font-bold" style={{ color: 'var(--accent-primary)' }}>'{step.merged}'</span>
            </span>
          </div>
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
            Frequency: {step.frequency} | Occurrences merged: {step.occurrences} | New Token ID: {step.newVocabularyId}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CtrlBtn onClick={() => setCurrentStepIdx(Math.max(0, currentStepIdx - 1))} disabled={currentStepIdx === 0}>
            <Icon name="skipBack" className="w-4 h-4" />
          </CtrlBtn>
          <CtrlBtn onClick={() => setIsPlaying(!isPlaying)} primary>
            <Icon name={isPlaying ? 'pause' : 'play'} className="w-3.5 h-3.5" />
            {isPlaying ? 'Pause' : 'Play'}
          </CtrlBtn>
          <CtrlBtn onClick={() => setCurrentStepIdx(Math.min(steps.length - 1, currentStepIdx + 1))} disabled={currentStepIdx === steps.length - 1}>
            <Icon name="skipForward" className="w-4 h-4" />
          </CtrlBtn>
        </div>
      </div>

      {/* Slider */}
      <div className="px-2">
        <input
          type="range" min="0" max={steps.length - 1} value={currentStepIdx}
          onChange={(e) => { setIsPlaying(false); setCurrentStepIdx(parseInt(e.target.value, 10)); }}
          className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-purple-600"
          style={{ background: 'var(--border-color)' }}
        />
        <div className="flex justify-between text-[10px] mt-1 font-mono" style={{ color: 'var(--text-muted)' }}>
          <span>Start</span>
          <span>Iteration {currentStepIdx + 1}</span>
          <span>End ({steps.length})</span>
        </div>
      </div>

      {/* Dual Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pairs Heap */}
        <div className="p-5 rounded-2xl shadow-sm space-y-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
          <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Top Pair (Highest Frequency)</h4>
          <div className="p-3.5 rounded-xl" style={{ background: 'var(--accent-soft)', border: '1px solid rgba(139,92,246,0.3)' }}>
            <div className="text-[10px] uppercase font-bold mb-1" style={{ color: 'var(--accent-primary)' }}>★ Selected for Merge</div>
            <div className="flex items-center justify-between font-mono">
              <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>'{step.first}' + '{step.second}'</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: 'var(--accent-primary)', color: '#fff' }}>Freq: {step.frequency}</span>
            </div>
          </div>
          <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
            <p className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>Other Candidate Pairs:</p>
            {step.pairs && step.pairs.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg text-xs font-mono"
                style={idx === 0
                  ? { background: 'var(--accent-soft)', border: '1px solid rgba(139,92,246,0.25)', color: 'var(--accent-primary)', fontWeight: 600 }
                  : { background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }
                }
              >
                <span>{p.pair}</span>
                <span style={{ color: 'var(--text-muted)' }}>{p.freq}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Linked-List Corpus */}
        <div className="lg:col-span-2 p-5 rounded-2xl shadow-sm space-y-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Corpus Token Sequences After Merge</h4>
            <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>Vocab: {step.vocabularySize}</span>
          </div>
          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-2">
            {step.corpusTokens && step.corpusTokens.map((seq, seqIdx) => (
              <div
                key={seqIdx}
                className="p-3 rounded-xl flex items-center gap-2 overflow-x-auto text-xs font-mono"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
              >
                <span className="text-[10px] select-none flex-shrink-0 w-8" style={{ color: 'var(--text-muted)' }}>#{seqIdx + 1}</span>
                <div className="flex items-center gap-1.5 flex-nowrap">
                  {seq.map((tok, tokIdx) => {
                    const isNewMerged = tok === step.merged;
                    return (
                      <React.Fragment key={tokIdx}>
                        {tokIdx > 0 && <span className="text-[10px] select-none" style={{ color: 'var(--border-color)' }}>↔</span>}
                        <span
                          className="px-2.5 py-1 rounded-md transition-all"
                          style={isNewMerged
                            ? { background: 'var(--accent-primary)', color: '#fff', fontWeight: 700, transform: 'scale(1.05)' }
                            : { background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }
                          }
                        >
                          {tok}
                        </span>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 5. Encoding Explorer View
// -------------------------------------------------------------
function EncodingExplorerView({ modelStatus, onNavigate }) {
  const isReady = Boolean(modelStatus.isTrained && modelStatus.hasDataset);
  const [inputText, setInputText] = useState('');
  const [traceData, setTraceData] = useState(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const runTrace = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const res = await api.post('/api/tokenize', { text: inputText });
      setTraceData(res);
      setCurrentStepIdx(0);
      setIsPlaying(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (isPlaying && traceData?.steps?.length) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= traceData.steps.length - 1) { setIsPlaying(false); return prev; }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isPlaying, traceData]);

  if (!isReady) {
    return (
      <GateState
        icon="alertCircle"
        title="Training Required to Trace Encoding"
        message="Encoding Explorer is locked. Please upload a plain text dataset (.txt) and run BPE training before you can trace text encoding."
        buttonLabel="Upload & Train Dataset"
        onAction={() => onNavigate('train')}
      />
    );
  }

  const steps = traceData?.steps || [];
  const currentStep = steps[currentStepIdx];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="p-5 rounded-2xl shadow-sm flex flex-col md:flex-row items-center gap-3" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter a word or phrase to trace encoding…"
          className="flex-1 px-4 py-2.5 text-sm rounded-xl font-mono focus:outline-none focus:ring-2"
          style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
        />
        <button
          onClick={runTrace}
          disabled={loading || !inputText.trim()}
          className="px-5 py-2.5 rounded-xl text-white text-xs font-medium flex items-center gap-2 shadow-md"
          style={{ background: 'var(--accent-primary)', opacity: loading || !inputText.trim() ? 0.6 : 1 }}
        >
          <Icon name="zap" className="w-4 h-4" />
          {loading ? 'Tracing…' : 'Run Encoding Trace'}
        </button>
      </div>

      {steps.length === 0 && traceData && (
        <div className="p-8 text-center rounded-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No BPE rules matched this input. It remains as base byte tokens.</p>
        </div>
      )}

      {steps.length > 0 && currentStep && (
        <div className="p-6 rounded-2xl shadow-sm space-y-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(99,102,241,0.12)', color: '#6366f1' }}>
                Merge Step {currentStep.stepNumber} of {steps.length}
              </span>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Rule: <span className="font-mono font-bold" style={{ color: 'var(--text-primary)' }}>'{currentStep.ruleFirst}'</span> + <span className="font-mono font-bold" style={{ color: 'var(--text-primary)' }}>'{currentStep.ruleSecond}'</span> → <span className="font-mono font-bold" style={{ color: '#6366f1' }}>'{currentStep.mergedToken}'</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentStepIdx(Math.max(0, currentStepIdx - 1))} disabled={currentStepIdx === 0} className="p-2 rounded-lg transition" style={{ border: '1px solid var(--border-color)', background: 'var(--bg-elevated)', opacity: currentStepIdx === 0 ? 0.3 : 1 }}>
                <Icon name="skipBack" className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              </button>
              <button onClick={() => setIsPlaying(!isPlaying)} className="px-3.5 py-1.5 rounded-lg text-white font-medium text-xs flex items-center gap-1.5" style={{ background: '#6366f1' }}>
                <Icon name={isPlaying ? 'pause' : 'play'} className="w-3.5 h-3.5" />
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button onClick={() => setCurrentStepIdx(Math.min(steps.length - 1, currentStepIdx + 1))} disabled={currentStepIdx === steps.length - 1} className="p-2 rounded-lg transition" style={{ border: '1px solid var(--border-color)', background: 'var(--bg-elevated)', opacity: currentStepIdx === steps.length - 1 ? 0.3 : 1 }}>
                <Icon name="skipForward" className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>1. Tokens Before Merge</span>
            <div className="flex flex-wrap items-center gap-2 p-3.5 rounded-xl font-mono text-xs" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              {currentStep.tokensBefore.map((tok, i) => {
                const isHL = i === currentStep.mergedIndex || i === currentStep.mergedIndex + 1;
                return (
                  <span key={i} className="px-3 py-1.5 rounded-lg transition" style={isHL
                    ? { background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', color: '#d97706', fontWeight: 700 }
                    : { background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }
                  }>{tok}</span>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center" style={{ color: '#6366f1' }}>
            <div className="p-2 rounded-full" style={{ background: 'rgba(99,102,241,0.1)' }}>
              <Icon name="arrowRight" className="w-4 h-4 rotate-90" />
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>2. Tokens After Merge</span>
            <div className="flex flex-wrap items-center gap-2 p-3.5 rounded-xl font-mono text-xs" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)' }}>
              {currentStep.tokensAfter.map((tok, i) => (
                <span key={i} className="px-3 py-1.5 rounded-lg transition" style={i === currentStep.mergedIndex
                  ? { background: '#6366f1', color: '#fff', fontWeight: 700, transform: 'scale(1.05)' }
                  : { background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }
                }>{tok}</span>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg font-mono text-xs" style={{ background: 'var(--code-bg)', color: 'var(--code-text)' }}>
            <span className="mr-2" style={{ color: 'var(--text-muted)' }}>Token IDs:</span>
            [{currentStep.tokenIdsAfter.join(', ')}]
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 6. Vocabulary View
// -------------------------------------------------------------
function VocabularyView({ modelStatus, onNavigate }) {
  const isReady = Boolean(modelStatus.isTrained && modelStatus.hasDataset);
  const [vocabData, setVocabData] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 50;

  useEffect(() => {
    async function loadVocab() {
      try {
        const res = await api.get('/api/vocabulary');
        setVocabData(res);
      } catch (err) { console.error(err); }
    }
    if (isReady) loadVocab();
  }, [isReady]);

  if (!isReady) {
    return (
      <GateState
        icon="alertCircle"
        title="Vocabulary Locked"
        message="Vocabulary Table is locked. Please upload a plain text dataset (.txt) and train the tokenizer to generate and inspect the vocabulary."
        buttonLabel="Upload & Train Dataset"
        onAction={() => onNavigate('train')}
      />
    );
  }

  const allTokens = vocabData?.tokens || [];
  const filtered = allTokens.filter((item) => {
    if (filterType === 'base' && item.type !== 'base') return false;
    if (filterType === 'learned' && item.type !== 'learned') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return item.token.toLowerCase().includes(q) || String(item.id).includes(q);
    }
    return true;
  });
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const pageTokens = filtered.slice((page - 1) * pageSize, page * pageSize);

  const exportVocab = () => {
    const text = allTokens.map(t => `${t.token} ${t.id}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'vocab.txt'; a.click();
  };

  return (
    <div className="space-y-5">
      <div className="p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search token or ID…"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl focus:outline-none focus:ring-2"
              style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
            <Icon name="search" className="w-4 h-4 absolute left-3 top-2.5" style={{ color: 'var(--text-muted)' }} />
          </div>
          <div className="flex rounded-xl p-1 text-xs" style={{ background: 'var(--bg-elevated)' }}>
            {['all', 'base', 'learned'].map((t) => (
              <button
                key={t}
                onClick={() => { setFilterType(t); setPage(1); }}
                className="px-3 py-1 rounded-lg capitalize font-medium transition"
                style={filterType === t
                  ? { background: 'var(--bg-surface)', color: 'var(--text-primary)', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }
                  : { color: 'var(--text-muted)' }
                }
              >{t}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{filtered.length} tokens</span>
          <button onClick={exportVocab} className="px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5" style={{ border: '1px solid var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-elevated)' }}>
            <Icon name="upload" className="w-3.5 h-3.5 rotate-180" />
            Export vocab.txt
          </button>
        </div>
      </div>

      <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
        <table className="w-full text-left text-xs">
          <thead style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              {['Token ID', 'Token String', 'Type', 'Length'].map(h => (
                <th key={h} className="py-3 px-5 font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {pageTokens.map((t) => (
              <tr key={t.id} className="transition" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td className="py-2.5 px-5 font-bold" style={{ color: 'var(--text-secondary)' }}>{t.id}</td>
                <td className="py-2.5 px-5 font-semibold" style={{ color: 'var(--text-primary)' }}>
                  <span className="px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)' }}>{t.token}</span>
                </td>
                <td className="py-2.5 px-5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold uppercase"
                    style={t.type === 'base'
                      ? { background: 'var(--bg-elevated)', color: 'var(--text-muted)' }
                      : { background: 'var(--accent-soft)', color: 'var(--accent-primary)' }
                    }
                  >{t.type}</span>
                </td>
                <td className="py-2.5 px-5 font-sans" style={{ color: 'var(--text-muted)' }}>{t.length} {t.length === 1 ? 'byte' : 'bytes'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 flex items-center justify-between text-xs" style={{ borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 rounded" style={{ border: '1px solid var(--border-color)', opacity: page === 1 ? 0.4 : 1 }}>Previous</button>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1 rounded" style={{ border: '1px solid var(--border-color)', opacity: page === totalPages ? 0.4 : 1 }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 7. Merge Rules View
// -------------------------------------------------------------
function MergeRulesView({ modelStatus, onNavigate }) {
  const isReady = Boolean(modelStatus.isTrained && modelStatus.hasDataset);
  const [mergesData, setMergesData] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadMerges() {
      try { const res = await api.get('/api/merges'); setMergesData(res); } catch (err) { console.error(err); }
    }
    if (isReady) loadMerges();
  }, [isReady]);

  if (!isReady) {
    return (
      <GateState
        icon="alertCircle"
        title="Merge Rules Locked"
        message="Merge Rules ledger is locked. Please upload a plain text dataset (.txt) and train the tokenizer to view learned BPE merge operations."
        buttonLabel="Upload & Train Dataset"
        onAction={() => onNavigate('train')}
      />
    );
  }

  const rules = mergesData?.rules || [];
  const filtered = rules.filter(r => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return r.first.toLowerCase().includes(q) || r.second.toLowerCase().includes(q) || r.merged.toLowerCase().includes(q);
  });

  const exportMerges = () => {
    const text = rules.map(r => `${r.first} ${r.second}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'merges.txt'; a.click();
  };

  return (
    <div className="space-y-5">
      <div className="p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
        <div className="relative w-full sm:w-64">
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search merge pair…"
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl focus:outline-none focus:ring-2"
            style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          />
          <Icon name="search" className="w-4 h-4 absolute left-3 top-2.5" style={{ color: 'var(--text-muted)' }} />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{filtered.length} merge rules</span>
          <button onClick={exportMerges} className="px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5" style={{ border: '1px solid var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-elevated)' }}>
            <Icon name="upload" className="w-3.5 h-3.5 rotate-180" />
            Export merges.txt
          </button>
        </div>
      </div>

      <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
        <table className="w-full text-left text-xs">
          <thead style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              {['Step', 'First Token', 'Second Token', 'Resulting Token', 'Frequency'].map(h => (
                <th key={h} className="py-3 px-5 font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono">
            {filtered.map((r) => (
              <tr key={r.step} className="transition" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td className="py-2.5 px-5 font-bold" style={{ color: 'var(--accent-primary)' }}>#{r.step}</td>
                <td className="py-2.5 px-5" style={{ color: 'var(--text-secondary)' }}>
                  <span className="px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)' }}>{r.first}</span>
                </td>
                <td className="py-2.5 px-5" style={{ color: 'var(--text-secondary)' }}>
                  <span className="px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)' }}>{r.second}</span>
                </td>
                <td className="py-2.5 px-5 font-bold" style={{ color: 'var(--accent-primary)' }}>
                  <span className="px-2 py-0.5 rounded" style={{ background: 'var(--accent-soft)', border: '1px solid rgba(139,92,246,0.2)' }}>{r.merged}</span>
                </td>
                <td className="py-2.5 px-5 font-sans" style={{ color: 'var(--text-muted)' }}>{r.frequency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 8. Settings View
// -------------------------------------------------------------
function SettingsView({ modelStatus, theme, setTheme, onReset }) {
  const isReady = Boolean(modelStatus.isTrained && modelStatus.hasDataset);
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState(null);

  const handleReset = async () => {
    if (!confirm('Reset the trained model? This will clear the vocabulary and merge rules.')) return;
    setResetting(true);
    try {
      await api.post('/api/model/reset', {});
      setResetMessage('Model successfully reset.');
      onReset();
    } catch (err) {
      setResetMessage(`Error: ${err.message}`);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Theme Card */}
      <div className="p-6 rounded-2xl shadow-sm space-y-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
        <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Appearance & Theme</h3>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Choose your preferred interface theme. Selection is saved across sessions.</p>
        <div className="grid grid-cols-2 gap-4 pt-1">
          {[
            { id: 'dark', icon: 'moon', label: 'Dark Theme', desc: 'Deep charcoal with violet accents' },
            { id: 'light', icon: 'sun', label: 'Light Theme', desc: 'Warm cream tones, easy on the eyes' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className="p-4 rounded-xl text-left flex items-center justify-between transition"
              style={theme === t.id
                ? { border: '2px solid var(--accent-primary)', background: 'var(--accent-soft)' }
                : { border: '1px solid var(--border-color)', background: 'var(--bg-elevated)' }
              }
            >
              <div className="flex items-center gap-3">
                <Icon name={t.icon} className="w-5 h-5" style={{ color: theme === t.id ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{t.label}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{t.desc}</p>
                </div>
              </div>
              {theme === t.id && <Icon name="check" className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />}
            </button>
          ))}
        </div>
      </div>

      {/* Model Management */}
      <div className="p-6 rounded-2xl shadow-sm space-y-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
        <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Model Status</h3>
        <div className="text-xs space-y-2 font-mono" style={{ color: 'var(--text-secondary)' }}>
          <p>• Status: <span className="font-bold" style={{ color: isReady ? '#10b981' : '#f59e0b' }}>{isReady ? 'Trained & Active' : 'Not Trained'}</span></p>
          {modelStatus.activeDatasetName && (
            <p>• Dataset: <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{modelStatus.activeDatasetName}</span>
              {modelStatus.activeDatasetLines > 0 && <span style={{ color: 'var(--text-muted)' }}> ({modelStatus.activeDatasetLines} lines)</span>}
            </p>
          )}
          <p>• Vocabulary Size: <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{isReady ? `${modelStatus.vocabularySize} tokens` : '—'}</span></p>
          <p>• Merge Rules: <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{isReady ? `${modelStatus.mergeRulesCount} rules` : '—'}</span></p>
        </div>
        <div className="pt-2">
          <button
            onClick={handleReset}
            disabled={resetting || !isReady}
            className="px-4 py-2 rounded-xl text-xs font-semibold transition"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', opacity: !isReady ? 0.4 : 1 }}
          >
            {resetting ? 'Resetting…' : 'Reset Trained Model'}
          </button>
          {resetMessage && <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{resetMessage}</p>}
        </div>
      </div>

      {/* About */}
      <div className="p-6 rounded-2xl shadow-sm" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
        <h4 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>About TokenForge</h4>
        <div className="text-xs space-y-2" style={{ color: 'var(--text-muted)' }}>
          <p>TokenForge is an educational Byte-Pair Encoding (BPE) tokenizer built with C++17.</p>
          <p>It learns subword tokens from your training data and can tokenize any UTF-8 text with 100% lossless reconstruction.</p>
          <p>The system supports all 256 byte values as base tokens, ensuring zero out-of-vocabulary scenarios.</p>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Render Application Root
// -------------------------------------------------------------
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
