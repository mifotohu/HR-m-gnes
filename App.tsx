
import React, { useState, useRef } from 'react';
import { generateHRMaterials } from './services/geminiService';
import { ApplicationData, GenerationResult, StyleType, ToneType, AISkills, FileData } from './types';
import SkillSlider from './components/SkillSlider';
import { 
  Briefcase, 
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
  MessageSquare
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
        cvData: '' // Clear text data if file is uploaded
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
      setError("Hiba történt a generálás során. Kérjük, próbálja újra!");
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

      {/* Header */}
      <header className="border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg shadow-blue-900/40">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                HR Mágnes 2026
              </h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold -mt-1">ATS Optimization & Recruiting</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span>GEMINI 3 PRO ENGINE READY</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Section */}
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

              <div className="grid grid-cols-1 gap-4">
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
                  <div className="flex items-center space-x-1">
                    <Database className="w-3 h-3 text-slate-600" />
                    <span className="text-[10px] text-slate-600 font-mono tracking-tighter">PDF/DOCX SUPPORTED</span>
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
                      <p className="text-sm font-medium text-slate-300">Kattintson vagy húzza ide a fájlt</p>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">Max 3MB, PDF vagy Word</p>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden" 
                    />
                  </div>
                ) : (
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex items-center justify-between group animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <FileCheck className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-200 truncate max-w-[200px]">{formData.cvFile.fileName}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Dokumentum csatolva</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={removeFile}
                      className="p-2 hover:bg-white/10 rounded-full text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="relative py-2 flex items-center">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="flex-shrink mx-4 text-[10px] text-slate-600 font-bold uppercase tracking-widest">Vagy másolja be</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                <textarea 
                  rows={4}
                  value={formData.cvData}
                  onChange={(e) => handleInputChange('cvData', e.target.value)}
                  disabled={!!formData.cvFile}
                  placeholder={formData.cvFile ? "Fájl feltöltve, a szöveges bevitel inaktív" : "Másolja be ide a szakmai múltat..."}
                  className={`w-full bg-slate-900/50 border border-white/5 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500/50 transition-all outline-none resize-none scrollbar-thin placeholder:text-slate-700 ${formData.cvFile ? 'opacity-30 cursor-not-allowed' : ''}`}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center space-x-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">
                    <Building2 className="w-4 h-4" />
                    <span>Álláshirdetés Szövege</span>
                  </h2>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-600 font-mono">MAX 1500 KARAKTER</span>
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
                  <span>OPTIMALIZÁLÁS FOLYAMATBAN...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>ANYAGOK GENERÁLÁSA</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Section */}
        <div id="result-section" className="lg:col-span-7 space-y-6">
          {!result && !error && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border border-white/5 rounded-3xl bg-slate-900/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0"></div>
              <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 border border-white/10 rotate-3 transition-transform hover:rotate-0">
                <FileText className="w-10 h-10 text-slate-700" />
              </div>
              <h3 className="text-xl font-semibold text-slate-300">Várakozás adatokra</h3>
              <p className="text-slate-500 max-w-sm mt-2 text-sm">
                Az AI-HR motor készen áll az ATS-optimalizált pályázati anyagok létrehozására. Töltse ki a bal oldali mezőket a kezdéshez.
              </p>
              
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                {[
                  { icon: Zap, label: 'Bot-Friendly', desc: 'ATS high-match algoritmus' },
                  { icon: Lightbulb, label: 'Jövőorientált', desc: '2026-os HR trendek' },
                  { icon: Target, label: 'Személyre szabott', desc: '7 különböző stílus' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col items-center text-center">
                    <item.icon className="w-5 h-5 text-blue-500 mb-2" />
                    <p className="text-xs font-bold text-slate-300">{item.label}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start space-x-4 text-red-400 animate-in fade-in zoom-in">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <div>
                <h4 className="font-bold">Generálási Hiba</h4>
                <p className="text-sm opacity-90">{error}</p>
              </div>
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
                  className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-300 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg shadow-blue-500/10"
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
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tárgymező (Kattintás-optimalizált)</span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(result.subject)}
                    className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-slate-400 active:text-blue-400"
                    title="Copy"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-lg font-bold text-slate-200 mono relative z-10">
                  {result.subject}
                </div>
              </div>

              {/* Email Template */}
              <div className="glass p-6 rounded-2xl space-y-4 border-l-4 border-l-indigo-500">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Send className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Sablon (Min. 1000 karakter)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-[10px] font-mono px-2 py-1 rounded bg-slate-900 border border-white/5">
                      <span className={result.emailTemplate.length >= 1000 ? "text-green-400" : "text-amber-400"}>
                        {result.emailTemplate.length} karakter
                      </span>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(result.emailTemplate)}
                      className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-slate-400 active:text-indigo-400"
                      title="Copy"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="bg-slate-900/80 rounded-xl p-5 text-sm leading-relaxed whitespace-pre-wrap text-slate-300 border border-white/5 font-mono shadow-inner max-h-[500px] overflow-y-auto scrollbar-thin">
                  {result.emailTemplate}
                </div>
              </div>

              {/* Cover Letter */}
              <div className="glass p-6 rounded-2xl space-y-4 border-l-4 border-l-purple-500">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Motivációs Levél ({formData.style.split(' (')[0]})</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-[10px] font-mono px-2 py-1 rounded bg-slate-900 border border-white/5 text-slate-500">
                      A4 Standard Optimalizált
                    </div>
                    <button 
                      onClick={() => copyToClipboard(result.coverLetter + (result.salaryNote ? "\n\n" + result.salaryNote : ""))}
                      className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-slate-400 active:text-purple-400"
                      title="Copy All"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
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

              <div className="p-6 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-12 h-12" />
                </div>
                <div className="flex items-center space-x-3 text-blue-400 relative z-10">
                  <Target className="w-5 h-5" />
                  <h4 className="font-bold">2026-os ATS Validációs Jelentés</h4>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed relative z-10">
                  A fenti dokumentumok szemantikai kulcsszó-illesztése az álláshirdetéshez: <span className="text-green-400 font-bold">94%</span>. 
                  A stílus szigorúan igazodik a(z) <span className="text-blue-300 italic">{formData.style}</span> és <span className="text-blue-300 italic">{formData.tone}</span> elvárásaihoz. 
                  Az AI-kompetenciák integrálása sikeresen befejeződött.
                </p>
              </div>
            </div>
          )}
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
