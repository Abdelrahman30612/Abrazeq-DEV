import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GOOGLE_SHEET_SKILLS_URL } from '../constants';
import { Code, Layout, Smartphone, Database, Globe, Cpu, Terminal, Loader2, AlertCircle } from 'lucide-react';
import type { Skill } from '../types';

// خريطة لربط أسماء الأيقونات من الشيت بالأيقونات الفعلية
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  'Code': Code,
  'Layout': Layout,
  'Smartphone': Smartphone,
  'Database': Database,
  'Globe': Globe,
  'Cpu': Cpu,
  'Terminal': Terminal,
};

const Skills: React.FC = () => {
  const [skillsData, setSkillsData] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // دالة بسيطة لتحليل CSV للمهارات
  const parseSkillsCSV = (text: string): Skill[] => {
    const rows = text.split('\n').slice(1); // تجاهل العنوان
    return rows.map(row => {
      // التعامل مع الفواصل داخل علامات التنصيص إذا وجدت، أو التقسيم العادي
      const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      if (cols.length < 2) return null;

      const name = cols[0]?.replace(/^"|"$/g, '').trim();
      // تحويل النسبة لرقم، وإذا لم يكن رقماً صحيحاً يتم تجاهل الصف لاحقاً أو وضع 0
      const levelStr = cols[1]?.replace(/^"|"$/g, '').trim();
      const level = parseInt(levelStr) || 0;
      
      const iconName = cols[2]?.replace(/^"|"$/g, '').trim();

      // اختيار الأيقونة المناسبة أو افتراضية
      const IconComponent = ICON_MAP[iconName || 'Code'] || Code;

      if (!name) return null;

      return {
        name: name,
        level: level,
        icon: IconComponent
      };
    }).filter((s): s is Skill => s !== null && s.name !== "");
  };

  useEffect(() => {
    const fetchSkills = async () => {
      if (!GOOGLE_SHEET_SKILLS_URL || GOOGLE_SHEET_SKILLS_URL === "") {
        setLoading(false);
        setError("لم يتم إعداد رابط المهارات.");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(GOOGLE_SHEET_SKILLS_URL);
        if (!response.ok) {
           throw new Error('فشل الاتصال بـ Google Sheets');
        }
        
        const text = await response.text();
        if (text.trim().startsWith('<!DOCTYPE html>') || text.includes('<html')) {
             throw new Error('الرابط لا يعيد ملف CSV صالح.');
        }

        const parsed = parseSkillsCSV(text);
        setSkillsData(parsed);
        if (parsed.length === 0) {
            setError("الشيت فارغ أو لا يحتوي على بيانات صالحة.");
        }
      } catch (err) {
        console.error("Failed to fetch skills:", err);
        setError("حدث خطأ أثناء تحميل المهارات.");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return (
    <section id="skills" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">المهارات <span className="text-purple-500">والتقنيات</span></h2>
          <div className="h-1 w-20 bg-purple-500 mx-auto rounded-full shadow-[0_0_10px_#a855f7]" />
        </motion.div>

        {loading ? (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
            </div>
        ) : error ? (
            <div className="flex flex-col justify-center items-center h-32 text-red-400 gap-2 text-center">
                <AlertCircle className="w-8 h-8 mb-2" />
                <p>{error}</p>
            </div>
        ) : skillsData.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
                <p>لا توجد مهارات مضافة حالياً.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillsData.map((skill, index) => (
                <motion.div
                key={`${skill.name}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 0 25px rgba(168, 85, 247, 0.3)' }}
                className="bg-zinc-900/50 backdrop-blur-md border border-purple-900/50 p-6 rounded-2xl hover:border-purple-500 transition-colors group"
                >
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-purple-900/30 rounded-lg group-hover:bg-purple-600 transition-colors text-purple-300 group-hover:text-white">
                    {/* التأكد من أن الأيقونة صالحة كعنصر React */}
                    {React.createElement(skill.icon, { size: 28 })}
                    </div>
                    <h3 className="text-xl font-bold text-white">{skill.name}</h3>
                </div>
                
                <div className="w-full bg-gray-800 rounded-full h-2.5 mb-2 overflow-hidden">
                    <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="bg-gradient-to-r from-purple-700 to-purple-400 h-2.5 rounded-full"
                    />
                </div>
                <div className="text-right text-sm text-gray-400">{skill.level}%</div>
                </motion.div>
            ))}
            </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
