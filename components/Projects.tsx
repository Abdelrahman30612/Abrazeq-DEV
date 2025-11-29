import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GOOGLE_SHEET_URL } from '../constants';
import type { Project } from '../types';
import { ExternalLink, Loader2, AlertCircle } from 'lucide-react';

// مكون فرعي لبطاقة المشروع لادارة حالة "عرض المزيد" لكل بطاقة بشكل منفصل
const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // نحدد هل النص طويل بما يكفي لإظهار الزر أم لا (مثلاً أكثر من 120 حرف)
  const isLongText = project.description.length > 120;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-zinc-900/80 border border-purple-900/30 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-purple-900/20 group-hover:bg-transparent transition-all z-10" />
        <img 
          src={project.image} 
          alt={project.title} 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Error+Loading';
          }}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{project.title}</h3>
        
        {/* Description Section with Show More */}
        <div className="flex-grow mb-4">
          <p 
            className={`text-gray-400 text-sm leading-relaxed transition-all duration-300 ${isExpanded ? '' : 'line-clamp-3'}`}
            title={!isExpanded ? project.description : ''}
          >
            {project.description}
          </p>
          {isLongText && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsExpanded(!isExpanded);
              }}
              className="text-purple-400 text-xs hover:text-purple-300 font-medium mt-2 focus:outline-none flex items-center gap-1 transition-colors"
            >
              {isExpanded ? 'عرض أقل' : 'عرض المزيد...'}
            </button>
          )}
        </div>
        
        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 mt-auto">
            {project.tags.map((tag, idx) => (
              <span key={`${project.id}-tag-${idx}`} className="text-xs px-2 py-1 bg-purple-900/30 text-purple-300 border border-purple-700/30 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full justify-center">
            <ExternalLink size={16} />
            معاينة المشروع
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // دالة متقدمة لتحليل ملف CSV والتعامل مع النصوص والفواصل والأسطر الجديدة بشكل صحيح
  const parseCSV = (csvText: string): Project[] => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = '';
    let insideQuote = false;
    
    // توحيد صيغة الأسطر الجديدة
    const text = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (insideQuote && nextChar === '"') {
          currentCell += '"';
          i++; // تخطي علامة التنصيص المزدوجة (escaped quote)
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === ',' && !insideQuote) {
        currentRow.push(currentCell);
        currentCell = '';
      } else if (char === '\n' && !insideQuote) {
        currentRow.push(currentCell);
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    // إضافة آخر صف إذا وجد
    if (currentRow.length > 0 || currentCell) {
        currentRow.push(currentCell);
        rows.push(currentRow);
    }

    // معالجة الصفوف وتحويلها إلى كائنات Project
    return rows.slice(1) // تجاهل صف العناوين (Header)
      .map((row, index) => {
        // دالة تنظيف النص من علامات التنصيص الزائدة
        const getCell = (idx: number) => {
            const val = row[idx];
            return val ? val.trim().replace(/^"|"$/g, '').trim() : '';
        };

        const title = getCell(1);
        
        // إذا لم يوجد عنوان، نعتبر الصف غير صالح أو فارغ ونتجاهله
        if (!title) return null;

        const idStr = getCell(0);
        const tagsStr = getCell(3);
        
        return {
          id: parseInt(idStr) || index + 1,
          title: title,
          description: getCell(2),
          tags: tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [],
          image: getCell(4) || 'https://via.placeholder.com/800x600?text=No+Image',
          link: getCell(5) || '#',
        };
      })
      .filter((p): p is Project => p !== null); // إزالة القيم الفارغة (null)
  };

  useEffect(() => {
    const fetchProjects = async () => {
      if (!GOOGLE_SHEET_URL || GOOGLE_SHEET_URL === "") {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(GOOGLE_SHEET_URL);
        if (!response.ok) {
          throw new Error('فشل تحميل البيانات من Google Sheets');
        }
        const text = await response.text();
        
        if (text.trim().startsWith('<!DOCTYPE html>') || text.includes('<html')) {
             throw new Error('الرابط لا يعيد ملف CSV مباشر. يرجى التأكد من نشر الشيت (Publish to web).');
        }

        const parsedProjects = parseCSV(text);
        setProjects(parsedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("حدث خطأ أثناء تحميل البيانات.");
        setProjects([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">أحدث <span className="text-purple-500">المشاريع</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">مجموعة مختارة من المشاريع التي قمت بتنفيذها</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
             <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          </div>
        ) : error ? (
           <div className="flex flex-col justify-center items-center h-32 text-red-400 gap-2 text-center">
             <AlertCircle className="w-8 h-8 mb-2" />
             <p>{error}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center text-gray-500 py-10 border border-purple-900/30 rounded-xl bg-zinc-900/50 backdrop-blur-sm">
            <p className="text-lg">لا توجد مشاريع لعرضها حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;