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

// --- 配置區 ---
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
const appId = "iceplaytime-app"; // 你的專屬 App ID
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

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
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-50 text-slate-800 font-sans overflow-hidden select-none text-[17px] leading-relaxed">

      {/* 行動版 Header (使用冰雪藍 #6398A9) */}
      <header className="md:hidden bg-[#6398A9] p-4 pt-12 pb-4 flex justify-between items-center shadow-md shrink-0 z-50 text-white">
        <h1 className="text-xl font-bold tracking-widest font-serif">ICEPLAYTIME</h1>
        {user && <span className="text-[10px] bg-white/20 text-white px-2 py-1 rounded-md font-mono font-bold uppercase tracking-wider shadow-inner">UID: {user.uid.slice(0, 5)}</span>}
      </header>

      {/* 電腦版 側邊導覽列 (滿版 Dashboard 風格，使用冰雪藍 #6398A9) */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-[#6398A9] text-white p-6 shadow-2xl z-50 shrink-0 h-full">
        <div className="text-3xl font-bold font-serif tracking-wide mb-2 mt-4 text-[#F9B95C]">ICEPLAYTIME</div>
        {user && <div className="mb-10 text-xs bg-white/10 px-3 py-2 rounded-lg text-white/80 inline-block w-fit font-mono font-bold uppercase tracking-wider shadow-inner">UID: {user.uid.slice(0, 5)}</div>}
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

// 導航按鈕色彩更新 (使用柔和粉紅 #D7897F 為主要活躍色)
const NavButton = ({ active, onClick, icon, label, desktop }) => (
  <button onClick={onClick} className={`flex transition-all duration-300 ${desktop ? 'flex-row items-center gap-4 px-6 py-4 rounded-2xl w-full' : 'flex-col items-center gap-1 px-4 py-1 rounded-xl'} ${active ? (desktop ? 'bg-[#D7897F] text-white shadow-md scale-105' : 'text-[#D7897F] scale-110 bg-[#D7897F]/10') : (desktop ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-slate-400 hover:text-slate-600')}`}>
    {icon}
    <span className={`${desktop ? 'text-sm font-bold tracking-wide' : 'text-[10px] font-bold tracking-wider'}`}>{label}</span>
  </button>
);

const cleanJson = (str) => {
  if (!str) return "{}";
  const cleaned = str.replace(/```json/gi, "").replace(/```/g, "").trim();
  return cleaned || "{}";
};

// --- 翻譯與生存韓文模組 ---
const TranslateSection = ({ user }) => {
  const [subTab, setSubTab] = useState('survival');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [overlayData, setOverlayData] = useState([]);
  const [showOverlay, setShowOverlay] = useState(true);
  const [rawAnalysis, setRawAnalysis] = useState("");
  const fileInputRef = useRef(null);

  // 核心狀態：控制哪一個按鈕正在轉圈/變色
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState(null);

  // 核心修復 1：在組件最頂層建立播放器引用
  const audioRef = useRef(new Audio());

  const [survivalPhrases, setSurvivalPhrases] = useState(() => {
    try {
      const saved = localStorage.getItem('customSurvivalPhrases');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAddMode, setIsAddMode] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [draggedId, setDraggedId] = useState(null);
  const [newPhrase, setNewPhrase] = useState({ title: "", korean: "" });
  const [selectedTranslation, setSelectedTranslation] = useState(null);
  const [isPresetOpen, setIsPresetOpen] = useState(false);

  const presetPhrases = [
    { id: 'p1', title: '請問可以再給我一些小菜嗎？', korean: '반찬 좀 더 주시겠어요? (Ban-chan jom deo ju-si-ges-seo-yo?)', type: 'preset' },
    { id: 'p2', title: '請問這個會很辣嗎？', korean: '혹시 이거 많이 매운가요? (Hok-si i-geo ma-ni mae-un-ga-yo?)', type: 'preset' },
    { id: 'p3', title: '請問總共是多少錢？', korean: '전부 얼마인가요? (Jeon-bu eol-ma-in-ga-yo?)', type: 'preset' },
    { id: 'p4', title: '請問洗手間在哪個方向？', korean: '혹시 화장실이 어디에 있나요? (Hok-si hwa-jang-sil-i eo-di-e it-na-yo?)', type: 'preset' },
    { id: 'p5', title: '請問可以使用信用卡支付嗎？', korean: '혹시 카드 결제 가능한가요? (Hok-si ka-deu gyeol-je ga-neung-han-ga-yo?)', type: 'preset' }
  ];

  useEffect(() => {
    localStorage.setItem('customSurvivalPhrases', JSON.stringify(survivalPhrases));
  }, [survivalPhrases]);

  // 核心修復 2：精簡且強大的 speak 函數
  const speak = (text, id = null) => {
    if (!text) return;
    const cleanKoreanText = text.split('(')[0].trim();
    if (!cleanKoreanText) return;

    // 1. 立即變色/轉圈
    if (id) setCurrentlySpeakingId(id);

    // 2. 取得全域播放器並更換網址
    const player = audioRef.current;
    player.src = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanKoreanText)}&tl=ko&client=tw-ob`;

    // 3. 設定監聽器：播完或失敗都要變回原色
    player.onended = () => setCurrentlySpeakingId(null);
    player.onerror = () => setCurrentlySpeakingId(null);

    // 4. 強制執行播放
    const playPromise = player.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn("Audio play blocked:", error);
        // 如果被系統擋住，2秒後強制讓 UI 恢復正常
        setTimeout(() => setCurrentlySpeakingId(null), 2000);
      });
    }
  };

  // --- 接下來是 handleAiTranslate ... ---

  const handleAiTranslate = async () => {
    if (!newPhrase.title.trim() || isTranslating) return;
    setIsTranslating(true);
    try {
      const prompt = `你是一個專業韓文翻譯家。請將以下中文翻譯成「最有禮貌」的韓文敬語。請只回傳唯一的一句翻譯結果，絕對不要包含任何解釋、選項或引言。格式嚴格限定為：韓文原文 (羅馬拼音)。待翻譯中文：${newPhrase.title}`;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || "API 請求失敗");
      const translated = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setNewPhrase({ ...newPhrase, korean: translated.trim() });
    } catch (err) {
      console.warn(err);
      alert(`AI 魔法失敗：${err.message}\n(如果看到 400 或 403，請確認 API Key 是否綁定帳單)`);
    }
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
      // 修復：動態抓取圖片格式，解決手機上傳 JPEG 被拒絕的問題
      const mimeType = image.split(';')[0].split(':')[1] || "image/jpeg";
      const base64Data = image.split(',')[1];
      const prompt = `你是一個專業旅遊助手。請精準辨識圖片中「所有」的韓文字，並將「每一個」辨識到的區塊都翻譯成繁體中文，絕不能遺漏任何角落的文字。回傳純 JSON 格式：{"overlays": [{ "box_2d": [ymin, xmin, ymax, xmax], "text": "翻譯" }], "summary": "解說"}`;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: mimeType, data: base64Data } }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || "API 請求失敗");
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("無效的翻譯結果");
      const parsed = JSON.parse(cleanJson(text));

      const safeOverlays = Array.isArray(parsed.overlays)
        ? parsed.overlays.filter(item => item && Array.isArray(item.box_2d) && item.box_2d.length === 4 && item.text)
        : [];

      setOverlayData(safeOverlays);
      setRawAnalysis(parsed.summary || "");
      setShowOverlay(true);
    } catch (err) {
      console.warn("Overlay fetch failed:", err);
      alert(`掃描失敗：${err.message}\n(請確認 API Key 是否設定正確)`);
    }
    finally { setLoading(false); }
  };

  const handleAddSurvival = () => {
    if (!newPhrase.title || !newPhrase.korean) return;
    const newItem = {
      ...newPhrase,
      id: Date.now().toString(),
      order: survivalPhrases.length,
      createdAt: Date.now()
    };
    setSurvivalPhrases([...survivalPhrases, newItem]);
    setNewPhrase({ title: "", korean: "" });
    setIsAddMode(false);
  };

  const handleDrop = (e, targetIdx) => {
    e.preventDefault();
    if (!draggedId) return;
    const list = [...survivalPhrases].sort((a, b) => (a.order || 0) - (b.order || 0));
    const draggedIdx = list.findIndex(i => i.id === draggedId);
    if (draggedIdx === -1) return;
    const item = list.splice(draggedIdx, 1)[0];
    list.splice(targetIdx, 0, item);

    const updated = list.map((it, idx) => ({ ...it, order: idx }));
    setSurvivalPhrases(updated);
    setDraggedId(null);
  };

  return (
    <div className="p-4 md:p-0 space-y-6">
      {/* 頂部切換按鈕 (選中: #6398A9) */}
      <div className="flex p-1 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-md">
        <button onClick={() => setSubTab('camera')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${subTab === 'camera' ? 'bg-[#6398A9] text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}><Camera size={18} /> 拍照翻譯</button>
        <button onClick={() => setSubTab('survival')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${subTab === 'survival' ? 'bg-[#6398A9] text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}><HeartPulse size={18} /> 生存韓文</button>
      </div>

      {subTab === 'camera' ? (
        <div className="space-y-6 animate-in fade-in duration-300 w-full max-w-2xl mx-auto pb-32 md:pb-12">
          {!image ? (
            <div className="mt-4 p-12 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 text-center animate-in zoom-in-95">
              <Languages size={48} className="mx-auto text-[#6398A9] mb-6 opacity-80" />
              <h2 className="text-2xl font-bold font-serif text-slate-800 tracking-wide">AR 即時掃描</h2>
              <button onClick={() => fileInputRef.current?.click()} className="mt-10 w-full py-4 bg-[#D7897F] text-white rounded-2xl font-bold tracking-widest shadow-md hover:bg-opacity-90 transition-colors">拍照 / 上傳</button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-center w-full">
                <div className="relative w-full rounded-[2rem] overflow-hidden shadow-lg border-2 border-white bg-slate-100">
                  <img src={image} alt="Target" className="w-full h-auto block" />
                  {showOverlay && overlayData.map((item, idx) => (
                    <div key={idx}
                      onClick={() => setSelectedTranslation(item.text)}
                      className="absolute border border-white/40 bg-[#6398A9]/90 text-white flex items-center justify-center text-[10px] md:text-xs font-bold px-1 rounded shadow-sm z-10 text-center tracking-wide cursor-pointer hover:bg-opacity-100 transition-colors"
                      style={{
                        top: `${item.box_2d[0] / 10}%`,
                        left: `${item.box_2d[1] / 10}%`,
                        width: `${(item.box_2d[3] - item.box_2d[1]) / 10}%`,
                        height: `${(item.box_2d[2] - item.box_2d[0]) / 10}%`
                      }}>
                      <span className="truncate w-full">{item.text}</span>
                    </div>
                  ))}
                  <div className="absolute top-3 right-3 flex flex-col gap-3 z-30">
                    <button onClick={() => { setImage(null); setOverlayData([]); setRawAnalysis(""); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="p-3 bg-black/40 text-white rounded-full backdrop-blur-md hover:bg-black/60 transition-colors"><X size={20} /></button>
                    {overlayData.length > 0 && <button onClick={() => setShowOverlay(!showOverlay)} className={`p-3 rounded-full backdrop-blur-md transition-colors ${showOverlay ? 'bg-[#6398A9] text-white' : 'bg-black/40 text-white hover:bg-black/60'}`}><Eye size={20} /></button>}
                  </div>
                </div>
              </div>
              {!loading && overlayData.length === 0 && <button onClick={handleSmartOverlay} className="w-full py-5 bg-[#D7897F] text-white rounded-2xl font-bold tracking-widest shadow-md hover:bg-opacity-90 transition-colors">開始掃描</button>}
              {loading && <div className="p-6 bg-white rounded-3xl flex items-center gap-5 shadow-sm border border-slate-200 text-[#6398A9] font-bold tracking-wide"><RefreshCw className="animate-spin" size={24} /> AI 正在分析實景...</div>}
              {rawAnalysis && (
                <div className="bg-white p-6 rounded-[1.5rem] border-l-4 border-[#F9B95C] shadow-sm animate-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-2 text-[#F9B95C] mb-3 font-bold text-xs uppercase tracking-widest"><FileSearch size={16} /> AI 文字解說</div>
                  <p className="text-sm text-slate-600 font-medium leading-loose whitespace-pre-wrap">{rawAnalysis}</p>
                </div>
              )}
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={onFileChange} />

          {selectedTranslation && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedTranslation(null)}></div>
              <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-8 animate-in zoom-in-95 border border-slate-200">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-bold font-serif text-xl text-slate-800 flex items-center gap-2">
                    <Languages size={22} className="text-[#6398A9]" /> 翻譯詳情
                  </h3>
                  <button onClick={() => setSelectedTranslation(null)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"><X size={20} /></button>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-inner max-h-[40vh] overflow-y-auto scrollbar-hide">
                  <p className="text-sm md:text-base text-slate-800 leading-loose font-bold whitespace-pre-wrap">{selectedTranslation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-5 duration-300 pb-20 max-w-6xl mx-auto">
          <div>
            <button
              onClick={() => setIsPresetOpen(!isPresetOpen)}
              className="flex justify-between items-center w-full px-4 py-3 mb-2 rounded-2xl group hover:bg-slate-100 transition-colors"
            >
              <p className="text-[15px] font-black text-slate-600 group-hover:text-[#D7897F] transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#D7897F] rounded-full"></span>
                正式敬語 生存模板
              </p>
              <ChevronRight size={18} className={`text-slate-400 transition-transform duration-300 ${isPresetOpen ? 'rotate-90' : ''}`} />
            </button>

            {isPresetOpen && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6 px-2 animate-in fade-in slide-in-from-top-2 duration-300">
                {presetPhrases.map(p => {
                  const isSpeaking = currentlySpeakingId === p.id;
                  return (
                    <div key={p.id} className={`bg-white p-5 rounded-[2.2rem] border transition-all flex items-center justify-between ${isSpeaking ? 'border-[#D7897F] bg-[#D7897F]/5 shadow-inner' : 'border-slate-100 shadow-sm'}`}>
                      <div className="flex-1 pr-4">
                        <p className="text-[11px] md:text-xs font-bold text-[#D7897F] mb-2">{p.title}</p>
                        <p className="text-sm md:text-base font-bold text-slate-800 tracking-wide leading-snug">{p.korean}</p>
                      </div>

                      {/* 核心修改：點擊事件綁在 Button 上 */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speak(p.korean, p.id);
                        }}
                        className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center transition-all shadow-sm ${isSpeaking ? 'bg-[#D7897F] text-white animate-pulse' : 'bg-slate-50 text-slate-300 hover:text-[#D7897F]'}`}
                      >
                        {isSpeaking ? <RefreshCw size={22} className="animate-spin" /> : <Volume2 size={22} />}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200">
            <div className="flex justify-between items-center px-4 mb-5 mt-2">
              <p className="text-[15px] font-black text-slate-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#96C7B3] rounded-full"></span>
                自定義生存語 (智慧翻譯)
              </p>
              <button onClick={() => setIsAddMode(true)} className="p-2.5 bg-[#F9B95C] text-white rounded-full shadow-md hover:bg-opacity-90 hover:scale-105 active:scale-95 transition-all"><Plus size={18} /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-2">
              {survivalPhrases.sort((a, b) => (a.order || 0) - (b.order || 0)).map((p, idx) => {
                const isSpeaking = currentlySpeakingId === p.id;
                return (
                  <div key={p.id} className={`p-5 rounded-[2.2rem] shadow-md flex items-center gap-4 transition-all ${isSpeaking ? 'bg-[#F9B95C] scale-[0.98] shadow-inner' : 'bg-[#96C7B3]'}`}>
                    <div className="text-white/60 cursor-grab"><GripVertical size={20} /></div>
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-[10px] md:text-xs font-bold text-white/80 mb-1.5 truncate">{p.title}</p>
                      <p className="text-sm md:text-base font-bold text-white tracking-wide truncate">{p.korean}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {/* 播放按鈕 */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speak(p.korean, p.id);
                        }}
                        className={`p-2 rounded-xl transition-all ${isSpeaking ? 'bg-white/20 text-white' : 'text-white hover:bg-white/10'}`}
                      >
                        {isSpeaking ? <RefreshCw size={20} className="animate-spin" /> : <Volume2 size={20} />}
                      </button>
                      {/* 刪除按鈕 */}
                      <button onClick={(e) => { e.stopPropagation(); setSurvivalPhrases(survivalPhrases.filter(item => item.id !== p.id)); }} className="p-2 text-white/60 hover:text-white"><Trash2 size={20} /></button>
                    </div>
                  </div>
                );
              })}
              {survivalPhrases.length === 0 && (
                <div className="md:col-span-2 xl:col-span-3 py-16 text-center bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                  <p className="text-base font-black text-slate-400">目前尚無自定義小卡</p>
                  <p className="text-xs font-bold text-slate-400 mt-2">點擊上方黃色 "+" 按鈕開始建立</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isAddMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddMode(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-8 space-y-6 animate-in zoom-in-95 border border-slate-200">
            <div className="flex justify-between items-center"><h3 className="font-bold font-serif text-xl md:text-2xl text-slate-800">AI 智慧小卡</h3><button onClick={() => setIsAddMode(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button></div>
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">中文指令</p>
                <div className="flex gap-2">
                  <input placeholder="如：我不吃辣..." className="flex-1 p-4 bg-slate-50 rounded-2xl text-sm md:text-base font-bold border-none outline-none focus:ring-2 ring-[#F9B95C]/30 text-slate-800 shadow-sm" value={newPhrase.title} onChange={e => setNewPhrase({ ...newPhrase, title: e.target.value })} />
                  <button onClick={handleAiTranslate} disabled={isTranslating} className="bg-[#F9B95C]/10 text-[#F9B95C] px-5 rounded-2xl hover:bg-[#F9B95C]/20 active:scale-95 transition-all shadow-sm border border-[#F9B95C]/20">{isTranslating ? <RefreshCw className="animate-spin" size={20} /> : <Wand2 size={20} />}</button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">AI 韓文翻譯結果</p>
                <textarea placeholder="點擊魔法棒自動生成..." className="w-full p-5 bg-slate-50 rounded-2xl text-sm md:text-base font-bold border-none outline-none focus:ring-2 ring-[#F9B95C]/30 h-28 resize-none text-slate-800 shadow-sm leading-relaxed" value={newPhrase.korean} onChange={e => setNewPhrase({ ...newPhrase, korean: e.target.value })} />
              </div>
            </div>
            <button onClick={handleAddSurvival} className="w-full py-4 md:py-5 bg-[#96C7B3] text-white rounded-2xl font-bold tracking-widest text-lg shadow-md hover:bg-opacity-90 active:scale-95 transition-all mt-2">存入生存清單</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 行程模組 ---
const MapSection = ({ user }) => {
  const [itinerary, setItinerary] = useState([]);
  const [flights, setFlights] = useState([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [importText, setImportText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [weather, setWeather] = useState({ temp: '--', desc: '載入中', icon: <CloudSun size={20} className="text-[#F9B95C]" /> });
  const [isSelectingRoute, setIsSelectingRoute] = useState(false);
  const [routeSelection, setRouteSelection] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [isAiFetchingDetail, setIsAiFetchingDetail] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsubItin = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'itinerary'), (s) => setItinerary(s.docs.map(d => ({ id: d.id, ...d.data() }))), (err) => console.warn("Sync error:", err));
    const unsubFlight = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'flights'), (s) => setFlights(s.docs.map(d => ({ id: d.id, ...d.data() }))), (err) => console.warn("Sync error:", err));
    return () => { unsubItin(); unsubFlight(); };
  }, [user]);

  useEffect(() => {
    const fetchRealWeather = async () => {
      const items = itinerary.filter(item => Number(item.day) === selectedDay);
      const loc = items[0]?.name || '首爾';

      try {
        setWeather({ temp: '--', desc: '查詢即時天氣...', icon: <RefreshCw size={20} className="text-slate-400 animate-spin" /> });

        const prompt = `請找出韓國景點或城市「${loc}」的大約經緯度座標。只需回傳純 JSON 格式：{"lat": 37.5665, "lon": 126.9780}`;
        const geoRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } })
        });
        const geoResult = await geoRes.json();
        const text = geoResult.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("無效的座標結果");
        const { lat, lon } = JSON.parse(cleanJson(text));

        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Asia%2FSeoul&forecast_days=1`);
        const weatherData = await weatherRes.json();

        const maxTemp = Math.round(weatherData.daily.temperature_2m_max[0]);
        const minTemp = Math.round(weatherData.daily.temperature_2m_min[0]);
        const code = weatherData.daily.weathercode[0];

        let desc = "晴天";
        let iconCode = 'sun';
        if (code >= 1 && code <= 3) { desc = "多雲"; iconCode = 'cloud'; }
        else if (code === 45 || code === 48) { desc = "起霧"; iconCode = 'cloud'; }
        else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) { desc = "雨天"; iconCode = 'rain'; }
        else if ((code >= 71 && code <= 77) || code === 85 || code === 86) { desc = "下雪"; iconCode = 'snow'; }
        else if (code >= 95) { desc = "雷雨"; iconCode = 'rain'; }

        let icon = <CloudSun size={20} className="text-[#F9B95C]" />;
        if (iconCode === 'cloud') icon = <Cloud size={20} className="text-slate-400" />;
        if (iconCode === 'rain') icon = <CloudRain size={20} className="text-[#6398A9]" />;
        if (iconCode === 'snow') icon = <Snowflake size={20} className="text-[#96C7B3]" />;

        setWeather({ temp: `${minTemp}°C / ${maxTemp}°C`, desc, icon });
      } catch (e) {
        console.warn("Weather fetch failed:", e);
        setWeather({ temp: '15°C / 22°C', desc: '首爾當前天氣', icon: <CloudSun size={20} className="text-[#F9B95C]" /> });
      }
    };
    fetchRealWeather();
  }, [selectedDay, itinerary]);

  // 尋找 handleNaverLink 函數並完整替換
  const handleNaverLink = (itemOrList) => {
    if (!itemOrList) return;

    const getCleanName = (item) => {
      const name = item.koreanName || item.name;
      return name ? name.split('(')[0].trim() : '';
    };

    let targetItem = Array.isArray(itemOrList) ? itemOrList[itemOrList.length - 1] : itemOrList;
    if (!targetItem) return;

    const searchName = getCleanName(targetItem);

    // 修正：使用 Naver Map 官方通用網址 (Universal Link)
    // 這種格式在手機會自動詢問「是否開啟 Naver Map App」，沒裝則開網頁
    const naverUrl = `https://map.naver.com/v5/search/${encodeURIComponent(searchName)}`;

    window.open(naverUrl, '_blank');

    setIsSelectingRoute(false);
    setRouteSelection([]);
  };

  const handleSmartImport = async () => {
    if (!importText || !user) return;
    setIsImporting(true);
    try {
      const prompt = `你是一個專業韓國旅遊助手。精準解析以下文字並拆解成旅遊行程。
      【規則】
      1. 根據文字判斷屬於第幾天 (day: 數字，例如 1, 2)。
      2. name: 景點/餐廳中文名稱。
      3. koreanName: 務必自動翻譯並補充準確的「韓文名稱」。
      4. hours: 預估營業時間 (若無則填「建議自行確認」)。
      5. transport: 建議交通方式 (例如地鐵、步行)。
      6. naverLink: 若內文有提供網址連結請務必抓取，否則留空。
      7. precautions: 該景點的注意事項。
      【必須回傳的純 JSON 格式，絕對不要加上 Markdown 標記 (如 json 區塊)】
      {"itinerary": [{"day": 1, "name": "景點名", "koreanName": "韓文名", "hours": "時間", "transport": "交通", "naverLink": "網址", "precautions": "注意事項"}]}

      待解析文字：\n${importText}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.1 } })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || "API 請求失敗");
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("無效的解析結果");

      const parsed = JSON.parse(cleanJson(text));
      const itemsToAdd = parsed.itinerary || (Array.isArray(parsed) ? parsed : []);

      if (itemsToAdd.length === 0) throw new Error("找不到可建立的行程");

      const batch = writeBatch(db);
      itemsToAdd.forEach((item, index) => {
        const ref = doc(collection(db, 'artifacts', appId, 'public', 'data', 'itinerary'));
        batch.set(ref, {
          name: item.name || "未命名景點",
          koreanName: item.koreanName || "",
          day: Number(item.day) || 1,
          hours: item.hours || "建議自行確認",
          transport: item.transport || "",
          naverLink: item.naverLink || "",
          precautions: item.precautions || "",
          memo: "",
          order: itinerary.length + index,
          createdAt: Date.now()
        });
      });
      await batch.commit();
      setImportText("");
    } catch (err) {
      console.warn("Import failed:", err);
      alert(`智慧解析失敗：${err.message}\n(請確認 API Key 是否設定正確)`);
    }
    finally { setIsImporting(false); }
  };

  const handleAiDetailFetch = async () => {
    if (!detailItem || !detailItem.name) return;
    setIsAiFetchingDetail(true);
    try {
      const prompt = `你是一個韓國旅遊達人。請提供韓國景點「${detailItem.name} (${detailItem.koreanName})」的詳細資訊。
      【回傳規範】
      1. hours: 營業時間。
      2. transport: 建議交通方式。
      3. precautions: 注意事項，必須使用「- 」開頭進行「條列式」呈現，每點獨立一行。
      4. duration: 建議停留時間 (例如：1.5 - 2 小時)。
      回傳純 JSON 格式，絕對不要加 Markdown：
      {"hours": "營業時間", "transport": "建議交通方式", "precautions": "注意事項"}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.2 } })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || "API 請求失敗");
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("無效的解析結果");
      const parsed = JSON.parse(cleanJson(text));

      const updatedItem = {
        ...detailItem,
        hours: parsed.hours || detailItem.hours,
        transport: parsed.transport || detailItem.transport,
        precautions: parsed.precautions || detailItem.precautions,
        duration: parsed.duration || detailItem.duration
      };
      setDetailItem(updatedItem);
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'itinerary', detailItem.id), updatedItem);
    } catch (err) {
      console.warn("Detail fetch failed:", err);
      alert(`AI 查詢失敗：${err.message}`);
    } finally {
      setIsAiFetchingDetail(false);
    }
  };

  const currentDayItems = itinerary.filter(item => Number(item.day) === selectedDay).sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  const handleDragStart = (e, item) => { if (isSelectingRoute) return; setDraggedItem(item); };
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = async (e, targetIndex) => {
    e.preventDefault();
    if (!draggedItem) return;
    const items = [...currentDayItems];
    const draggedIdx = items.findIndex(i => i.id === draggedItem.id);
    if (draggedIdx === targetIndex) return;
    items.splice(draggedIdx, 1);
    items.splice(targetIndex, 0, draggedItem);
    const batch = writeBatch(db);
    items.forEach((item, idx) => { batch.update(doc(db, 'artifacts', appId, 'public', 'data', 'itinerary', item.id), { order: idx }); });
    await batch.commit();
    setDraggedItem(null);
  };

  return (
    <div className="p-4 md:p-0 space-y-6 pb-24">
      {flights.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap">
          {flights.map(f => (
            <div key={f.id} className="min-w-[280px] md:flex-1 md:min-w-[320px] bg-[#6398A9] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#96C7B3] blur-[70px] opacity-30"></div>
              <div className="flex justify-between items-center mb-6 text-xs font-bold opacity-80 relative z-10">
                <div className="flex items-center gap-2 uppercase tracking-widest"><Plane size={16} className="text-[#F9B95C] rotate-45" />{f.airline}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'flights', f.id))} className="p-1 hover:text-[#D7897F] transition-colors"><X size={16} /></button>
                </div>
              </div>
              <div className="flex justify-between items-center px-2 relative z-10 font-bold">
                <div className="text-left"><h4 className="text-3xl font-serif">{f.route?.split('-')[0] || 'DEP'}</h4><p className="text-[11px] text-white/70 uppercase mt-2 tracking-widest">{f.depTime}</p></div>
                <div className="text-[10px] text-[#F9B95C] font-black tracking-widest">{f.flightNum}</div>
                <div className="text-right"><h4 className="text-3xl font-serif">{f.route?.split('-')[1] || 'ARR'}</h4><p className="text-[11px] text-white/70 uppercase mt-2 tracking-widest">{f.arrTime}</p></div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap">
        {[1, 2, 3, 4, 5, 6, 7].map(d => (
          <button key={d} onClick={() => setSelectedDay(d)} className={`min-w-[70px] md:min-w-[80px] py-4 rounded-2xl flex flex-col items-center transition-all border ${selectedDay === d ? 'bg-[#6398A9] text-white shadow-md border-[#6398A9] scale-105' : 'bg-white text-slate-400 hover:bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-90">Day</span>
            <span className="text-2xl font-serif font-bold mt-1 leading-none">{d}</span>
          </button>
        ))}
      </div>

      <div className="md:grid md:grid-cols-2 md:gap-6 space-y-6 md:space-y-0">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-[#F9B95C]/10 text-[#F9B95C] rounded-2xl flex items-center justify-center shadow-inner border border-[#F9B95C]/20">{weather.icon}</div>
              <div>
                <div className="font-bold text-slate-800 text-xl font-serif tracking-wide">{weather.temp}</div>
                <p className="text-xs text-slate-500 font-bold truncate max-w-[120px] mt-1 tracking-wide">{weather.desc}</p>
              </div>
            </div>
            {!isSelectingRoute ? (
              <button onClick={() => setIsSelectingRoute(true)} className="bg-[#D7897F] text-white px-6 py-3.5 rounded-full text-sm font-bold tracking-widest flex items-center gap-2 hover:bg-[#C07970] active:scale-95 transition-all shadow-md">
                <Navigation size={16} /> 快速導航
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => { setIsSelectingRoute(false); setRouteSelection([]); }} className="p-3 bg-slate-100 text-slate-500 hover:text-slate-700 rounded-full shadow-inner transition-colors"><X size={18} /></button>
                <button onClick={() => handleNaverLink(routeSelection)} disabled={routeSelection.length === 0} className="bg-[#D7897F] text-white px-5 py-3 rounded-full text-sm font-bold tracking-widest disabled:opacity-40 shadow-md hover:bg-[#C07970] transition-colors">前往此地</button>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 px-1 tracking-widest"><Import size={18} className="text-[#96C7B3]" /> 智慧匯入</h3>
            <textarea placeholder="貼上去趣內容或飯店連結..." className="w-full p-5 bg-slate-50 rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 ring-[#96C7B3]/30 h-28 resize-none shadow-inner text-slate-700" value={importText} onChange={(e) => setImportText(e.target.value)} />
            <button onClick={handleSmartImport} disabled={isImporting} className="w-full py-4 bg-[#96C7B3] text-white rounded-[1.5rem] font-bold tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-[#7CB49D] active:scale-95 transition-all shadow-md">
              {isImporting ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />} 智慧解析
            </button>
          </div>
        </div>

        <div className="space-y-4 md:bg-slate-50 md:p-6 md:rounded-[3rem] md:border md:border-slate-200 md:h-fit">
          <div className="hidden md:flex justify-between items-center px-2 mb-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Day {selectedDay} 行程總覽</p>
          </div>
          {currentDayItems.map((item, index) => (
            <div key={item.id} draggable={!isSelectingRoute} onDragStart={(e) => handleDragStart(e, item)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, index)} onClick={() => isSelectingRoute ? setRouteSelection([item]) : setDetailItem(item)}
              className={`bg-white p-5 md:p-6 rounded-[2.2rem] flex items-center gap-5 border transition-all cursor-pointer ${isSelectingRoute && routeSelection.find(i => i.id === item.id) ? 'border-[#6398A9] bg-[#6398A9]/5 shadow-md scale-[1.02]' : 'border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md'} ${draggedItem?.id === item.id ? 'opacity-40 scale-95' : ''}`}
            >
              <div className="flex items-center justify-center shrink-0">
                {isSelectingRoute ? (
                  routeSelection.find(i => i.id === item.id) ? (
                    <div className="w-10 h-10 bg-[#6398A9] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md animate-in zoom-in-50"><Navigation size={16} /></div>
                  ) : <Circle className="text-slate-200" size={32} />
                ) : (
                  <div className="text-slate-300 hover:text-slate-400 cursor-grab active:cursor-grabbing transition-colors"><GripVertical size={24} /></div>
                )}
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <h4 className="font-bold text-slate-800 text-base md:text-lg truncate tracking-wide">{item.name}</h4>
                <p className="text-[11px] md:text-xs text-slate-400 font-bold truncate mt-1.5 uppercase tracking-widest">{item.koreanName || "點擊查看詳情"}</p>
              </div>
              {!isSelectingRoute && <ChevronRight size={24} className="text-slate-200 group-hover:text-[#6398A9] transition-colors" />}
            </div>
          ))}
          {currentDayItems.length === 0 && (
            <div className="py-16 text-center text-slate-400 font-bold tracking-widest border-2 border-dashed border-slate-200 rounded-[2.5rem]">
              今天還沒有排行程喔
            </div>
          )}
        </div>
      </div>

      {detailItem && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setDetailItem(null); setIsEditing(false); }}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-10 md:zoom-in-95 overflow-hidden">
            <div className="bg-[#6398A9] p-8 md:p-10 shrink-0 text-white">
              <div className="flex justify-between items-start mb-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-inner">Day {detailItem.day} Spot</div>
                  <button onClick={handleAiDetailFetch} disabled={isAiFetchingDetail} className="bg-[#F9B95C]/20 text-[#F9B95C] px-3 py-1.5 rounded-full text-xs font-bold tracking-widest hover:bg-[#F9B95C]/30 active:scale-95 transition-all shadow-md flex items-center gap-1 disabled:opacity-70">
                    {isAiFetchingDetail ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} />} AI 補充資訊
                  </button>
                </div>
                <button onClick={() => { setDetailItem(null); setIsEditing(false); }} className="bg-white/10 p-2.5 rounded-full hover:bg-white/20 transition-colors"><X size={24} /></button>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-serif tracking-wide mb-3 truncate">{detailItem.name}</h2>
              <p className="text-white/80 font-bold text-sm md:text-base tracking-widest uppercase truncate">{detailItem.koreanName}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-8 pb-24 bg-white text-slate-800">
              <DetailField icon={<LinkIcon className="text-[#6398A9]" />} label="Naver Map 網址" value={detailItem.naverLink} isEditing={isEditing} onChange={(v) => setDetailItem({ ...detailItem, naverLink: v })} placeholder="貼上 Naver 分享連結" />
              <DetailField icon={<Clock className="text-[#F9B95C]" />} label="營業時間" value={detailItem.hours} isEditing={isEditing} onChange={(v) => setDetailItem({ ...detailItem, hours: v })} />
              <DetailField
                icon={<Clock className="text-[#6398A9]" />}
                label="建議停留時間"
                value={detailItem.duration}
                isEditing={isEditing}
                onChange={(v) => setDetailItem({ ...detailItem, duration: v })}
                placeholder="例如：1.5 - 2 小時"
              />
              <DetailField icon={<Bus className="text-[#96C7B3]" />} label="交通方式" value={detailItem.transport} isEditing={isEditing} onChange={(v) => setDetailItem({ ...detailItem, transport: v })} />
              <DetailField icon={<AlertTriangle className="text-[#D7897F]" />} label="注意事項" value={detailItem.precautions} isEditing={isEditing} onChange={(v) => setDetailItem({ ...detailItem, precautions: v })} />
              <DetailField icon={<Edit3 className="text-slate-400" />} label="個人備註" value={detailItem.memo} isEditing={isEditing} onChange={(v) => setDetailItem({ ...detailItem, memo: v })} />
              <div className="grid grid-cols-2 gap-4 md:gap-6 pt-6 pb-10 border-t border-slate-100">
                <button onClick={() => handleNaverLink(detailItem)} className="flex items-center justify-center gap-2 py-4 md:py-5 bg-[#6398A9] text-white rounded-2xl md:rounded-[1.5rem] font-bold tracking-widest text-sm md:text-base shadow-md hover:bg-[#4A7A8A] transition-colors"><Navigation size={20} /> 前往此地</button>
                <button onClick={() => isEditing ? updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'itinerary', detailItem.id), detailItem).then(() => setIsEditing(false)) : setIsEditing(true)} className="flex items-center justify-center gap-2 py-4 md:py-5 bg-[#D7897F]/10 text-[#D7897F] rounded-2xl md:rounded-[1.5rem] font-bold tracking-widest text-sm md:text-base hover:bg-[#D7897F]/20 border border-[#D7897F]/20 transition-colors">{isEditing ? <Save size={20} /> : <Edit3 size={20} />} {isEditing ? "儲存設定" : "編輯資訊"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 尋找 DetailField 組件並完整替換
const DetailField = ({ icon, label, value, isEditing, onChange, placeholder }) => (
  <div className="space-y-3">

    <div className="flex items-center gap-2 text-[14px] font-black text-slate-500 tracking-normal uppercase">
      {icon} {label}
    </div>

    {isEditing ? (
      <textarea
        className="w-full p-5 bg-[#F9F8F4] rounded-2xl text-[16px] font-bold border-none outline-none focus:ring-2 ring-[#6398A9]/30 min-h-[100px] resize-none text-slate-800"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    ) : (

      <p className="text-[16px] text-slate-700 font-bold ml-1 break-all leading-[1.8] whitespace-pre-wrap bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
        {value || "尚未輸入資訊"}
      </p>
    )}
  </div>
);

// --- 分帳模組 ---
const SplitBillSection = ({ user }) => {
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [newMember, setNewMember] = useState("");
  const [isAddMode, setIsAddMode] = useState(false);
  const [isAiMode, setIsAiMode] = useState(false);
  const [isDepositMode, setIsDepositMode] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [currencyMode, setCurrencyMode] = useState('KRW');
  const [newExp, setNewExp] = useState({ title: "", amount: "", payers: {}, sharers: [], category: "food" });
  const [errorMsg, setErrorMsg] = useState("");
  const [depositPerPerson, setDepositPerPerson] = useState("");
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null); // 🚀 新增：控制歷史明細彈窗

  const sortedMembers = [...members].sort((a, b) => {
    if (a.isWallet) return -1;
    if (b.isWallet) return 1;
    return 0;
  });

  const exchangeRate = 41.67;
  const categories = [
    { id: 'food', name: '飲食', icon: <Utensils size={14} /> },
    { id: 'shop', name: '購物', icon: <ShoppingBag size={14} /> },
    { id: 'stay', name: '住宿', icon: <Home size={14} /> },
    { id: 'move', name: '交通', icon: <TrainFront size={14} /> }
  ];
  useEffect(() => {
    if (!user) return;
    const unsubM = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'members'), (s) => {
      const fetchedMembers = s.docs.map(d => ({ id: d.id, ...d.data() }));
      // 核心邏輯：如果成員名單是空的，自動新增公積金錢包
      if (fetchedMembers.length === 0) {
        addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'members'), { name: "💰 公積金錢包", isWallet: true });
      }
      setMembers(fetchedMembers);
    }, (err) => console.warn("Sync error:", err));
    const unsubE = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'expenses'), (s) => setExpenses(s.docs.map(d => ({ id: d.id, ...d.data() }))), (err) => console.warn("Sync error:", err));
    return () => { unsubM(); unsubE(); };
  }, [user]);

  const handleAiParse = async () => {
    if (!aiInput.trim() || isAiLoading) return;
    setIsAiLoading(true);
    setErrorMsg(""); // 每次執行前清空錯誤訊息
    try {
      const memberNames = members.map(m => m.name).join(', ');
      // 強化 AI Prompt：明確教導 AI 處理「誰不參與分攤」的邏輯
      // 🚀 強化 AI Prompt：死守公積金名稱，並學會辨識「存款」
      const prompt = `你是一個專業記帳助手。旅伴有：${memberNames}。請解析文字轉化為 JSON。
      文字：${aiInput}
      【規則】
      1. title: 項目名稱。
      2. amount: 總金額數字。
      3. payers: 誰付了錢及金額的物件 (例如 {"A": 50000})。⚠️ 若提到「公積金、公費、錢包」付錢，請一律使用精確名稱 "💰 公積金錢包"。
      4. sharers: 誰參與了分攤(陣列)。若無特別說明，填入所有旅伴的名字。若有明確說明「誰不參與」，請精準排除。⚠️ 若語意為「大家交錢/存入公費/存公積金」，請強制設為 ["💰 公積金錢包"]。
      5. category: 類別 (food, shop, stay, move)。⚠️ 若語意為「存錢/交公費/存公積金」，請強制設為 "deposit"。
      只回傳純 JSON。`;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.1 } })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || "API 請求失敗");
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("無效的解析結果");
      const parsed = JSON.parse(cleanJson(text));
      // 👇 --- 2. 這裡就是加入了「智慧跳轉判斷」 --- 👇
      setNewExp({ title: parsed.title || "", amount: parsed.amount || "", payers: parsed.payers || {}, sharers: parsed.sharers || members.map(m => m.name), category: parsed.category || "food" });
      setAiInput("");
      setIsAiMode(false);

      if (parsed.category === 'deposit') {
        setIsDepositMode(true);
        setIsAddMode(false);
        // 若 AI 有抓到付款人，自動帶入第一人的金額到快速輸入框
        const firstVal = parsed.payers ? Object.values(parsed.payers)[0] : "";
        setDepositPerPerson(firstVal ? String(firstVal) : "");
      } else {
        setIsAddMode(true);
        setIsDepositMode(false);
      }
      // 👆 --- 智慧跳轉結束 --- 👆

    } catch (err) {
      console.warn("Parse failed:", err);
      setErrorMsg(`AI 解析失敗：${err.message}`);
    }
    finally { setIsAiLoading(false); }
  };
  const addExpense = async () => {
    setErrorMsg(""); // 每次按下前清空錯誤訊息
    const totalP = Object.values(newExp.payers).reduce((s, v) => s + Number(v), 0);
    const totalA = Number(newExp.amount);

    // 強化驗證：包含分攤者的防呆檢查
    if (members.length === 0) { setErrorMsg("請先在上方新增旅伴！"); return; }
    if (!newExp.title) { setErrorMsg("請輸入消費項目名稱！"); return; }
    if (totalA <= 0) { setErrorMsg("請輸入有效的總金額！"); return; }
    if (Object.keys(newExp.payers).length === 0) { setErrorMsg("請在下方填寫是誰墊付了這筆錢！"); return; }
    if (newExp.sharers.length === 0) { setErrorMsg("請至少選擇一位參與分攤的成員！"); return; }
    if (Math.abs(totalP - totalA) > 1) { setErrorMsg(`墊付總和 (${totalP}) 與總額 (${totalA}) 不符！`); return; }

    let fA = totalA; let fP = { ...newExp.payers };
    if (currencyMode === 'TWD') {
      fA = Math.round(totalA * exchangeRate);
      Object.keys(fP).forEach(k => fP[k] = Math.round(Number(fP[k]) * exchangeRate));
    } else {
      Object.keys(fP).forEach(k => fP[k] = Number(fP[k]));
    }
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'expenses'), { ...newExp, amount: fA, payers: fP, sharers: newExp.sharers.length > 0 ? newExp.sharers : members.map(m => m.name), createdAt: Date.now() });

    // 重置時自動將 sharers 設定為全體成員
    setNewExp({ title: "", amount: "", payers: {}, sharers: members.map(m => m.name), category: "food" });
    setErrorMsg("");
    setIsAddMode(false);
    setIsDepositMode(false);
  };

  // 核心升級：公私分離的「雙帳本引擎」
  const { publicBalances, privateBalances, walletCash } = (() => {
    const pub = {}; const priv = {};
    members.forEach(m => { pub[m.name] = 0; priv[m.name] = 0; });
    let cash = 0;

    expenses.forEach(exp => {
      // 判斷是否為公積金交易：錢包有付錢，或錢包是分攤者(收款)
      const isPublic = exp.payers["💰 公積金錢包"] || (exp.sharers && exp.sharers.includes("💰 公積金錢包"));

      if (isPublic) {
        // 1. 實體錢包現金進出
        if (exp.payers["💰 公積金錢包"]) cash -= Number(exp.payers["💰 公積金錢包"]);
        if (exp.sharers && exp.sharers.includes("💰 公積金錢包")) cash += Number(exp.amount) / exp.sharers.length;

        // 2. 計算每個人的「公積金存摺權益」
        Object.entries(exp.payers || {}).forEach(([n, a]) => {
          if (n !== "💰 公積金錢包" && pub[n] !== undefined) pub[n] += Number(a);
        });
        const perShare = Number(exp.amount) / (exp.sharers?.length || members.length);
        (exp.sharers || members.map(m => m.name)).forEach(s => {
          if (s !== "💰 公積金錢包" && pub[s] !== undefined) pub[s] -= perShare;
        });
      } else {
        // 3. 計算純「私人恩怨」
        Object.entries(exp.payers || {}).forEach(([n, a]) => {
          if (priv[n] !== undefined) priv[n] += Number(a);
        });
        const perShare = Number(exp.amount) / (exp.sharers?.length || members.length);
        (exp.sharers || members.map(m => m.name)).forEach(s => {
          if (priv[s] !== undefined) priv[s] -= perShare;
        });
      }
    });
    return { publicBalances: pub, privateBalances: priv, walletCash: Math.round(cash) };
  })();

  // 私人債務結算 (公積金不再參與此處的結算)
  const privateSettlement = (() => {
    let creds = []; let debts = [];
    Object.keys(privateBalances).forEach(n => {
      if (privateBalances[n] > 1) creds.push({ n, a: privateBalances[n] });
      else if (privateBalances[n] < -1) debts.push({ n, a: Math.abs(privateBalances[n]) });
    });
    const s = []; let di = 0, ci = 0;
    while (di < debts.length && ci < creds.length) {
      const p = Math.min(debts[di].a, creds[ci].a);
      if (p > 1) s.push({ f: debts[di].n, t: creds[ci].n, a: Math.round(p) });
      debts[di].a -= p; creds[ci].a -= p;
      if (debts[di].a <= 1) di++; if (creds[ci].a <= 1) ci++;
    }
    return s;
  })();
  return (
    <div className="p-4 md:p-0 animate-in fade-in duration-500 text-slate-800 pb-24">
      <div className="md:grid md:grid-cols-12 md:gap-8 space-y-6 md:space-y-0">

        <div className="md:col-span-7 space-y-6">

          {/* 1. 旅伴名單 (優化：改為橫向滑動，節省高度) */}
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] shadow-sm border border-slate-200">
            <h3 className="font-bold tracking-widest text-sm md:text-base flex items-center gap-2 mb-5 text-[#6398A9]"><Users size={20} /> 旅伴名單</h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-hide mb-4">
              {sortedMembers.map(m => (
                <div key={m.id} className={`px-4 py-2 rounded-full flex items-center gap-2 border font-bold shadow-sm whitespace-nowrap shrink-0 ${m.isWallet ? 'bg-[#6398A9]/10 border-[#6398A9]/20 text-[#6398A9]' : 'bg-[#96C7B3]/10 border-[#96C7B3]/20 text-[#96C7B3]'}`}>
                  <span className="text-xs md:text-sm tracking-wide">{m.name}</span>
                  {/* 關鍵防呆：只有「不是錢包」的真人才可以被刪除 */}
                  {!m.isWallet && (
                    <button onClick={() => deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'members', m.id))} className="text-[#96C7B3]/60 hover:text-[#D7897F] transition-colors"><X size={14} /></button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <input placeholder="新增成員姓名..." className="flex-1 bg-slate-50 border border-slate-100 outline-none p-4 rounded-2xl text-sm font-bold focus:ring-2 ring-[#96C7B3]/30 transition-shadow text-slate-800" value={newMember} onChange={e => setNewMember(e.target.value)} />
              <button onClick={async () => { if (!newMember.trim()) return; await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'members'), { name: newMember.trim() }); setNewMember(""); }} className="bg-[#96C7B3] text-white p-4 rounded-2xl shadow-md hover:bg-[#7CB49D] active:scale-95 transition-all"><UserPlus size={20} /></button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#6398A9] to-[#4A7A8A] p-6 rounded-[2.5rem] shadow-lg text-white mb-2 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10 flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-[13px] font-black text-white/80 uppercase tracking-wider flex items-center gap-2">
                  <Wallet size={16} /> 目前公積金餘額
                </p>
                <h2 className="text-4xl font-serif font-bold">
                  ₩ {walletCash.toLocaleString()}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-white/60 mb-1">約合台幣</p>
                <p className="text-lg font-bold font-serif">$ {Math.round(walletCash / exchangeRate).toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex gap-4">
              <div className="flex-1 bg-white/10 p-3 rounded-2xl text-center border border-white/5">
                <p className="text-[10px] font-bold text-white/50 mb-1 tracking-widest">庫存狀態</p>
                <p className="text-sm font-black">{walletCash > 0 ? "資金充裕" : walletCash === 0 ? "餘額為零" : "預算超支！"}</p>
              </div>
              <div className="flex-1 bg-white/10 p-3 rounded-2xl text-center border border-white/5">
                <p className="text-[10px] font-bold text-white/50 mb-1 tracking-widest">建議操作</p>
                <p className="text-sm font-black text-[#F9B95C]">{walletCash < 10000 ? "建議收錢" : "暫時免繳"}</p>
              </div>
            </div>
          </div>

          {/* 2. 動作按鈕 (一分為三) */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => { setIsAiMode(true); setIsAddMode(false); setIsDepositMode(false); setErrorMsg(""); }}
              className={`py-4 rounded-2xl font-black tracking-widest text-[13px] flex flex-col items-center justify-center gap-1 transition-all border ${isAiMode ? 'bg-[#F9B95C] text-white shadow-md border-[#F9B95C]' : 'bg-white text-slate-500 border-slate-200 hover:border-[#F9B95C]/50'}`}
            >
              <BrainCircuit size={20} /> 智慧快記
            </button>
            <button
              // 點擊消費時，預設分攤者「不包含」公積金錢包
              onClick={() => { setIsAddMode(true); setIsAiMode(false); setIsDepositMode(false); setErrorMsg(""); setNewExp({ ...newExp, sharers: members.filter(m => !m.isWallet).map(m => m.name), category: "food" }); }}
              className={`py-4 rounded-2xl font-black tracking-widest text-[13px] flex flex-col items-center justify-center gap-1 transition-all border ${isAddMode ? 'bg-[#D7897F] text-white shadow-md border-[#D7897F]' : 'bg-white border-slate-200 text-slate-500 hover:border-[#D7897F]/50'}`}
            >
              <Receipt size={20} /> 記一筆消費
            </button>
            <button
              // 關鍵優化：一打開就預設把所有真人加入 payers 名單，金額設為 0
              onClick={() => {
                setIsDepositMode(true); setIsAddMode(false); setIsAiMode(false); setErrorMsg("");
                const defaultPayers = {};
                members.filter(m => !m.isWallet).forEach(m => defaultPayers[m.name] = 0);
                setNewExp({ title: "存入公積金", amount: "", payers: defaultPayers, sharers: ["💰 公積金錢包"], category: "deposit" });
              }}
              className={`py-4 rounded-2xl font-black tracking-widest text-[13px] flex flex-col items-center justify-center gap-1 transition-all border ${isDepositMode ? 'bg-[#96C7B3] text-white shadow-md border-[#96C7B3]' : 'bg-white border-slate-200 text-slate-500 hover:border-[#96C7B3]/50'}`}
            >
              <HandCoins size={20} /> 存入公積金
            </button>
          </div>

          {/* 3. 輸入表單 (優化：緊接在按鈕下方) */}
          {isAiMode && (
            <div className="bg-[#F9B95C]/10 p-6 md:p-8 rounded-[2.5rem] border border-[#F9B95C]/20 space-y-5 animate-in slide-in-from-top-5 shadow-sm">
              <div className="flex justify-between items-center text-[#F9B95C] font-bold tracking-widest text-lg font-serif"><span className="flex items-center gap-2"><Sparkles size={20} className="text-[#F9B95C]" /> 告訴 AI 發生了什麼？</span><button onClick={() => { setIsAiMode(false); setErrorMsg(""); }} className="hover:text-[#F9B95C]/70 transition-colors"><X size={24} /></button></div>
              <textarea placeholder="例如：烤肉 80000 韓元，S 付了 50000，A 付了 30000，平分。" className="w-full p-5 bg-white rounded-2xl text-sm md:text-base font-bold border-none outline-none focus:ring-2 ring-[#F9B95C]/40 h-32 resize-none shadow-sm text-slate-800" value={aiInput} onChange={e => setAiInput(e.target.value)} />
              {errorMsg && <div className="text-[#D7897F] bg-[#D7897F]/10 p-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in"><AlertCircle size={16} />{errorMsg}</div>}
              <button onClick={handleAiParse} disabled={isAiLoading} className="w-full py-5 bg-[#F9B95C] text-white rounded-[1.5rem] font-bold tracking-widest text-base shadow-md hover:bg-[#E5A548] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70">{isAiLoading ? <RefreshCw className="animate-spin" size={20} /> : <Navigation size={20} />} 執行智慧拆帳</button>
            </div>
          )}

          {/* 專屬：存入公積金極速介面 */}
          {isDepositMode && (
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] shadow-lg border border-slate-100 space-y-6 animate-in slide-in-from-bottom-10">
              <div className="flex justify-between items-center font-bold tracking-widest font-serif">
                <h3 className="text-slate-800 text-xl flex items-center gap-2"><HandCoins className="text-[#96C7B3]" /> 存入公積金</h3>
                <button onClick={() => { setIsDepositMode(false); setErrorMsg(""); setDepositPerPerson(""); }} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
              </div>

              <div className="space-y-4 bg-slate-50 p-5 md:p-6 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-[14px] font-black text-[#96C7B3] text-center">每人要交多少錢？</p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <span className="text-3xl font-serif text-[#6398A9]">₩</span>
                  <input
                    type="number" placeholder="0"
                    className="w-1/2 bg-transparent border-b-2 border-[#96C7B3]/30 outline-none text-4xl md:text-5xl font-serif text-center text-slate-800"
                    value={depositPerPerson}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setDepositPerPerson(e.target.value);
                      const activeNames = Object.keys(newExp.payers);
                      const newPayers = {};
                      activeNames.forEach(n => newPayers[n] = val);
                      setNewExp({ ...newExp, amount: String(val * activeNames.length), payers: newPayers });
                    }}
                  />
                </div>
                <p className="text-center text-xs font-bold text-slate-400">系統自動加總：將存入 <span className="text-[#F9B95C] text-sm">₩ {newExp.amount || 0}</span></p>
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-100">
                <p className="text-[14px] font-black text-slate-600 ml-1">誰有交錢？ <span className="text-xs text-slate-400">(預設全選，點擊可取消)</span></p>
                <div className="flex flex-wrap gap-2">
                  {sortedMembers.filter(m => !m.isWallet).map(m => {
                    const isChecked = newExp.payers[m.name] !== undefined;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          const newPayers = { ...newExp.payers };
                          if (isChecked) delete newPayers[m.name];
                          else newPayers[m.name] = Number(depositPerPerson) || 0;
                          setNewExp({ ...newExp, amount: String((Number(depositPerPerson) || 0) * Object.keys(newPayers).length), payers: newPayers });
                        }}
                        className={`px-4 py-2 rounded-xl text-[14px] font-black transition-all border flex items-center gap-2 ${isChecked ? 'bg-[#96C7B3] text-white border-[#96C7B3] shadow-sm' : 'bg-slate-50 text-slate-400 border-slate-200'
                          }`}
                      >
                        {isChecked ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                        {m.name}
                      </button>
                    )
                  })}
                </div>
              </div>
              {errorMsg && <div className="text-[#D7897F] bg-[#D7897F]/10 p-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in"><AlertCircle size={16} />{errorMsg}</div>}
              <button
                onClick={() => {
                  if (Object.keys(newExp.payers).length === 0) { setErrorMsg("至少要有一人交錢！"); return; }
                  addExpense();
                  setDepositPerPerson("");
                }}
                className="w-full py-5 bg-[#96C7B3] text-white rounded-[1.5rem] text-lg font-black tracking-widest shadow-md active:scale-95 hover:bg-[#7CB49D] transition-all mt-4"
              >確認存入</button>
            </div>
          )}

          {isAddMode && (
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] shadow-lg border border-slate-100 space-y-6 animate-in slide-in-from-bottom-10 font-bold">
              <div className="flex justify-between items-center font-bold tracking-widest font-serif"><h3 className="text-slate-800 text-xl">新增開銷明細</h3><button onClick={() => { setIsAddMode(false); setErrorMsg(""); }} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button></div>
              <div className="grid grid-cols-4 gap-3">
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setNewExp({ ...newExp, category: c.id })}
                    className={`py-4 rounded-2xl flex flex-col items-center gap-2 transition-all border ${newExp.category === c.id
                      ? 'bg-[#D7897F] border-[#D7897F] text-white shadow-md scale-105'
                      : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
                      }`}
                  >
                    {/* 圖示稍微加大 */}
                    <div className="scale-125 mb-1">{c.icon}</div>
                    {/* 文字：從 10px 提升到 13px，改用 font-black */}
                    <span className="text-[13px] font-black tracking-normal">{c.name}</span>
                  </button>
                ))}
              </div>
              <div className="space-y-5 bg-slate-50 p-5 md:p-6 rounded-3xl border border-slate-100 shadow-sm">
                <input placeholder="消費項目名稱..." className="w-full bg-transparent border-none outline-none text-base md:text-lg font-bold text-slate-800 placeholder:text-slate-300" value={newExp.title} onChange={e => setNewExp({ ...newExp, title: e.target.value })} />
                <div className="flex gap-2 p-1.5 bg-slate-200/60 rounded-xl">
                  <button onClick={() => setCurrencyMode('KRW')} className={`flex-1 py-2.5 rounded-lg text-xs font-bold tracking-widest transition-all ${currencyMode === 'KRW' ? 'bg-white text-[#D7897F] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>韓元 ₩</button>
                  <button onClick={() => setCurrencyMode('TWD')} className={`flex-1 py-2.5 rounded-lg text-xs font-bold tracking-widest transition-all ${currencyMode === 'TWD' ? 'bg-white text-[#D7897F] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>台幣 $</button>
                </div>
                <div className="flex items-center gap-3 pt-2"><span className="text-3xl font-serif text-[#6398A9]"> {currencyMode === 'KRW' ? '₩' : '$'}</span><input type="number" placeholder="0" className="w-full bg-transparent border-none outline-none text-4xl md:text-5xl font-serif placeholder:text-slate-200 text-slate-800" value={newExp.amount} onChange={e => setNewExp({ ...newExp, amount: e.target.value })} /></div>
              </div>


              {/* 一般消費：誰需要分攤？ */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center ml-1">
                  <p className="text-[14px] font-black text-slate-600">誰需要分攤？</p>
                  <span className="text-[12px] font-bold text-[#96C7B3] bg-[#96C7B3]/10 px-2 py-1 rounded-md">{newExp.sharers.length} 人</span>
                </div>

                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => setNewExp({ ...newExp, sharers: members.filter(m => !m.isWallet).map(m => m.name) })}
                    className="flex-1 py-2 bg-slate-100 text-slate-500 rounded-xl text-[12px] font-black hover:bg-slate-200 transition-colors"
                  >
                    🍽️ 所有人參與
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {/* 🚨 關鍵防呆：過濾掉錢包，不讓錢包出現在分攤名單裡 */}
                  {sortedMembers.filter(m => !m.isWallet).map(m => {
                    const isSelected = newExp.sharers.includes(m.name);
                    return (
                      <button
                        key={`share-${m.id}`}
                        onClick={() => {
                          const current = [...newExp.sharers];
                          if (isSelected) setNewExp({ ...newExp, sharers: current.filter(x => x !== m.name) });
                          else setNewExp({ ...newExp, sharers: [...current, m.name] });
                        }}
                        className={`px-4 py-2 rounded-xl text-[14px] font-black transition-all border ${isSelected ? 'bg-[#96C7B3] text-white border-[#96C7B3]' : 'bg-slate-50 text-slate-400 border-slate-200'
                          }`}
                      >
                        {m.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 🚀 一般消費：誰墊付了錢？ (加入神級動態防呆) */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center ml-1">
                  <p className="text-[14px] font-black text-slate-600">誰墊付了錢？</p>
                  {/* 動態餘額計算提示器 */}
                  {(() => {
                    const totalA = Number(newExp.amount) || 0;
                    const currentP = Object.values(newExp.payers).reduce((s, v) => s + Number(v), 0);
                    const diff = totalA - currentP;
                    if (totalA === 0) return null;
                    if (diff === 0) return <span className="text-[11px] font-bold text-[#96C7B3] bg-[#96C7B3]/10 px-2 py-1 rounded-md">✅ 已完全分配</span>;
                    if (diff > 0) return <span className="text-[11px] font-bold text-[#F9B95C] bg-[#F9B95C]/10 px-2 py-1 rounded-md">⚠️ 尚差 ₩ {diff.toLocaleString()}</span>;
                    return <span className="text-[11px] font-bold text-[#D7897F] bg-[#D7897F]/10 px-2 py-1 rounded-md">🛑 溢出 ₩ {Math.abs(diff).toLocaleString()}</span>;
                  })()}
                </div>
                {sortedMembers.map(m => (
                  <div key={m.id} className={`flex items-center justify-between p-2 rounded-2xl mb-1 ${m.isWallet ? 'bg-[#6398A9]/10 border border-[#6398A9]/20' : ''}`}>
                    <span className={`text-[15px] font-black ${m.isWallet ? 'text-[#6398A9]' : 'text-slate-600'}`}>{m.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (!newExp.amount) { setErrorMsg("請先輸入總金額！"); return; }
                          setErrorMsg("");
                          setNewExp({ ...newExp, payers: { [m.name]: newExp.amount } }); // 改為單壓：一鍵設定為全額支付
                        }}
                        className={`text-[12px] font-black px-3 py-2 rounded-lg active:scale-95 transition-all whitespace-nowrap ${m.isWallet ? 'bg-[#6398A9] text-white shadow-sm' : 'bg-[#D7897F]/10 text-[#D7897F]'
                          }`}
                      >
                        {m.isWallet ? '錢包全付' : '全額'}
                      </button>
                      <input
                        type="number" placeholder="0"
                        className="w-24 md:w-28 p-3 bg-white rounded-xl text-[14px] font-bold outline-none border border-slate-200 focus:border-[#D7897F] text-right shadow-sm"
                        value={newExp.payers[m.name] || ""}
                        onChange={e => { const val = e.target.value; const n = { ...newExp.payers }; if (!val || Number(val) === 0) delete n[m.name]; else n[m.name] = val; setNewExp({ ...newExp, payers: n }); }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {errorMsg && <div className="text-[#D7897F] bg-[#D7897F]/10 p-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in"><AlertCircle size={16} />{errorMsg}</div>}
              <button onClick={addExpense} className="w-full py-5 bg-[#D7897F] text-white rounded-[1.5rem] text-lg font-bold tracking-widest shadow-md active:scale-95 hover:bg-[#C07970] transition-all mt-4">確認入帳</button>
            </div>
          )}


          {/*  4. 終極結算卡片 (公家退補款 vs 私人恩怨) */}
          <div className="bg-white rounded-[3rem] md:rounded-[3.5rem] p-8 md:p-10 shadow-lg relative overflow-hidden border border-slate-200 space-y-10">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#6398A9] blur-[100px] opacity-10"></div>

            {/* 區塊 A：公積金實體對帳 */}
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#6398A9]/10 rounded-full flex items-center justify-center text-[#6398A9]"><Wallet size={20} /></div>
                <div>
                  <p className="text-[15px] font-black text-slate-800">第一步：公積金退補款</p>
                  <p className="text-[11px] font-bold text-slate-400 mt-1">依據實體錢包內剩餘的 ₩ {walletCash.toLocaleString()} 發放</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.keys(publicBalances).filter(n => n !== "💰 公積金錢包").map(name => {
                  const bal = Math.round(publicBalances[name]);
                  if (bal === 0) return null;
                  return (
                    <div key={`pub-${name}`} className={`p-4 rounded-2xl border transition-all bg-white ${bal >= 0 ? 'border-[#6398A9]/30 shadow-sm' : 'border-[#D7897F]/30 shadow-sm'}`}>
                      <p className={`text-[11px] font-bold uppercase tracking-wider ${bal >= 0 ? 'text-[#6398A9]' : 'text-[#D7897F]'}`}>{name}</p>
                      <p className="text-[13px] font-black text-slate-600 mt-2 leading-snug">
                        {bal >= 0 ? `👉 可拿回 ₩ ${bal.toLocaleString()}` : `👉 需補繳 ₩ ${Math.abs(bal).toLocaleString()}`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 區塊 B：私人代墊結算 */}
            <div className="relative z-10 space-y-6 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#F9B95C]/10 rounded-full flex items-center justify-center text-[#F9B95C]"><Users size={20} /></div>
                <div>
                  <p className="text-[15px] font-black text-slate-800">第二步：私人代墊轉帳</p>
                  <p className="text-[11px] font-bold text-slate-400 mt-1">未動用公積金的私人欠款</p>
                </div>
              </div>

              {privateSettlement.length > 0 ? (
                <div className="space-y-3 bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner font-bold">
                  {privateSettlement.map((s, i) => (
                    <div key={`priv-${i}`} className="flex items-center gap-3 md:gap-4 text-[13px] md:text-[15px] font-bold tracking-wide">
                      <span className="bg-[#D7897F] text-white px-3 py-1.5 rounded-xl shadow-sm">{s.f}</span>
                      <ArrowRight size={16} className="text-slate-300" />
                      <span className="bg-[#F9B95C] text-white px-3 py-1.5 rounded-xl shadow-sm">{s.t}</span>
                      <span className="ml-auto text-slate-700 font-serif text-lg md:text-xl">₩ {s.a.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : <div className="py-8 text-center text-slate-400 font-bold tracking-widest border-2 border-dashed border-slate-200 rounded-3xl">私人帳務已平衡，無需轉帳</div>}
            </div>
          </div>
        </div>

        {/* 右欄：支出歷史清單 */}
        <div className="md:col-span-5 space-y-4 md:bg-slate-50 md:p-6 md:rounded-[3rem] md:border md:border-slate-200 md:h-fit">
          <div className="flex justify-between items-center px-2 mb-2">
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">歷史支出明細</p>
          </div>
          {expenses.sort((a, b) => b.createdAt - a.createdAt).map(e => (
            <div key={e.id} onClick={() => setSelectedHistoryItem(e)} className="bg-white p-5 rounded-[2.2rem] flex items-center justify-between shadow-sm border border-slate-100 hover:shadow-md transition-all group cursor-pointer active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 shrink-0 bg-[#6398A9]/10 border border-[#6398A9]/20 rounded-2xl flex items-center justify-center text-[#6398A9] shadow-inner group-hover:bg-[#6398A9]/20 transition-colors">
                  {categories.find(c => c.id === e.category)?.icon || <Wallet size={18} />}
                </div>
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-sm md:text-[15px] text-slate-800 truncate tracking-wide">{e.title}</p>
                  <p className="text-[9px] md:text-[10px] font-bold mt-1 uppercase tracking-widest truncate">
                    {/* 智慧明細判斷：公家進出 vs 私人消費 */}
                    {e.category === 'deposit' ? (
                      <span className="text-[#96C7B3]">➕ 存入公積金 (共 {Object.keys(e.payers || {}).length} 人繳交)</span>
                    ) : e.payers && e.payers["💰 公積金錢包"] ? (
                      <span className="text-[#6398A9]">➖ 公積金支付 · {e.sharers?.length || members.length}人分享</span>
                    ) : (
                      <span className="text-slate-400">{Object.keys(e.payers || {}).join(', ')} 墊付 · {e.sharers?.length || members.length}人分</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="text-right flex items-center gap-2 shrink-0">
                <div className="flex flex-col items-end justify-center">
                  <p className="font-serif text-base md:text-lg tracking-tight text-slate-800">₩ {Math.round(e.amount).toLocaleString()}</p>
                </div>
                <button onClick={(e_evt) => { e_evt.stopPropagation(); deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'expenses', e.id)); }} className="text-slate-200 hover:text-[#D7897F] transition-colors p-2 md:opacity-0 md:group-hover:opacity-100"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
          {expenses.length === 0 && (
            <div className="py-16 text-center text-slate-400 font-bold tracking-widest border-2 border-dashed border-slate-200 rounded-[2.5rem]">
              還沒有任何記帳紀錄喔
            </div>
          )}
        </div>
        {/* 🚀 歷史明細詳細彈窗 (解決金魚腦問題) */}
        {selectedHistoryItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedHistoryItem(null)}></div>
            <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-8 space-y-6 animate-in zoom-in-95 border border-slate-200">
              <div className="flex justify-between items-center">
                <h3 className="font-bold font-serif text-xl text-slate-800 truncate pr-4">{selectedHistoryItem.title}</h3>
                <button onClick={() => setSelectedHistoryItem(null)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
              </div>

              <div className="text-center bg-slate-50 py-8 rounded-3xl border border-slate-100 shadow-inner">
                <p className="text-[11px] font-bold text-slate-400 mb-1 tracking-widest uppercase">總金額</p>
                <p className="text-4xl font-serif font-bold text-[#6398A9]">₩ {Number(selectedHistoryItem.amount).toLocaleString()}</p>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-[12px] font-black text-slate-400 mb-3 flex items-center gap-2"><Wallet size={14} /> 出錢的人 (墊付)</p>
                  {Object.entries(selectedHistoryItem.payers || {}).map(([n, a]) => (
                    <div key={n} className="flex justify-between items-center text-[14px] font-bold text-slate-700 mb-2 bg-slate-50 px-3 py-2 rounded-xl">
                      <span className={n === '💰 公積金錢包' ? 'text-[#6398A9]' : ''}>{n}</span>
                      <span className="font-serif">₩ {Number(a).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-5 border-t border-slate-100">
                  <p className="text-[12px] font-black text-slate-400 mb-3 flex items-center gap-2"><Users size={14} /> 參與的人 (分攤)</p>
                  <div className="flex flex-wrap gap-2">
                    {(selectedHistoryItem.sharers || []).map(s => (
                      <span key={s} className={`px-3 py-1.5 rounded-lg text-[13px] font-black shadow-sm ${s === '💰 公積金錢包' ? 'bg-[#96C7B3]/10 text-[#96C7B3] border border-[#96C7B3]/20' : 'bg-slate-100 text-slate-600'}`}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* --- 這裡接原本的最後兩個 </div> --- */}
      </div>
    </div>
  );
};

// --- 智慧匯率模組 ---
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
      if (data && data.rates && data.rates.KRW) {
        setRate(data.rates.KRW);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) { console.warn("Rate fetch failed:", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRate(); }, []);

  const handleKrwChange = (val) => {
    setKrw(val); if (!val) { setTwd(""); return; }
    setTwd((Number(val) / rate).toFixed(1));
  };

  const handleTwdChange = (val) => {
    setTwd(val); if (!val) { setKrw(""); return; }
    setKrw(Math.round(Number(val) * rate).toString());
  };

  const clearAll = () => { setTwd(""); setKrw(""); };

  const quickPickKRW = [1000, 5000, 10000, 30000, 50000, 100000];

  return (
    <div className="p-4 md:p-0 space-y-8 animate-in fade-in duration-500 text-slate-800 pb-20">

      {/* 匯率資訊卡片 */}
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[3.5rem] shadow-sm border border-slate-200 relative overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 text-[#D7897F] font-bold bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
            <TrendingUp size={16} className="text-[#D7897F]" />
            <span className="text-xs md:text-sm tracking-widest font-serif">1 TWD ≈ {rate.toFixed(2)} KRW</span>
          </div>
          <button onClick={fetchRate} className={`p-3 bg-[#D7897F]/10 text-[#D7897F] rounded-full hover:bg-[#D7897F]/20 transition-colors shadow-sm border border-[#D7897F]/20 ${loading ? 'animate-spin' : ''}`}><RefreshCw size={20} /></button>
        </div>

        {/* 輸入區域 RWD 配置 */}
        <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6 md:gap-8 w-full">

          <div className="flex-1 w-full space-y-8 md:space-y-0 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-6 md:items-center">

            {/* 韓元 KRW */}
            <div className="space-y-2 bg-slate-50 p-6 rounded-[2rem] border border-slate-200 w-full h-full flex flex-col justify-center shadow-inner hover:border-[#6398A9]/50 transition-colors">
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">韓元 KRW</p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl md:text-5xl font-serif text-[#6398A9]">₩</span>
                <input type="number" placeholder="0" className="w-full text-5xl md:text-6xl font-serif outline-none bg-transparent placeholder:text-slate-200 text-slate-800" value={krw} onChange={(e) => handleKrwChange(e.target.value)} />
              </div>
            </div>

            {/* 切換圖示/分隔線 */}
            <div className="flex justify-center w-full md:w-auto">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 shadow-sm border border-slate-200">
                <ArrowDownUp size={24} className="md:-rotate-90" />
              </div>
            </div>

            {/* 台幣 TWD */}
            <div className="space-y-2 bg-slate-50 p-6 rounded-[2rem] border border-slate-200 w-full h-full flex flex-col justify-center shadow-inner hover:border-[#6398A9]/50 transition-colors">
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">台幣 TWD</p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl md:text-5xl font-serif text-[#6398A9]">$</span>
                <input type="number" placeholder="0" className="w-full text-5xl md:text-6xl font-serif outline-none bg-transparent placeholder:text-slate-200 text-slate-800" value={twd} onChange={(e) => handleTwdChange(e.target.value)} />
              </div>
            </div>
          </div>

          {/* 巨型歸零按鈕 */}
          <button onClick={clearAll} className="w-full md:w-28 py-6 md:py-0 self-stretch bg-[#F9B95C] text-white rounded-[2.5rem] flex flex-row md:flex-col items-center justify-center gap-3 hover:bg-[#E5A548] active:scale-95 transition-all shadow-md">
            {/* ICON 從 28 放大到 32 */}
            <Eraser size={32} />
            {/* 文字從 text-sm 提升到 15px 並加粗，移除字間距 */}
            <span className="text-[15px] font-black tracking-normal md:[writing-mode:vertical-lr]">歸零</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
          <span className="text-[10px] font-bold text-slate-400 tracking-widest">最後更新時間: {lastUpdated}</span>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
          <Coins size={16} className="text-[#F9B95C]" /> 韓國快速比價對照
        </p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          {quickPickKRW.map(val => (
            <button key={val} onClick={() => handleKrwChange(val.toString())} className="bg-white p-5 rounded-2xl md:rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-1.5 hover:border-[#D7897F]/30 hover:shadow-md active:scale-95 transition-all group">
              <span className="text-sm md:text-base font-bold text-slate-800 group-hover:text-[#D7897F] transition-colors tracking-wide">₩ {val.toLocaleString()}</span>
              <span className="text-[10px] md:text-xs font-bold text-slate-400 tracking-widest">≈ $ {Math.round(val / rate)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;

