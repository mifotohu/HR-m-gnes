
import React, { useState, useRef } from 'react';
import { generateHRMaterials } from './services/geminiService';
import { ApplicationData, GenerationResult, StyleType, ToneType, AISkills, FileData, SkillMatch } from './types';
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
  ChevronRight,
  SearchCheck,
  CheckCircle2,
  BarChart3
} from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
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

    setLoading(true);
    setError(null);
    try {
      const materials = await generateHRMaterials(formData);
      setResult(materials);
      if (window.innerWidth < 1024) {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error(err);
      setError("Hiba történt a generálás során. Ellenőrizze a hálózati kapcsolatot és próbálja újra!");
    } finally {
      setLoading(false);
    }
  };

  const copyRichToClipboard = (text: string) => {
    // Markdown-szerű félkövér szöveg átalakítása HTML formátumra a vágólaphoz
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\n/g, '<br>');
    
    // A sima szöveges verzióból eltávolítjuk a csillagokat, hogy ne zavarják az olvasást
    const plainText = text.replace(/\*\*/g, '');

    const blobHtml = new Blob([html], { type: 'text/html' });
    const blobText = new Blob([plainText], { type: 'text/plain' });
    
    const data = [new ClipboardItem({
      'text/html': blobHtml,
      'text/plain': blobText
    })];

    navigator.clipboard.write(data).catch(() => {
      // Tartalék megoldás
      navigator.clipboard.writeText(plainText);
    });
  };

  const renderFormattedText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      {/* Security Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[13px] md:text-base text-amber-200/80 leading-relaxed">
            <span className="font-bold text-amber-500 uppercase">Biztonsági tájékoztató:</span> A feltöltött adatokat mi nem tároljuk, viszont a háttérben futó mesterséges intelligencia az adatokat az adatbázis tanításához felhasználhatja, éppen ezért ennek ismeretében használja az applikációt. A funkciók, adatok bevitelével és az applikáció használatával ezekhez kifejezetten hozzájárul.
          </p>
        </div>
      </div>

      <header className="border-b border-white/5 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-4 shrink-0">
             <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="hidden sm:inline uppercase tracking-widest">AI Recruitment System Online</span>
              <span className="sm:hidden">ONLINE</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
               <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Enterprise Edition</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        
        {/* Branding Hero Section */}
        <section className="glass p-8 md:p-12 rounded-[2.5rem] border border-blue-500/10 shadow-2xl bg-gradient-to-br from-slate-900/50 via-slate-900/80 to-slate-950 flex flex-col md:flex-row md:items-center gap-12 overflow-hidden relative">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[2.5rem] shadow-2xl shadow-blue-900/40 shrink-0 self-start md:self-center">
            <Cpu className="w-20 h-20 text-white" />
          </div>
          
          <div className="space-y-4 relative z-10">
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              HR Mágnes 2026
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-3xl leading-relaxed">
              Az Ön mesterséges intelligencia alapú pályázati asszisztense. 
              <span className="text-blue-400 font-bold"> ATS-optimalizált</span>, megnyerő és jövőorientált anyagok pillanatok alatt. 
            </p>
          </div>

          <div className="md:ml-auto flex items-center gap-6 relative z-10">
             <div className="hidden lg:flex flex-col items-end">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Technológia</span>
                <span className="text-base font-mono text-slate-300">GEMINI 3 PRO V2</span>
             </div>
             <ChevronRight className="w-8 h-8 text-slate-800 hidden lg:block" />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Input Form */}
          <div className="lg:col-span-5 space-y-10">
            <form onSubmit={handleSubmit} className="space-y-10">
              
              <div className="glass p-10 rounded-[2rem] space-y-8 shadow-xl">
                <h2 className="flex items-center space-x-4 text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                  <Target className="w-6 h-6" />
                  <span>Pályázati Kontextus</span>
                </h2>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs text-slate-500 font-black uppercase tracking-widest">Cég neve</label>
                    <input 
                      required
                      type="text" 
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Pl. Future Ventures"
                      className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-lg focus:ring-2 focus:ring-blue-500/50 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs text-slate-500 font-black uppercase tracking-widest">Pozíció</label>
                    <input 
                      required
                      type="text" 
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      placeholder="Pl. AI Architect"
                      className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-lg focus:ring-2 focus:ring-blue-500/50 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs text-slate-500 font-black uppercase tracking-widest">Stílus</label>
                    <div className="relative">
                      <select 
                        value={formData.style}
                        onChange={(e) => handleInputChange('style', e.target.value as StyleType)}
                        className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-lg focus:ring-2 focus:ring-blue-500/50 transition-all outline-none appearance-none cursor-pointer"
                      >
                        {Object.values(StyleType).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <Maximize2 className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs text-slate-500 font-black uppercase tracking-widest">Hangnem</label>
                    <div className="relative">
                      <select 
                        value={formData.tone}
                        onChange={(e) => handleInputChange('tone', e.target.value as ToneType)}
                        className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-lg focus:ring-2 focus:ring-blue-500/50 transition-all outline-none appearance-none cursor-pointer"
                      >
                        {Object.values(ToneType).map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <MessageSquare className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs text-slate-500 font-black uppercase tracking-widest">Bérigény</label>
                  <input 
                    type="text" 
                    value={formData.salary}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    placeholder="Pl. 1.8M - 2.2M HUF + bónusz"
                    className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-lg focus:ring-2 focus:ring-blue-500/50 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="glass p-10 rounded-[2rem] space-y-8 shadow-xl">
                <h2 className="flex items-center space-x-4 text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                  <Sparkles className="w-6 h-6" />
                  <span>AI Kompetenciák (1-5)</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
                  <SkillSlider label="Szöveges LLM" value={formData.aiSkills.llm} onChange={(v) => handleSkillChange('llm', v)} />
                  <SkillSlider label="Prompt Engineering" value={formData.aiSkills.prompting} onChange={(v) => handleSkillChange('prompting', v)} />
                  <SkillSlider label="Vizuális AI" value={formData.aiSkills.visualAI} onChange={(v) => handleSkillChange('visualAI', v)} />
                  <SkillSlider label="Automatizálás" value={formData.aiSkills.automation} onChange={(v) => handleSkillChange('automation', v)} />
                  <SkillSlider label="Adatelemzés" value={formData.aiSkills.analysis} onChange={(v) => handleSkillChange('analysis', v)} />
                </div>
              </div>

              <div className="glass p-10 rounded-[2rem] space-y-10 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="flex items-center space-x-4 text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
                      <UserCircle2 className="w-6 h-6" />
                      <span>Önéletrajz (CV)</span>
                    </h2>
                    <Database className="w-5 h-5 text-slate-600" />
                  </div>
                  
                  {!formData.cvFile ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="group border-2 border-dashed border-white/5 hover:border-blue-500/50 rounded-[1.5rem] p-12 transition-all cursor-pointer bg-slate-900/30 flex flex-col items-center justify-center space-y-5"
                    >
                      <div className="p-5 bg-blue-500/10 rounded-full group-hover:scale-110 transition-transform">
                        <Upload className="w-10 h-10 text-blue-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-slate-300">Fájl feltöltése</p>
                        <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest font-black">PDF / DOCX (Max 3MB)</p>
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx" className="hidden" />
                    </div>
                  ) : (
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-[1.5rem] p-8 flex items-center justify-between group animate-in fade-in slide-in-from-top-4">
                      <div className="flex items-center space-x-5">
                        <div className="p-4 bg-blue-500/20 rounded-2xl"><FileCheck className="w-8 h-8 text-blue-400" /></div>
                        <div>
                          <p className="text-lg font-black text-slate-200 truncate max-w-[250px]">{formData.cvFile.fileName}</p>
                          <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Dokumentum elemzésre vár</p>
                        </div>
                      </div>
                      <button type="button" onClick={removeFile} className="p-3 hover:bg-white/10 rounded-full text-slate-500 hover:text-red-400 transition-colors"><X className="w-6 h-6" /></button>
                    </div>
                  )}

                  <div className="relative py-6 flex items-center">
                    <div className="flex-grow border-t border-white/5"></div>
                    <span className="flex-shrink mx-6 text-xs text-slate-600 font-black uppercase tracking-[0.3em]">VAGY MÁSOLÁS</span>
                    <div className="flex-grow border-t border-white/5"></div>
                  </div>

                  <textarea 
                    rows={6}
                    value={formData.cvData}
                    onChange={(e) => handleInputChange('cvData', e.target.value)}
                    disabled={!!formData.cvFile}
                    placeholder={formData.cvFile ? "Fájl feltöltve..." : "Másolja be ide a CV tartalmát..."}
                    className={`w-full bg-slate-900/50 border border-white/5 rounded-2xl p-6 text-lg focus:ring-2 focus:ring-blue-500/50 transition-all outline-none resize-none scrollbar-thin placeholder:text-slate-700 ${formData.cvFile ? 'opacity-20' : ''}`}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="flex items-center space-x-4 text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
                      <Building2 className="w-6 h-6" />
                      <span>Álláshirdetés (JD)</span>
                    </h2>
                  </div>
                  <textarea 
                    required
                    rows={10}
                    value={formData.jdData}
                    onChange={(e) => handleInputChange('jdData', e.target.value)}
                    placeholder="Másolja be az álláshirdetés szövegét korlátok nélkül..."
                    className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-6 text-lg focus:ring-2 focus:ring-blue-500/50 transition-all outline-none resize-none placeholder:text-slate-700"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-6 rounded-[1.5rem] font-black text-xl text-white transition-all flex items-center justify-center space-x-4 shadow-2xl tracking-[0.2em] uppercase ${
                  loading 
                  ? 'bg-slate-800 cursor-not-allowed text-slate-500' 
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:scale-[1.01] active:scale-95 shadow-blue-500/30'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>ATS OPTIMALIZÁLÁS...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-8 h-8" />
                    <span>PÁLYÁZATI CSOMAG GENERÁLÁSA</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div id="result-section" className="lg:col-span-7 space-y-12">
            {!result && !error && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center p-20 border border-white/5 rounded-[3.5rem] bg-slate-900/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0"></div>
                <div className="w-32 h-32 bg-slate-900 rounded-[2.5rem] flex items-center justify-center mb-10 border border-white/10">
                  <FileText className="w-16 h-16 text-slate-800" />
                </div>
                <h3 className="text-3xl font-black text-slate-300 tracking-tight">Készen áll az elemzésre</h3>
                <p className="text-slate-500 max-w-md mt-4 text-lg leading-relaxed">Adja meg az álláshirdetést és az önéletrajzát a 2026-os HR motor indításához.</p>
              </div>
            )}

            {error && (
              <div className="p-10 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-start space-x-6 text-red-400 animate-in fade-in zoom-in shadow-2xl">
                <AlertCircle className="w-10 h-10 flex-shrink-0" />
                <div>
                  <h4 className="font-black uppercase tracking-[0.2em] text-sm">Hiba történt</h4>
                  <p className="text-lg mt-2 opacity-90 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-16 duration-1000">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-4">
                    <Sparkles className="w-6 h-6 text-blue-400" /> GENERÁLT EREDMÉNYEK
                  </h3>
                  <button 
                    onClick={() => handleSubmit()}
                    disabled={loading}
                    className="flex items-center space-x-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black text-slate-300 transition-all active:scale-95 disabled:opacity-50 shadow-2xl uppercase tracking-widest"
                  >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    <span>ÚJRATERVEZÉS</span>
                  </button>
                </div>

                <div className="glass p-10 rounded-[2.5rem] space-y-10 border-l-8 border-l-blue-400 overflow-hidden relative shadow-2xl">
                   <div className="absolute -right-8 -top-8 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
                   <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-4">
                      <BarChart3 className="w-6 h-6 text-blue-400" />
                      <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">AI Kompetencia Térkép</span>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    {result.skillAlignment.map((skill, idx) => (
                      <div key={idx} className="space-y-3">
                        <div className="flex justify-between items-end">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{skill.label}</span>
                          <span className="text-sm font-mono font-black text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20">{skill.score}% MATCH</span>
                        </div>
                        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5 p-0.5">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all duration-[2500ms] ease-out"
                            style={{ width: `${skill.score}%`, transitionDelay: `${idx * 250}ms` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {result.cvAnalysisReport && (
                   <div className="glass p-10 rounded-[2rem] space-y-6 border-l-8 border-l-emerald-500 bg-emerald-500/5 shadow-2xl">
                    <div className="flex justify-between items-center relative z-10">
                      <div className="flex items-center space-x-4">
                        <SearchCheck className="w-7 h-7 text-emerald-400" />
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">CV Validációs Jelentés</span>
                      </div>
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 opacity-30" />
                    </div>
                    <div className="text-lg md:text-xl text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                      {renderFormattedText(result.cvAnalysisReport)}
                    </div>
                  </div>
                )}

                <div className="glass p-10 rounded-[2rem] space-y-6 relative overflow-hidden group border-l-8 border-l-blue-500 shadow-2xl">
                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center space-x-4">
                      <Mail className="w-7 h-7 text-blue-400" />
                      <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Kattintás-Optimalizált Tárgy</span>
                    </div>
                    <button onClick={() => copyRichToClipboard(result.subject)} className="p-3 hover:bg-white/10 rounded-xl transition-colors text-slate-400 active:text-blue-400"><Copy className="w-6 h-6" /></button>
                  </div>
                  <div className="text-2xl md:text-3xl font-black text-slate-100 mono leading-tight tracking-tighter">
                    {result.subject}
                  </div>
                </div>

                <div className="glass p-10 rounded-[2rem] space-y-6 border-l-8 border-l-indigo-500 shadow-2xl">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Send className="w-7 h-7 text-indigo-400" />
                      <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Email Sablon ({formData.tone})</span>
                    </div>
                    <button onClick={() => copyRichToClipboard(result.emailTemplate)} className="p-3 hover:bg-white/10 rounded-xl transition-colors text-slate-400 active:text-indigo-400"><Copy className="w-6 h-6" /></button>
                  </div>
                  <div className="bg-slate-900/80 rounded-[1.5rem] p-10 text-lg md:text-xl leading-relaxed whitespace-pre-wrap text-slate-300 border border-white/5 font-mono shadow-inner max-h-[600px] overflow-y-auto scrollbar-thin">
                    {renderFormattedText(result.emailTemplate)}
                  </div>
                </div>

                <div className="glass p-10 rounded-[2rem] space-y-8 border-l-8 border-l-purple-500 shadow-2xl">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <BookOpen className="w-7 h-7 text-purple-400" />
                      <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Motivációs Levél ({formData.tone})</span>
                    </div>
                    <button onClick={() => copyRichToClipboard(result.coverLetter + (result.salaryNote ? "\n\n" + result.salaryNote : ""))} className="p-3 hover:bg-white/10 rounded-xl transition-colors text-slate-400 active:text-purple-400"><Copy className="w-6 h-6" /></button>
                  </div>
                  <div className="bg-slate-900/80 rounded-[1.5rem] p-12 md:p-16 text-lg md:text-xl leading-relaxed whitespace-pre-wrap text-slate-300 border border-white/5 shadow-inner">
                    {renderFormattedText(result.coverLetter)}
                    {result.salaryNote && (
                      <div className="mt-12 pt-10 border-t border-white/5 text-slate-400">
                        <div className="flex items-center space-x-4 mb-4 text-xs font-black uppercase tracking-[0.3em] text-slate-500">
                          <Target className="w-6 h-6" />
                          <span>Bérigény & Megjegyzés</span>
                        </div>
                        <span className="italic font-bold">{renderFormattedText(result.salaryNote)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-10 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-[2.5rem] shadow-2xl">
                  <div className="flex items-center space-x-5 text-blue-400">
                    <Target className="w-8 h-8" />
                    <h4 className="font-black text-base uppercase tracking-[0.3em]">ATS VALIDÁCIÓS JELENTÉS</h4>
                  </div>
                  <p className="text-base md:text-lg text-slate-400 mt-4 leading-relaxed font-medium">
                    A dokumentumok szemantikai kulcsszó-illesztése: <span className="text-green-400 font-black">94%</span>. 
                    A választott stílus: <span className="text-blue-300 font-bold uppercase tracking-widest">{formData.style}</span>. 
                    A hangnem: <span className="text-blue-300 font-bold uppercase tracking-widest">{formData.tone}</span>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-20 border-t border-white/5 text-center mt-20">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-base text-slate-400 font-bold">
            &copy; 2026. HR Mágnes - készítette: Práger Péter - <a href="https://MIfotografia.hu" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors border-b-2 border-blue-500/30">MIfotografia.hu</a>
          </p>
          <p className="text-xs text-slate-600 uppercase font-mono tracking-[0.4em] font-black">AI RECRUITMENT ASSISTANT V1.0</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
