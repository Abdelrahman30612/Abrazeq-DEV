import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, User, Award, CheckCircle } from 'lucide-react';
import { ABOUT_ME } from '../constants';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Contact Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">تواصل <span className="text-purple-500">معي</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            هل لديك فكرة مشروع؟ أو تبحث عن مطور للانضمام لفريقك؟ لا تتردد في التواصل معي.
          </p>
        </motion.div>

        {/* About Me Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Image Column */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center lg:justify-end order-1 lg:order-2"
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
              {/* Neon Glow Behind */}
              <div className="absolute inset-0 bg-purple-600 rounded-full blur-[40px] opacity-40 animate-pulse" />
              
              {/* Border Ring */}
              <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full opacity-80" />
              
              {/* Image Container */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-black bg-zinc-900">
                <img 
                  src={ABOUT_ME.image} 
                  alt={ABOUT_ME.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
                />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-4 -right-4 bg-zinc-900 border border-purple-500 p-3 rounded-2xl shadow-lg shadow-purple-900/40">
                <User className="text-purple-400 w-6 h-6" />
              </div>
            </div>
          </motion.div>

          {/* Text Column */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-right order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-900/10 backdrop-blur-sm mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span className="text-purple-200 text-xs font-medium">نبذة عني</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {ABOUT_ME.name}
            </h2>
            <h3 className="text-xl text-purple-400 font-medium mb-6">
              {ABOUT_ME.title}
            </h3>
            
            <p className="text-gray-300 leading-loose text-lg mb-8">
              {ABOUT_ME.description}
            </p>
          </motion.div>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Email Card */}
            <a 
              href="mailto:bbm771729@gmail.com"
              className="bg-zinc-900/50 backdrop-blur-md border border-purple-900/50 p-8 rounded-2xl hover:border-purple-500 transition-all duration-300 group flex flex-col items-center gap-4 hover:-translate-y-2 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-400 border border-purple-500/30 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Mail size={32} />
              </div>
              <div className="text-center">
                <h4 className="text-white font-bold text-xl mb-2">البريد الإلكتروني</h4>
                <span className="text-gray-400 group-hover:text-purple-400 transition-colors block text-sm sm:text-base break-all">
                  bbm771729@gmail.com
                </span>
              </div>
            </a>

            {/* WhatsApp Card */}
            <a 
              href="https://wa.me/201025565796" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-zinc-900/50 backdrop-blur-md border border-purple-900/50 p-8 rounded-2xl hover:border-purple-500 transition-all duration-300 group flex flex-col items-center gap-4 hover:-translate-y-2 cursor-pointer"
            >
                <div className="w-16 h-16 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-400 border border-purple-500/30 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Phone size={32} />
              </div>
              <div className="text-center">
                <h4 className="text-white font-bold text-xl mb-2">واتساب</h4>
                <p dir="ltr" className="text-gray-400 group-hover:text-purple-400 transition-colors text-sm sm:text-base">01025565796</p>
              </div>
            </a>

            {/* Location Card */}
            <div className="bg-zinc-900/50 backdrop-blur-md border border-purple-900/50 p-8 rounded-2xl hover:border-purple-500 transition-all duration-300 group flex flex-col items-center gap-4 hover:-translate-y-2">
                <div className="w-16 h-16 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-400 border border-purple-500/30 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <MapPin size={32} />
              </div>
              <div className="text-center">
                <h4 className="text-white font-bold text-xl mb-2">الموقع</h4>
                <p className="text-gray-400 text-sm sm:text-base">القاهرة، مصر</p>
              </div>
            </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;