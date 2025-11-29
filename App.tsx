import React, { Suspense, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import MatrixBackground from './components/MatrixBackground';
import Scene3D from './components/Scene3D';
import AbrazeqGPT from './components/AbrazeqGPT';

const App: React.FC = () => {
  const [isGPTOpen, setIsGPTOpen] = useState(false);

  return (
    <div className="min-h-screen relative text-white selection:bg-purple-500 selection:text-white">
      {/* Background Layer 1: Matrix Rain */}
      <MatrixBackground />

      {/* Background Layer 2: 3D Elements */}
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>

      {/* GPT Overlay */}
      <AnimatePresence>
        {isGPTOpen && <AbrazeqGPT onClose={() => setIsGPTOpen(false)} />}
      </AnimatePresence>

      {/* Foreground Layer: UI Content */}
      <div className={`relative z-10 transition-all duration-500 ${isGPTOpen ? 'blur-sm scale-[0.98]' : ''}`}>
        <Navbar onOpenGPT={() => setIsGPTOpen(true)} />
        <main>
          <Hero />
          <Skills />
          <Projects />
          <Contact />
        </main>
        
        <footer className="py-8 text-center text-gray-500 text-sm bg-black/80 backdrop-blur-sm border-t border-purple-900/30">
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة. تم التصميم والتطوير بشغف.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;