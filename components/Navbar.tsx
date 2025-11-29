import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { NAV_LINKS } from '../constants';

interface NavbarProps {
  onOpenGPT: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenGPT }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof NAV_LINKS[0]) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (link.isSpecial) {
      onOpenGPT();
      return;
    }

    const targetId = link.href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent ${
        scrolled ? 'bg-black/80 backdrop-blur-md border-purple-900/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <span className="font-bold text-2xl tracking-wider text-white">
              Abrazeq<span className="text-purple-500">.DEV</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline gap-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`relative px-3 py-2 text-md font-medium transition-colors duration-200 group cursor-pointer flex items-center gap-2 ${
                    link.isSpecial 
                      ? 'text-white bg-purple-600/20 border border-purple-500/50 rounded-full hover:bg-purple-600 hover:border-purple-500' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.isSpecial && <Sparkles size={16} className="text-purple-300 group-hover:text-white" />}
                  {link.name}
                  {!link.isSpecial && (
                    <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full group-hover:right-auto group-hover:left-0" />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-purple-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className={`block px-3 py-4 rounded-md text-base font-medium text-center border-l-4 transition-all cursor-pointer ${
                   link.isSpecial 
                   ? 'bg-purple-900/30 text-white border-purple-500 flex items-center justify-center gap-2' 
                   : 'text-gray-300 hover:text-white hover:bg-purple-900/20 border-transparent hover:border-purple-500'
                }`}
              >
                {link.isSpecial && <Sparkles size={18} />}
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;