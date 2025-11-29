import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Loader2, Sparkles, Trash2, AlertCircle } from 'lucide-react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ABOUT_ME, PROJECTS, SKILLS } from '../constants';

interface AbrazeqGPTProps {
  onClose: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AbrazeqGPT: React.FC<AbrazeqGPTProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `أهلاً بك! أنا المساعد الذكي الخاص بـ ${ABOUT_ME.name}. أنا هنا لمساعدتك في التعرف على خدماتنا، مشاريعنا، أو الإجابة على أي استفسار تقني.` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // إعداد سياق الموقع للذكاء الاصطناعي
  const generateSystemInstruction = () => {
    const skillsText = SKILLS.map(s => `- ${s.name} (مستوى الخبرة: ${s.level}%)`).join('\n');
    
    const projectsText = PROJECTS.map(p => 
      `- اسم المشروع: ${p.title}\n  الوصف: ${p.description}\n  التقنيات: ${p.tags.join(', ')}`
    ).join('\n\n');

    return `
      أنت "Abrazeq GPT"، المساعد الشخصي الذكي والودود للمطور "${ABOUT_ME.name}" (${ABOUT_ME.title}) في موقعه الشخصي "Abrazeq.DEV".
      
      هدفك هو:
      1. الرد على استفسارات العملاء والزوار بخصوص خدمات المطور وأعماله.
      2. شرح تفاصيل المشاريع والمهارات الموجودة في الموقع بدقة.
      3. تشجيع العملاء المحتملين على التواصل للعمل (Freelance) بأسلوب احترافي.
      4. المساعدة في الأسئلة التقنية البسيطة المتعلقة بمجال الويب.

      معلومات عن المطور (Context):
      - الاسم: ${ABOUT_ME.name}
      - الوصف: ${ABOUT_ME.description}
      
      معلومات التواصل:
      - البريد الإلكتروني: bbm771729@gmail.com
      - واتساب: 01025565796
      - الموقع: القاهرة، مصر

      المهارات التقنية:
      ${skillsText}

      أبرز المشاريع (Portfolio):
      ${projectsText}

      تعليمات الأسلوب:
      - تحدث باللغة العربية بطلاقة، وبنبرة ودودة وواثقة.
      - إذا سألك أحد عن مشروع معين، استخدم المعلومات المذكورة أعلاه.
      - إذا سألك أحد عن كيفية التواصل، قدم له بيانات التواصل بوضوح.
      - كن موجزاً ومفيداً.
    `;
  };

  // Initialize Chat Session
  useEffect(() => {
    const initAI = async () => {
        try {
            if (!process.env.API_KEY) {
                console.warn("API Key is missing. Make sure to set process.env.API_KEY in your hosting environment.");
                setConnectionError("مفتاح الربط (API Key) غير متوفر. يرجى التحقق من إعدادات الاستضافة.");
                return;
            }

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const chat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                systemInstruction: generateSystemInstruction(),
                },
            });
            setChatSession(chat);
            setConnectionError(null);
        } catch (error) {
            console.error("Error initializing AI:", error);
            setConnectionError("فشل تهيئة الاتصال بالخادم.");
        }
    };
    initAI();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    if (!chatSession) {
        // بدلاً من التوقف بصمت، نعرض رسالة خطأ للمستخدم
        const errorMessage = connectionError 
            ? `عذراً، هناك مشكلة في الاتصال: ${connectionError}`
            : "جاري تهيئة النظام... يرجى الانتظار والمحاولة مرة أخرى.";
            
        setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
        setLoading(false);
        return;
    }

    try {
      const result: GenerateContentResponse = await chatSession.sendMessage({ message: userMessage });
      const responseText = result.text;
      
      setMessages(prev => [...prev, { role: 'model', text: responseText || "عذراً، لم أستطع معالجة طلبك." }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "حدث خطأ أثناء الاتصال بالخادم، يرجى المحاولة لاحقاً." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'model', text: 'تم بدء محادثة جديدة. كيف يمكنني مساعدتك بخصوص الموقع؟' }]);
    
    // محاولة إعادة التهيئة عند المسح في حال كان هناك خطأ سابق
    if (process.env.API_KEY && !chatSession) {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const chat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: { systemInstruction: generateSystemInstruction() },
            });
            setChatSession(chat);
            setConnectionError(null);
        } catch(e) { console.error(e); }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
    >
      <div className="w-full max-w-4xl h-[85vh] bg-[#0a0a0a] border border-purple-500/30 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.2)] flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="h-16 border-b border-purple-900/50 bg-zinc-900/50 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg tracking-wide">Abrazeq GPT</h2>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full animate-pulse ${connectionError ? 'bg-red-500' : 'bg-green-500'}`} />
                <span className="text-xs text-gray-400">{connectionError ? 'غير متصل' : 'متصل (مساعد الموقع)'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
                onClick={clearChat}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-full hover:bg-white/5"
                title="مسح المحادثة"
            >
                <Trash2 size={20} />
            </button>
            <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
            >
                <X size={24} />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-zinc-800 text-gray-300' : 'bg-purple-900/50 text-purple-300 border border-purple-500/30'
              }`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm md:text-base leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-zinc-800 text-white rounded-tr-sm' 
                  : 'bg-purple-900/10 border border-purple-500/20 text-gray-200 rounded-tl-sm'
              }`}>
                {msg.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                        {line}
                        <br />
                    </React.Fragment>
                ))}
              </div>
            </motion.div>
          ))}
          
          {loading && (
            <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-purple-900/50 text-purple-300 border border-purple-500/30 flex items-center justify-center">
                 <Bot size={20} />
               </div>
               <div className="bg-purple-900/10 border border-purple-500/20 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                 <span className="text-gray-400 text-sm">جاري الكتابة...</span>
                 <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-zinc-900/50 border-t border-purple-900/50">
          <div className="relative flex items-center max-w-4xl mx-auto">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اسألني عن المهارات، المشاريع، أو التواصل..."
              disabled={loading}
              className="w-full bg-black/50 border border-zinc-700 text-white rounded-xl py-4 pr-4 pl-14 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="absolute left-2 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
          <div className="text-center mt-2 flex items-center justify-center gap-2">
            <p className="text-[10px] text-zinc-600">يعمل بواسطة Gemini 2.5 Flash API</p>
            {connectionError && (
              <span title={connectionError} className="cursor-help">
                <AlertCircle size={10} className="text-red-500" />
              </span>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default AbrazeqGPT;
