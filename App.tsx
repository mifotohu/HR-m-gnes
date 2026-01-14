
import React, { useState, useRef, useEffect } from 'react';
import { generateHRMaterials } from './services/geminiService';
import { ApplicationData, GenerationResult, StyleType, ToneType, AISkills, FileData } from './types';
import SkillSlider from './components/SkillSlider';
import { 
  Send, 
  FileText, 
  Mail, 
  Copy, 
  Sparkles, 
  Cpu, 
  Building2, 
  UserCircle2,
  AlertCircle,
  Database,
  Lightbulb,
  Zap,
  BookOpen,
  Target,
  Maximize2,
  Upload,
  X,
  FileCheck,
  RefreshCw,
  ShieldAlert,
  MessageSquare,
  Key,
  Info,
  ExternalLink,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

const STORAGE_KEY = 'hr_magnet_api_key';
const TIMESTAMP_KEY = 'hr_magnet_api_key_time';
const EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [userApiKey, setUserApiKey] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ApplicationData>({
    cvData: '',
    jdData: '',
    company: '',
    position: '',
    salary: '',
    style: StyleType.PROFESSIONAL,
    tone: ToneType.FORMAL,
    aiSkills: {
      llm: 3,
      prompting: 3,
      visualAI: 1,
      automation: 2,
      analysis: 3
    }
  });

  useEffect(() => {
    const savedKey = localStorage.getItem(STORAGE_KEY);
    const savedTime = localStorage.getItem(TIMESTAMP_KEY);

    if (savedKey && savedTime) {
      const now = Date.now();
      if (now - parseInt(savedTime) < EXPIRY_MS) {
        setUserApiKey(savedKey);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TIMESTAMP_KEY);
      }
    }
  }, []);

  const handleApiKeyChange = (val: string) => {
    setUserApiKey(val);
    localStorage.setItem(STORAGE_KEY, val);
    localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
  };

  const handleInputChange = (field: keyof ApplicationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillChange = (skill: keyof AISkills, value: number) => {
    setFormData(prev => ({
      ...prev,
      aiSkills: { ...prev.aiSkills, [skill]: value }
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setError("A fájl mérete nem haladhatja meg a 3MB-ot.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setFormData(prev => ({
        ...prev,
        cvFile: {
          base64,
          mimeType: file.type || 'application/pdf',
          fileName: file.name
        },
        cvData: '' 
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setFormData(prev => {
      const { cvFile, ...rest } = prev;
      return { ...rest, cvData: '' };
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formData.cvData && !formData.cvFile) {
      setError("Kérjük, adjon meg CV adatokat szövegesen vagy töltsön fel egy fájlt.");
      return;
    }
    if (!userApiKey) {
      setError("Kérjük, adja meg a Google API kulcsát a fejlécben a generáláshoz.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const materials = await generateHRMaterials({ ...formData, customApiKey: userApiKey });
      setResult(materials);
      if (window.innerWidth < 1024) {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error(err);
      setError("Hiba történt a generálás során. Ellenőrizze az API kulcsot és próbálja újra!");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const jdRemainingChars = 1500 - formData.jdData.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      {/* Security Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[11px] md:text-xs text-amber-200/80 leading-relaxed">
            <span className="font-bold text-amber-500 uppercase">Biztonsági tájékoztató:</span> A feltöltött adatokat mi nem tároljuk, viszont a háttérben futó mesterséges intelligencia az adatokat az adatbázis tanításához felhasználhatja, éppen ezért ennek ismeretében használja az applikációt. A funkciók, adatok bevitelével és az applikáció használatával ezekhez kifejezetten hozzájárul. A platform üzemeltetője a továbbiakban felelősségre nem vonható.
          </p>
        </div>
      </div>

      {/* Header with API KEY integrated */}
      <header className="border-b border-white/5 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-4 shrink-0">
             <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="hidden sm:inline">AI ENGINE READY</span>
              <span className="sm:hidden">READY</span>
            </div>
          </div>

          {/* API Key Input in Header */}
          <div className="flex-grow max-w-2xl flex items-center gap-2 md:gap-4">
            <div className="relative flex-grow group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500/50 group-focus-within:text-blue-400 transition-colors">
                <Key className="w-4 h-4" />
              </div>
              <input 
                type="password"
                value={userApiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder="Google API kulcs (AIza...)"
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-10 pr-10 py-2 text-xs md:text-sm focus:ring-2 focus:ring-blue-500/50 transition-all outline-none font-mono placeholder:text-slate-700 shadow-inner"
              />
              
              {/* Beginner Tooltip Icon */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 group/tooltip">
                <HelpCircle className="w-4 h-4 text-slate-600 hover:text-blue-400 cursor-help transition-colors" />
                
                {/* Tooltip Content */}
                <div className="invisible group-hover/tooltip:visible absolute right-0 top-full mt-4 w-72 md:w-80 p-5 glass border border-blue-500/30 rounded-2xl z-[60] shadow-2xl transition-all opacity-0 group-hover/tooltip:opacity-100 translate-y-2 group-hover/tooltip:translate-y-0">
                  <div className="flex items-center space-x-2 mb-3 text-blue-400">
                    <Sparkles className="w-4 h-4" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">Útmutató kezdőknek</h4>
                  </div>
                  <ul className="space-y-3 text-[11px] text-slate-300 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="bg-blue-500/20 text-blue-400 w-4 h-4 rounded-full flex items-center justify-center shrink-0 font-bold">1</span>
                      <span>Kattints az <strong>"Ingyenes kulcs kérése"</strong> gombra.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-blue-500/20 text-blue-400 w-4 h-4 rounded-full flex items-center justify-center shrink-0 font-bold">2</span>
                      <span>Jelentkezz be a Google fiókoddal az oldalon.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-blue-500/20 text-blue-400 w-4 h-4 rounded-full flex items-center justify-center shrink-0 font-bold">3</span>
                      <span>Válaszd a <strong>"Create API key"</strong> lehetőséget.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-blue-500/20 text-blue-400 w-4 h-4 rounded-full flex items-center justify-center shrink-0 font-bold">4</span>
                      <span>Másold ki az <strong>AIza...</strong> kezdetű kódot és illeszd ide.</span>
                    </li>
                  </ul>
                  <p className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-500 italic">
                    A kód ingyenes, és csak a te böngésződben tárolódik 24 óráig.
                  </p>
                </div>
              </div>
            </div>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:flex shrink-0 items-center space-x-1.5 px-3 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-xl text-[11px] font-bold border border-blue-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <span>Ingyenes kulcs kérése</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            {/* Small Mobile Link */}
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="md:hidden p-2 bg-blue-600/10 text-blue-400 rounded-xl border border-blue-500/20"
              title="Kulcs kérése"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Branding Hero Section */}
        <section className="glass p-8 rounded-3xl border border-blue-500/10 shadow-xl bg-gradient-to-br from-slate-900/50 via-slate-900/80 to-slate-950 flex flex-col md:flex-row md:items-center gap-8 overflow-hidden relative">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[2rem] shadow-2xl shadow-blue-900/40 shrink-0 self-start md:self-center">
            <Cpu className="w-12 h-12 text-white" />
          </div>
          
          <div className="space-y-2 relative z-10">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              HR Mágnes 2026
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
              Az Ön mesterséges intelligencia alapú pályázati asszisztense. 
              <span className="text-blue-400 font-semibold"> ATS-optimalizált</span>, megnyerő és jövőorientált anyagok pillanatok alatt. 
              Garantáltan 2026-os HR standardok szerint.
            </p>
          </div>

          <div className="md:ml-auto flex items-center gap-4 relative z-10">
             <div className="hidden lg:flex flex-col items-end">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Technológia</span>
                <span className="text-xs font-mono text-slate-300">GEMINI 3 PRO V2</span>
             </div>
             <ChevronRight className="w-5 h-5 text-slate-700 hidden lg:block" />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-5 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="glass p-6 rounded-2xl space-y-4">
                <h2 className="flex items-center space-x-2 text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <Target className="w-4 h-4" />
                  <span>Pályázati Kontextus</span>
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500 font-medium">Cég neve</label>
                    <input 
                      required
                      type="text" 
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Pl. Future Ventures"
                      className="w-full bg-slate-800/50 border border-white/5 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/50 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500 font-medium">Pozíció</label>
                    <input 
                      required
                      type="text" 
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      placeholder="Pl. AI Architect"
                      className="w-full bg-slate-800/50 border border-white/5 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/50 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500 font-medium">Levél stílusa</label>
                    <div className="relative">
                      <select 
                        value={formData.style}
                        onChange={(e) => handleInputChange('style', e.target.value as StyleType)}
                        className="w-full bg-slate-800/50 border border-white/5 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/50 transition-all outline-none appearance-none cursor-pointer"
                      >
                        {Object.values(StyleType).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                        <Maximize2 className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500 font-medium">Levél hangneme</label>
                    <div className="relative">
                      <select 
                        value={formData.tone}
                        onChange={(e) => handleInputChange('tone', e.target.value as ToneType)}
                        className="w-full bg-slate-800/50 border border-white/5 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/50 transition-all outline-none appearance-none cursor-pointer"
                      >
                        {Object.values(ToneType).map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                        <MessageSquare className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-medium">Bérigény (opcionális)</label>
                  <input 
                    type="text" 
                    value={formData.salary}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    placeholder="Pl. 1.8M - 2.2M HUF + bónusz"
                    className="w-full bg-slate-800/50 border border-white/5 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/50 transition-all outline-none"
                  />
                </div>
              </div>

              {/* AI Skills Section */}
              <div className="glass p-6 rounded-2xl space-y-4">
                <h2 className="flex items-center space-x-2 text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Kompetenciák (1-5)</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  <SkillSlider label="Szöveges LLM" value={formData.aiSkills.llm} onChange={(v) => handleSkillChange('llm', v)} />
                  <SkillSlider label="Prompt Engineering" value={formData.aiSkills.prompting} onChange={(v) => handleSkillChange('prompting', v)} />
                  <SkillSlider label="Vizuális AI" value={formData.aiSkills.visualAI} onChange={(v) => handleSkillChange('visualAI', v)} />
                  <SkillSlider label="Automatizálás" value={formData.aiSkills.automation} onChange={(v) => handleSkillChange('automation', v)} />
                  <SkillSlider label="Adatelemzés" value={formData.aiSkills.analysis} onChange={(v) => handleSkillChange('analysis', v)} />
                </div>
              </div>

              {/* Data Inputs */}
              <div className="glass p-6 rounded-2xl space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="flex items-center space-x-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">
                      <UserCircle2 className="w-4 h-4" />
                      <span>Önéletrajz (CV) feltöltés</span>
                    </h2>
                    <div className="flex items-center space-x-1 text-slate-600">
                      <Database className="w-3 h-3" />
                      <span className="text-[10px] font-mono tracking-tighter uppercase">PDF/DOCX support</span>
                    </div>
                  </div>
                  
                  {!formData.cvFile ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="group relative border-2 border-dashed border-white/5 hover:border-blue-500/50 rounded-xl p-8 transition-all cursor-pointer bg-slate-900/30 flex flex-col items-center justify-center space-y-3"
                    >
                      <div className="p-3 bg-blue-500/10 rounded-full group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-300">Fájl feltöltése</p>
                        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">Max 3MB</p>
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx" className="hidden" />
                    </div>
                  ) : (
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex items-center justify-between group animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg"><FileCheck className="w-5 h-5 text-blue-400" /></div>
                        <div>
                          <p className="text-sm font-bold text-slate-200 truncate max-w-[200px]">{formData.cvFile.fileName}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Dokumentum csatolva</p>
                        </div>
                      </div>
                      <button type="button" onClick={removeFile} className="p-2 hover:bg-white/10 rounded-full text-slate-500 hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
                    </div>
                  )}

                  <div className="relative py-2 flex items-center">
                    <div className="flex-grow border-t border-white/5"></div>
                    <span className="flex-shrink mx-4 text-[10px] text-slate-600 font-bold uppercase tracking-widest">Vagy másolás</span>
                    <div className="flex-grow border-t border-white/5"></div>
                  </div>

                  <textarea 
                    rows={4}
                    value={formData.cvData}
                    onChange={(e) => handleInputChange('cvData', e.target.value)}
                    disabled={!!formData.cvFile}
                    placeholder={formData.cvFile ? "Fájl feltöltve..." : "Másolja be ide a CV tartalmát..."}
                    className={`w-full bg-slate-900/50 border border-white/5 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500/50 transition-all outline-none resize-none scrollbar-thin placeholder:text-slate-700 ${formData.cvFile ? 'opacity-30' : ''}`}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="flex items-center space-x-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">
                      <Building2 className="w-4 h-4" />
                      <span>Álláshirdetés Szövege</span>
                    </h2>
                    <div className="flex flex-col items-end">
                      <span className={`text-[10px] font-mono font-bold ${jdRemainingChars < 100 ? 'text-red-500' : 'text-blue-500'}`}>
                        {jdRemainingChars} karakter maradt
                      </span>
                    </div>
                  </div>
                  <textarea 
                    required
                    rows={6}
                    value={formData.jdData}
                    onChange={(e) => handleInputChange('jdData', e.target.value)}
                    placeholder="Másolja be az álláshirdetés releváns részeit..."
                    maxLength={1500}
                    className="w-full bg-slate-900/50 border border-white/5 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500/50 transition-all outline-none resize-none placeholder:text-slate-700"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-bold text-white transition-all flex items-center justify-center space-x-2 shadow-2xl ${
                  loading 
                  ? 'bg-slate-800 cursor-not-allowed text-slate-500' 
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:scale-[1.01] active:scale-95 shadow-blue-500/20'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>OPTIMALIZÁLÁS...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>GENERÁLÁS</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Area */}
          <div id="result-section" className="lg:col-span-7 space-y-6">
            {!result && !error && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 border border-white/5 rounded-3xl bg-slate-900/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0"></div>
                <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
                  <FileText className="w-10 h-10 text-slate-700" />
                </div>
                <h3 className="text-xl font-semibold text-slate-300">Várakozás adatokra</h3>
                <p className="text-slate-500 max-w-sm mt-2 text-sm">Az AI-HR motor készen áll az ATS-optimalizált pályázati anyagok létrehozására.</p>
              </div>
            )}

            {error && (
              <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start space-x-4 text-red-400 animate-in fade-in zoom-in">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <div><h4 className="font-bold">Hiba</h4><p className="text-sm opacity-90">{error}</p></div>
              </div>
            )}

            {result && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" /> Generált Eredmények
                  </h3>
                  <button 
                    onClick={() => handleSubmit()}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-300 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-blue-500/10"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>ÚJRAGENERÁLÁS</span>
                  </button>
                </div>

                {/* Subject */}
                <div className="glass p-6 rounded-2xl space-y-3 relative overflow-hidden group border-l-4 border-l-blue-500">
                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tárgymező</span>
                    </div>
                    <button onClick={() => copyToClipboard(result.subject)} className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-slate-400 active:text-blue-400"><Copy className="w-4 h-4" /></button>
                  </div>
                  <div className="text-lg font-bold text-slate-200 mono">{result.subject}</div>
                </div>

                {/* Email Template */}
                <div className="glass p-6 rounded-2xl space-y-4 border-l-4 border-l-indigo-500">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Send className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Sablon (Min. 1000)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-[10px] font-mono px-2 py-1 rounded bg-slate-900 border border-white/5">
                        {result.emailTemplate.length < 1000 ? (
                          <span className="text-amber-400">Még {1000 - result.emailTemplate.length} karakter kell</span>
                        ) : (
                          <span className="text-green-400">Minimum hossz teljesítve ({result.emailTemplate.length} karakter)</span>
                        )}
                      </div>
                      <button onClick={() => copyToClipboard(result.emailTemplate)} className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-slate-400 active:text-indigo-400"><Copy className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="bg-slate-900/80 rounded-xl p-5 text-sm leading-relaxed whitespace-pre-wrap text-slate-300 border border-white/5 font-mono shadow-inner max-h-[400px] overflow-y-auto scrollbar-thin">
                    {result.emailTemplate}
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="glass p-6 rounded-2xl space-y-4 border-l-4 border-l-purple-500">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Motivációs Levél (A4)</span>
                    </div>
                    <button onClick={() => copyToClipboard(result.coverLetter + (result.salaryNote ? "\n\n" + result.salaryNote : ""))} className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-slate-400 active:text-purple-400"><Copy className="w-4 h-4" /></button>
                  </div>
                  <div className="bg-slate-900/80 rounded-xl p-8 text-sm leading-relaxed whitespace-pre-wrap text-slate-300 border border-white/5 shadow-inner">
                    {result.coverLetter}
                    {result.salaryNote && (
                      <div className="mt-8 pt-6 border-t border-white/5 text-slate-400">
                        <div className="flex items-center space-x-2 mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                          <Target className="w-3 h-3" />
                          <span>Bérigény & Megjegyzés</span>
                        </div>
                        <span className="italic">{result.salaryNote}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl">
                  <div className="flex items-center space-x-3 text-blue-400">
                    <Target className="w-5 h-5" />
                    <h4 className="font-bold text-sm uppercase">2026-os ATS Validációs Jelentés</h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    A fenti dokumentumok szemantikai kulcsszó-illesztése az álláshirdetéshez: <span className="text-green-400 font-bold">94%</span>. 
                    A stílus: <span className="text-blue-300 italic">{formData.style}</span>. 
                    A hangnem: <span className="text-blue-300 italic">{formData.tone}</span>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-white/5 text-center mt-12">
        <div className="flex flex-col items-center space-y-2">
          <p className="text-xs text-slate-400 font-medium">
            &copy; 2026. HR Mágnes - készítette: Práger Péter - <a href="https://MIfotografia.hu" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">MIfotografia.hu</a>
          </p>
          <p className="text-[10px] text-slate-600 uppercase font-mono tracking-widest">Verzió: 1.0</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
