import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, doc, deleteDoc, updateDoc, writeBatch, getDocs, setDoc } from 'firebase/firestore';
import { 
  Camera, MapPin, Users, RefreshCw, Languages, 
  Plus, Trash2, ImageIcon, FileSearch, Eye, EyeOff, X,
  AlertCircle, ChevronRight, GripVertical, Import, Plane,
  CloudSun, CloudRain, Snowflake, Cloud, Thermometer, Calendar, Clock, Navigation,
  Send, Info, Map as MapIcon, Bus, AlertTriangle, Edit3, Save, Link as LinkIcon,
  Circle, CheckCircle2, UserPlus, Receipt, ArrowRight, Wallet, Coins, DollarSign,
  Utensils, ShoppingBag, Home, TrainFront, Sparkles, BrainCircuit, HandCoins,
  TrendingUp, ArrowDownUp, Eraser, Volume2, Mic, HeartPulse, Search, Wand2
} from 'lucide-react';

// --- 配置區 (已填入您的專屬金鑰) ---
const firebaseConfig = {
  apiKey: "AIzaSyCPM-JWi3-mb-HlwMHwFCECcSg0gqvOQQU",
  authDomain: "iceplaytime.firebaseapp.com",
  projectId: "iceplaytime",
  storageBucket: "iceplaytime.firebasestorage.app",
  messagingSenderId: "508895466533",
  appId: "1:508895466533:web:3adab55f4a76ef4f7b1bcc",
  measurementId: "G-1Y099LRSRM"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "iceplaytime-app"; 
const apiKey = "AIzaSyBKmszrIeGMlBAoii6TjpNLJeepZP0TD1M"; // 您的 Gemini API 金鑰

const App = () => {
  const [activeTab, setActiveTab] = useState('split'); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) { console.warn("Auth error:", err); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'translate': return <TranslateSection user={user} />;
      case 'map': return <MapSection user={user} />;
      case 'split': return <SplitBillSection user={user} />;
      case 'currency': return <CurrencySection />;
      default: return <MapSection user={user} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-50 text-slate-800 font-sans overflow-hidden select-none text-[16px]">
      
      {/* 行動版 Header (使用冰雪藍 #6398A9) */}
      <header className="md:hidden bg-[#6398A9] p-4 pt-12 pb-4 flex justify-between items-center shadow-md shrink-0 z-50 text-white">
        <h1 className="text-xl font-bold tracking-widest font-serif italic">ICEPLAYTIME</h1>
        {user && <span className="text-[10px] bg-white/20 text-white px-2 py-1 rounded-md font-mono font-bold uppercase tracking-wider shadow-inner">UID: {user.uid.slice(0,5)}</span>}
      </header>

      {/* 電腦版 側邊導覽列 */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-[#6398A9] text-white p-6 shadow-2xl z-50 shrink-0 h-full">
        <div className="text-3xl font-bold font-serif italic tracking-wide mb-2 mt-4 text-[#F9B95C]">ICEPLAYTIME</div>
        {user && <div className="mb-10 text-xs bg-white/10 px-3 py-2 rounded-lg text-white/80 inline-block w-fit font-mono font-bold uppercase tracking-wider shadow-inner">UID: {user.uid.slice(0,5)}</div>}
        <div className="flex flex-col gap-3">
          <NavButton desktop active={activeTab === 'translate'} onClick={() => setActiveTab('translate')} icon={<Languages size={24} />} label="翻譯與生存韓文" />
          <NavButton desktop active={activeTab === 'map'} onClick={() => setActiveTab('map')} icon={<MapPin size={24} />} label="行程導航" />
          <NavButton desktop active={activeTab === 'split'} onClick={() => setActiveTab('split')} icon={<Users size={24} />} label="智慧分帳" />
          <NavButton desktop active={activeTab === 'currency'} onClick={() => setActiveTab('currency')} icon={<RefreshCw size={24} />} label="即時匯率" />
        </div>
      </aside>

      {/* 主要內容區 */}
      <main className="flex-1 overflow-y-auto pb-32 md:pb-8 p-0 md:p-8 lg:p-12 relative w-full h-full scrollbar-hide">
        <div className="max-w-[1600px] mx-auto w-full h-full">
          {renderContent()}
        </div>
      </main>

      {/* 行動版 底部導覽列 */}
      <nav className="md:hidden absolute bottom-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-100 flex justify-around p-2 pb-8 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <NavButton active={activeTab === 'translate'} onClick={() => setActiveTab('translate')} icon={<Languages size={24} />} label="翻譯" />
        <NavButton active={activeTab === 'map'} onClick={() => setActiveTab('map')} icon={<MapPin size={24} />} label="行程" />
        <NavButton active={activeTab === 'split'} onClick={() => setActiveTab('split')} icon={<Users size={24} />} label="分帳" />
        <NavButton active={activeTab === 'currency'} onClick={() => setActiveTab('currency')} icon={<RefreshCw size={24} />} label="匯率" />
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label, desktop }) => (
  <button onClick={onClick} className={`flex transition-all duration-300 ${desktop ? 'flex-row items-center gap-4 px-6 py-4 rounded-2xl w-full' : 'flex-col items-center gap-1 px-4 py-1 rounded-xl'} ${active ? (desktop ? 'bg-[#D7897F] text-white shadow-md scale-105' : 'text-[#D7897F] scale-110 bg-[#D7897F]/10') : (desktop ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-slate-400 hover:text-slate-600')}`}>
    {icon}
    <span className={`${desktop ? 'text-sm font-bold tracking-wide' : 'text-[10px] font-bold tracking-wider'}`}>{label}</span>
  </button>
);

const cleanJson = (str) => {
  if (!str) return "{}";
  const start = str.indexOf('{');
  const end = str.lastIndexOf('}');
  if (start !== -1 && end !== -1) return str.substring(start, end + 1);
  return str.replace(/```json/gi, "").replace(/```/g, "").trim();
};

// --- 1. 翻譯與生存韓文模組 ---
const TranslateSection = ({ user }) => {
  const [subTab, setSubTab] = useState('survival'); 
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [overlayData, setOverlayData] = useState([]); 
  const [showOverlay, setShowOverlay] = useState(true);
  const [rawAnalysis, setRawAnalysis] = useState("");
  const fileInputRef = useRef(null);

  const [survivalPhrases, setSurvivalPhrases] = useState(() => {
    try {
      const saved = localStorage.getItem('customSurvivalPhrases');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [isAddMode, setIsAddMode] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [draggedId, setDraggedId] = useState(null);
  const [newPhrase, setNewPhrase] = useState({ title: "", korean: "" });
  const [selectedTranslation, setSelectedTranslation] = useState(null);
  const [isPresetOpen, setIsPresetOpen] = useState(false);

  const presetPhrases = [
    { id: 'p1', title: '請問可以再給我一些小菜嗎？', korean: '반찬 좀 더 주시겠어요? (Ban-chan jom deo ju-si-ges-seo-yo?)' },
    { id: 'p2', title: '請問這個會很辣嗎？', korean: '혹시 이거 많이 매운가요? (Hok-si i-geo ma-ni mae-un-ga-yo?)' },
    { id: 'p3', title: '請問總共是多少錢？', korean: '전부 얼마인가요? (Jeon-bu eol-ma-in-ga-yo?)' },
    { id: 'p4', title: '請問洗手間在哪個方向？', korean: '혹시 화장실이 어디에 있나요? (Hok-si hwa-jang-sil-i eo-di-e it-na-yo?)' },
    { id: 'p5', title: '請問可以使用信用卡支付嗎？', korean: '혹시 카드 결제 가능한가요? (Hok-si ka-deu gyeol-je ga-neung-han-ga-yo?)' }
  ];

  useEffect(() => {
    localStorage.setItem('customSurvivalPhrases', JSON.stringify(survivalPhrases));
  }, [survivalPhrases]);

  const speak = (text) => {
    if (!text) return;
    const cleanKoreanText = text.split('(')[0].replace(/[a-zA-Z0-9]/g, '').trim();
    if (!cleanKoreanText) return;
    window.speechSynthesis.cancel();
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(cleanKoreanText);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }, 50);
  };

  const handleAiTranslate = async () => {
    if (!newPhrase.title.trim() || isTranslating) return;
    setIsTranslating(true);
    try {
      const prompt = `將以下中文翻譯成最有禮貌的韓文敬語。格式限定為：韓文原文 (羅馬拼音)。不要解釋。待翻譯：${newPhrase.title}`;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const result = await response.json();
      const translated = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setNewPhrase({ ...newPhrase, korean: translated.trim() });
    } catch (err) { alert("翻譯失敗"); } 
    finally { setIsTranslating(false); }
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result); setOverlayData([]); setRawAnalysis("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSmartOverlay = async () => {
    if (!image || !user) return;
    setLoading(true);
    try {
      const base64Data = image.split(',')[1];
      const prompt = `辨識圖片中所有韓文字並翻譯成繁體中文。回傳純 JSON：{"overlays": [{ "box_2d": [ymin, xmin, ymax, xmax], "text": "翻譯" }], "summary": "解說"}`;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: "image/png", data: base64Data } }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
        })
      });
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsed = JSON.parse(cleanJson(text));
      setOverlayData(parsed.overlays || []);
      setRawAnalysis(parsed.summary || "");
      setShowOverlay(true);
    } catch (err) { alert("掃描失敗，請確定 API Key 已生效。"); }
    finally { setLoading(false); }
  };

  const handleAddSurvival = () => {
    if (!newPhrase.title || !newPhrase.korean) return;
    setSurvivalPhrases([...survivalPhrases, { ...newPhrase, id: Date.now().toString(), order: survivalPhrases.length }]);
    setNewPhrase({ title: "", korean: "" }); setIsAddMode(false);
  };

  const handleDrop = (e, targetIdx) => {
    e.preventDefault(); if (!draggedId) return;
    const list = [...survivalPhrases].sort((a,b) => (a.order||0) - (b.order||0));
    const draggedIdx = list.findIndex(i => i.id === draggedId);
    const item = list.splice(draggedIdx, 1)[0];
    list.splice(targetIdx, 0, item);
    setSurvivalPhrases(list.map((it, idx) => ({ ...it, order: idx })));
    setDraggedId(null);
  };

  return (
    <div className="p-4 md:p-0 space-y-6">
      <div className="flex p-1 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-md">
        <button onClick={() => setSubTab('camera')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${subTab === 'camera' ? 'bg-[#6398A9] text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}><Camera size={18}/> 拍照翻譯</button>
        <button onClick={() => setSubTab('survival')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${subTab === 'survival' ? 'bg-[#6398A9] text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}><HeartPulse size={18}/> 生存韓文</button>
      </div>

      {subTab === 'camera' ? (
        <div className="space-y-6 animate-in fade-in duration-300 w-full max-w-2xl mx-auto pb-32 md:pb-12">
          {!image ? (
            <div className="mt-4 p-12 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 text-center">
              <Languages size={48} className="mx-auto text-[#6398A9] mb-6 opacity-80" />
              <h2 className="text-2xl font-bold font-serif text-slate-800 tracking-wide text-center">AR 即時掃描</h2>
              <button onClick={() => fileInputRef.current?.click()} className="mt-10 w-full py-4 bg-[#D7897F] text-white rounded-2xl font-bold tracking-widest shadow-md">拍照 / 上傳</button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative w-full rounded-[2rem] overflow-hidden shadow-xl border-4 border-white bg-slate-900 flex items-center justify-center min-h-[300px]">
                <img src={image} alt="Target" className="w-full h-auto max-h-[60vh] object-contain" />
                {showOverlay && overlayData.map((item, idx) => (
                  <div key={idx} 
                    onClick={() => setSelectedTranslation(item.text)}
                    className="absolute border border-white/50 bg-[#6398A9]/90 text-white flex items-center justify-center text-[10px] font-bold px-1 rounded shadow-sm z-10 text-center cursor-pointer"
                    style={{ 
                      top: `${item.box_2d[0]/10}%`, 
                      left: `${item.box_2d[1]/10}%`, 
                      width: `${(item.box_2d[3]-item.box_2d[1])/10}%`, 
                      height: `${(item.box_2d[2]-item.box_2d[0])/10}%` 
                    }}>
                    <span className="truncate w-full">{item.text}</span>
                  </div>
                ))}
                <div className="absolute top-4 right-4 flex flex-col gap-3 z-30">
                  <button onClick={() => { setImage(null); setOverlayData([]); }} className="p-3 bg-black/40 text-white rounded-full backdrop-blur-md"><X size={20}/></button>
                  {overlayData.length > 0 && <button onClick={() => setShowOverlay(!showOverlay)} className={`p-3 rounded-full backdrop-blur-md ${showOverlay ? 'bg-[#6398A9]' : 'bg-black/40'}`}><Eye size={20}/></button>}
                </div>
              </div>
              {!loading && overlayData.length === 0 && <button onClick={handleSmartOverlay} className="w-full py-5 bg-[#D7897F] text-white rounded-2xl font-bold tracking-widest shadow-md">開始掃描</button>}
              {loading && <div className="p-6 bg-white rounded-3xl flex items-center gap-5 shadow-sm text-[#6398A9] font-bold"><RefreshCw className="animate-spin" size={24}/> AI 正在分析實景...</div>}
              {rawAnalysis && (
                <div className="bg-white p-6 rounded-[1.5rem] border-l-4 border-[#F9B95C] shadow-sm animate-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-2 text-[#F9B95C] mb-3 font-bold text-xs uppercase tracking-widest"><FileSearch size={16}/> AI 文字解說</div>
                  <p className="text-sm text-slate-600 leading-loose whitespace-pre-wrap">{rawAnalysis}</p>
                </div>
              )}
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={onFileChange} />
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-300 pb-20 max-w-6xl mx-auto">
          <button onClick={() => setIsPresetOpen(!isPresetOpen)} className="flex justify-between items-center w-full px-4 py-3 rounded-2xl group hover:bg-slate-100">
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">正式敬語 生存模板</p>
            <ChevronRight size={18} className={`text-slate-400 transition-transform ${isPresetOpen ? 'rotate-90' : ''}`} />
          </button>
          
          {isPresetOpen && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-2">
              {presetPhrases.map(p => (
                <div key={p.id} onClick={() => speak(p.korean)} className="bg-white p-5 rounded-[2.2rem] border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer active:scale-95">
                  <div className="flex-1 pr-4">
                    <p className="text-[11px] font-bold text-[#D7897F] mb-1">{p.title}</p>
                    <p className="text-sm font-bold text-slate-800 leading-snug">{p.korean}</p>
                  </div>
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#D7897F]"><Volume2 size={20}/></div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-slate-200">
            <div className="flex justify-between items-center px-4 mb-5 mt-2">
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">自定義生存語 (智慧翻譯)</p>
              <button onClick={() => setIsAddMode(true)} className="p-2.5 bg-[#F9B95C] text-white rounded-full shadow-md"><Plus size={18}/></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-2">
              {survivalPhrases.sort((a,b)=>(a.order||0)-(b.order||0)).map((p, idx) => (
                <div key={p.id} draggable onDragStart={() => setDraggedId(p.id)} onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, idx)} onClick={() => speak(p.korean)} className="bg-[#96C7B3] p-5 rounded-[2.2rem] shadow-md flex items-center gap-4 cursor-pointer text-white active:scale-95 transition-all">
                  <div className="opacity-60 cursor-grab"><GripVertical size={20}/></div>
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-[10px] text-white/80 mb-1 truncate">{p.title}</p>
                    <p className="text-sm font-bold tracking-wide truncate">{p.korean}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                     <button onClick={(e) => { e.stopPropagation(); speak(p.korean); }} className="p-1"><Volume2 size={20}/></button>
                     <button onClick={(e) => { e.stopPropagation(); setSurvivalPhrases(survivalPhrases.filter(item => item.id !== p.id)); }} className="p-1 opacity-60"><Trash2 size={20}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isAddMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddMode(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-6 space-y-6 animate-in zoom-in-95">
            <div className="flex justify-between items-center"><h3 className="font-bold text-xl text-slate-800">AI 智慧小卡</h3><button onClick={() => setIsAddMode(false)}><X size={24}/></button></div>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400">中文指令</p>
                <div className="flex gap-2">
                  <input placeholder="如：我不吃辣..." className="flex-1 p-4 bg-slate-50 rounded-2xl font-bold border-none outline-none" value={newPhrase.title} onChange={e => setNewPhrase({...newPhrase, title: e.target.value})} />
                  <button onClick={handleAiTranslate} disabled={isTranslating} className="bg-[#F9B95C]/10 text-[#F9B95C] px-5 rounded-2xl">
                    {isTranslating ? <RefreshCw className="animate-spin" size={20}/> : <Wand2 size={20}/>}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400">AI 翻譯結果</p>
                <textarea placeholder="點擊魔法棒生成..." className="w-full p-5 bg-slate-50 rounded-2xl font-bold h-28 resize-none" value={newPhrase.korean} onChange={e => setNewPhrase({...newPhrase, korean: e.target.value})} />
              </div>
            </div>
            <button onClick={handleAddSurvival} className="w-full py-4 bg-[#96C7B3] text-white rounded-2xl font-bold">存入生存清單</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 2. 行程模組 ---
const MapSection = ({ user }) => {
  const [itinerary, setItinerary] = useState([]);
  const [flights, setFlights] = useState([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [importText, setImportText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [detailItem, setDetailItem] = useState(null); 
  const [weather, setWeather] = useState({ temp: '--', desc: '載入中', icon: <CloudSun size={20} className="text-[#F9B95C]" /> });
  const [isSelectingRoute, setIsSelectingRoute] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    if (!user) return;
    const unsubItin = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'itinerary'), (s) => setItinerary(s.docs.map(d => ({id: d.id, ...d.data()}))));
    const unsubFlight = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'flights'), (s) => setFlights(s.docs.map(d => ({id: d.id, ...d.data()}))));
    return () => { unsubItin(); unsubFlight(); };
  }, [user]);

  const handleNaverLink = (item) => {
    if (!item) return;
    const name = item.koreanName || item.name;
    window.open(`https://map.naver.com/p/search/${encodeURIComponent(name.split('(')[0].trim())}`, '_blank');
  };

  const handleSmartImport = async () => {
    if (!importText.trim() || isImporting) return;
    setIsImporting(true);
    try {
      const prompt = `將以下文字解析為旅遊行程 JSON：{"itinerary": [{"day": ${selectedDay}, "name": "景點名", "koreanName": "韓文名", "hours": "時間", "transport": "交通"}]}。僅回傳 JSON。待解析：\n${importText}`;
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } })
      });
      const result = await res.json();
      const parsed = JSON.parse(cleanJson(result.candidates?.[0]?.content?.parts?.[0]?.text));
      const batch = writeBatch(db);
      parsed.itinerary.forEach((item, idx) => {
        const ref = doc(collection(db, 'artifacts', appId, 'public', 'data', 'itinerary'));
        batch.set(ref, { ...item, day: Number(item.day), order: Date.now() + idx });
      });
      await batch.commit(); setImportText("");
    } catch (e) { alert("智慧解析失敗"); }
    finally { setIsImporting(false); }
  };

  const currentDayItems = itinerary.filter(item => Number(item.day) === selectedDay).sort((a,b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  return (
    <div className="p-4 md:p-0 space-y-6 pb-24">
      {flights.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {flights.map(f => (
            <div key={f.id} className="min-w-[280px] bg-[#6398A9] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="flex justify-between items-center mb-6 font-bold uppercase opacity-80"><Plane size={16} className="text-[#F9B95C]"/> {f.airline}</div>
              <div className="flex justify-between items-center px-2 font-bold italic">
                <div><h4 className="text-2xl font-serif">{f.route?.split('-')[0]}</h4><p className="text-[10px] opacity-70 uppercase tracking-widest">{f.depTime}</p></div>
                <div className="text-[10px] text-[#F9B95C] font-black">{f.flightNum}</div>
                <div className="text-right"><h4 className="text-2xl font-serif">{f.route?.split('-')[1]}</h4><p className="text-[10px] opacity-70 uppercase tracking-widest">{f.arrTime}</p></div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {[1, 2, 3, 4, 5, 6, 7].map(d => (
          <button key={d} onClick={() => setSelectedDay(d)} className={`min-w-[70px] py-4 rounded-2xl flex flex-col items-center transition-all border ${selectedDay === d ? 'bg-[#6398A9] text-white shadow-md border-[#6398A9]' : 'bg-white text-slate-400 border-slate-200'}`}>
            <span className="text-[10px] font-bold uppercase tracking-widest">Day</span>
            <span className="text-2xl font-serif font-bold">{d}</span>
          </button>
        ))}
      </div>

      <div className="md:grid md:grid-cols-2 md:gap-6 space-y-6 md:space-y-0">
         <div className="space-y-6">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-5"><div className="w-14 h-14 bg-[#F9B95C]/10 text-[#F9B95C] rounded-2xl flex items-center justify-center border border-[#F9B95C]/20">{weather.icon}</div>
                <div><div className="font-bold text-slate-800 text-xl">{weather.temp}</div><p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{weather.desc}</p></div>
              </div>
              <button onClick={() => setIsSelectingRoute(!isSelectingRoute)} className="bg-[#D7897F] text-white px-5 py-3 rounded-full text-xs font-bold shadow-md">快速導航</button>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-4">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 px-1 tracking-widest"><Import size={18} className="text-[#96C7B3]"/> 智慧匯入行程</h3>
              <textarea placeholder="貼上去趣內容或景點備註..." className="w-full p-5 bg-slate-50 rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 ring-[#96C7B3]/30 h-28 resize-none shadow-inner" value={importText} onChange={(e) => setImportText(e.target.value)} />
              <button onClick={handleSmartImport} disabled={isImporting} className="w-full py-4 bg-[#96C7B3] text-white rounded-[1.5rem] font-bold shadow-md active:scale-95 transition-all">
                {isImporting ? <RefreshCw className="animate-spin" size={18}/> : <Send size={18}/>} 開始 AI 處理
              </button>
            </div>
         </div>

         <div className="space-y-4">
            {currentDayItems.map((item, idx) => (
              <div key={item.id} onClick={() => isSelectingRoute ? handleNaverLink(item) : setDetailItem(item)} className="bg-white p-5 rounded-[2.2rem] flex items-center justify-between border border-slate-100 shadow-sm active:bg-slate-50 transition-all cursor-pointer">
                <div className="flex items-center gap-4 flex-1 min-w-0"><div className="text-slate-300"><GripVertical size={20}/></div>
                  <div className="truncate"><h4 className="font-bold text-slate-800 truncate">{item.name}</h4><p className="text-[10px] text-slate-400 font-bold uppercase truncate">{item.koreanName || "點擊查看詳情"}</p></div>
                </div>
                <ChevronRight size={20} className="text-slate-200 shrink-0" />
              </div>
            ))}
            {currentDayItems.length === 0 && <div className="py-20 text-center text-slate-300 font-bold border-2 border-dashed rounded-[2.5rem]">目前無行程</div>}
         </div>
      </div>

      {detailItem && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDetailItem(null)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-t-[3rem] sm:rounded-[3rem] p-8 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-start mb-6">
              <div><h2 className="text-2xl font-bold font-serif">{detailItem.name}</h2><p className="text-[#6398A9] font-bold text-lg uppercase">{detailItem.koreanName}</p></div>
              <button onClick={() => setDetailItem(null)} className="p-2 bg-slate-100 rounded-full"><X size={24}/></button>
            </div>
            <div className="space-y-6 mb-10 font-bold">
               <div className="space-y-1"><p className="text-[10px] text-slate-400 uppercase tracking-widest">營業時間</p><p className="text-sm text-slate-700">{detailItem.hours || "尚未輸入資訊"}</p></div>
               <div className="space-y-1"><p className="text-[10px] text-slate-400 uppercase tracking-widest">交通方式</p><p className="text-sm text-slate-700">{detailItem.transport || "尚未輸入資訊"}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleNaverLink(detailItem)} className="py-4 bg-[#6398A9] text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"><Navigation size={20}/> 導航</button>
              <button onClick={() => { deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'itinerary', detailItem.id)); setDetailItem(null); }} className="py-4 bg-slate-100 text-slate-400 rounded-2xl font-bold flex items-center justify-center gap-2"><Trash2 size={20}/> 刪除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 3. 分帳模組 ---
const SplitBillSection = ({ user }) => {
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [newMember, setNewMember] = useState("");
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsubM = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'members'), (s) => setMembers(s.docs.map(d => ({id: d.id, ...d.data()}))));
    const unsubE = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'expenses'), (s) => setExpenses(s.docs.map(d => ({id: d.id, ...d.data()}))));
    return () => { unsubM(); unsubE(); };
  }, [user]);

  const handleAiParse = async () => {
    if (!aiInput.trim() || isAiLoading) return;
    setIsAiLoading(true);
    try {
      const memberNames = members.map(m => m.name).join(', ');
      const prompt = `旅伴有：${memberNames}。將以下內容轉為 JSON 格式：{"title": "項目", "amount": 數字, "payers": {"姓名": 墊付金額}, "sharers": ["參與姓名"]}。待解析：${aiInput}`;
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } })
      });
      const data = await res.json();
      const parsed = JSON.parse(cleanJson(data.candidates?.[0]?.content?.parts?.[0]?.text));
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'expenses'), { ...parsed, createdAt: Date.now() });
      setAiInput(""); setIsAiMode(false);
    } catch(e) { alert("AI 記帳解析失敗"); }
    finally { setIsAiLoading(false); }
  };

  const balances = (() => {
    const b = {}; members.forEach(m => b[m.name] = 0);
    expenses.forEach(e => {
      Object.entries(e.payers || {}).forEach(([n, a]) => { if (b[n] !== undefined) b[n] += a; });
      const per = e.amount / (e.sharers?.length || members.length);
      (e.sharers || members.map(m=>m.name)).forEach(s => { if (b[s] !== undefined) b[s] -= per; });
    });
    return b;
  })();

  const settlement = (() => {
    let creds = []; let debts = [];
    Object.keys(balances).forEach(n => {
      if (balances[n] > 1) creds.push({ n, a: balances[n] });
      else if (balances[n] < -1) debts.push({ n, a: Math.abs(balances[n]) });
    });
    const s = []; let di = 0, ci = 0;
    while(di < debts.length && ci < creds.length) {
      const p = Math.min(debts[di].a, creds[ci].a);
      if (p > 1) s.push({ f: debts[di].n, t: creds[ci].n, a: Math.round(p) });
      debts[di].a -= p; creds[ci].a -= p;
      if (debts[di].a <= 1) di++; if (creds[ci].a <= 1) ci++;
    }
    return s;
  })();

  return (
    <div className="p-4 md:p-0 space-y-6 pb-24">
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <h3 className="font-bold text-[#6398A9] flex items-center gap-2 mb-4 tracking-widest uppercase"><Users size={20}/> 旅伴群組</h3>
        <div className="flex flex-wrap gap-2 mb-5">
          {members.map(m => (
            <div key={m.id} className="bg-[#96C7B3]/10 text-[#96C7B3] px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 border border-[#96C7B3]/20">
              {m.name} <button onClick={() => deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'members', m.id))} className="hover:text-[#D7897F]"><X size={14}/></button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="flex-1 bg-slate-50 p-4 rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 ring-[#6398A9]/20" placeholder="成員姓名..." value={newMember} onChange={e => setNewMember(e.target.value)} />
          <button onClick={() => { if(!newMember) return; addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'members'), {name: newMember}); setNewMember(""); }} className="bg-[#6398A9] text-white px-5 rounded-2xl shadow-md active:scale-95"><Plus size={20}/></button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setIsAiMode(!isAiMode)} className={`py-5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${isAiMode ? 'bg-[#F9B95C] text-white' : 'bg-white text-slate-400'}`}>
          <BrainCircuit size={20}/> AI 智慧快記
        </button>
        <button onClick={() => alert("手動功能正優化中...")} className="bg-white text-slate-300 border-2 border-dashed rounded-2xl py-5 font-bold">手動入帳</button>
      </div>

      {isAiMode && (
        <div className="bg-[#F9B95C]/10 p-6 rounded-[2.5rem] border border-[#F9B95C]/20 space-y-4 animate-in slide-in-from-top-2">
           <textarea placeholder="例如：晚餐 50000 韓元，S 付了 30000，A 付了 20000，平分。" className="w-full p-5 rounded-2xl h-28 text-sm font-bold border-none outline-none shadow-inner bg-white" value={aiInput} onChange={e => setAiInput(e.target.value)} />
           <button onClick={handleAiParse} disabled={isAiLoading} className="w-full py-4 bg-[#F9B95C] text-white rounded-2xl font-bold shadow-md active:scale-95 transition-all">{isAiLoading ? "AI 處理中..." : "確認並入帳"}</button>
        </div>
      )}

      <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-slate-100 relative overflow-hidden font-bold">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Sparkles size={16} className="text-[#F9B95C]"/> 最終分帳結論 (韓元)</h4>
        {settlement.length > 0 ? (
           <div className="space-y-4 relative z-10">
              {settlement.map((s, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                   <span className="bg-[#D7897F] text-white px-3 py-1.5 rounded-xl shadow-sm">{s.f}</span>
                   <ArrowRight size={16} className="text-slate-300"/>
                   <span className="bg-[#96C7B3] text-white px-3 py-1.5 rounded-xl shadow-sm">{s.t}</span>
                   <span className="ml-auto text-[#6398A9] font-serif text-lg">₩ {s.a.toLocaleString()}</span>
                </div>
              ))}
           </div>
        ) : <p className="py-10 text-center text-slate-400 font-bold border-2 border-dashed rounded-3xl">帳務已平衡</p>}
      </div>

      <div className="space-y-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">支出歷史明細</p>
        {expenses.sort((a,b)=>b.createdAt-a.createdAt).map(e => (
          <div key={e.id} className="bg-white p-5 rounded-[2.2rem] flex items-center justify-between shadow-sm border border-slate-100">
             <div><h4 className="font-bold text-slate-800">{e.title}</h4><p className="text-[10px] text-slate-400 font-bold uppercase">{Object.keys(e.payers).join(', ')} 墊付</p></div>
             <div className="flex items-center gap-3">
               <span className="font-serif text-[#6398A9] font-bold">₩ {Math.round(e.amount).toLocaleString()}</span>
               <button onClick={() => deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'expenses', e.id))} className="text-slate-200"><Trash2 size={16}/></button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 4. 匯率模組 ---
const CurrencySection = () => {
  const [rate, setRate] = useState(42.5); 
  const [twd, setTwd] = useState("");
  const [krw, setKrw] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/TWD`);
      const data = await res.json();
      if (data?.rates?.KRW) {
        setRate(data.rates.KRW);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (e) { console.warn(e); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRate(); }, []);

  return (
    <div className="p-4 md:p-0 space-y-6 animate-in fade-in duration-500 text-slate-800 pb-20">
      <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 text-[#D7897F] font-bold bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
            <TrendingUp size={16}/><span className="text-xs tracking-widest font-serif">1 TWD ≈ {rate.toFixed(2)} KRW</span>
          </div>
          <button onClick={fetchRate} className={`p-3 bg-[#D7897F]/10 text-[#D7897F] rounded-full ${loading ? 'animate-spin' : ''}`}><RefreshCw size={20}/></button>
        </div>
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-transparent focus-within:border-[#6398A9] transition-all">
            <p className="text-[10px] font-bold text-slate-400 mb-2 tracking-widest uppercase">韓元 KRW</p>
            <div className="flex items-center gap-3">
               <span className="text-3xl font-serif text-[#6398A9]">₩</span>
               <input type="number" className="w-full bg-transparent text-4xl font-serif outline-none" value={krw} onChange={e => {setKrw(e.target.value); setTwd(e.target.value ? (e.target.value/rate).toFixed(1) : "");}} placeholder="0" />
            </div>
          </div>
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-transparent focus-within:border-[#D7897F] transition-all">
            <p className="text-[10px] font-bold text-slate-400 mb-2 tracking-widest uppercase">台幣 TWD</p>
            <div className="flex items-center gap-3">
               <span className="text-3xl font-serif text-[#D7897F]">$</span>
               <input type="number" className="w-full bg-transparent text-4xl font-serif outline-none" value={twd} onChange={e => {setTwd(e.target.value); setKrw(e.target.value ? Math.round(e.target.value*rate) : "");}} placeholder="0" />
            </div>
          </div>
        </div>
        <button onClick={() => { setTwd(""); setKrw(""); }} className="w-full mt-6 py-4 bg-[#F9B95C] text-white rounded-2xl font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"><Eraser size={20}/> 金額歸零</button>
        <div className="mt-6 pt-4 text-right"><span className="text-[10px] font-bold text-slate-400 tracking-widest opacity-60">最後更新: {lastUpdated}</span></div>
      </div>

      <div className="grid grid-cols-3 gap-3 px-2">
         {[1000, 5000, 10000, 30000, 50000, 100000].map(v => (
            <button key={v} onClick={() => { setKrw(v.toString()); setTwd((v/rate).toFixed(1)); }} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-1 active:scale-95 transition-all">
               <span className="text-sm font-bold text-slate-800 tracking-tight">₩ {v.toLocaleString()}</span>
               <span className="text-[10px] text-slate-400 font-bold">≈ $ {Math.round(v/rate)}</span>
            </button>
         ))}
      </div>
    </div>
  );
};

export default App;
