import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/services", label: "خدماتنا" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "اتصل بنا" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/95 backdrop-blur-md shadow-lg shadow-black/30"
          : "bg-gradient-to-b from-black/70 to-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-black font-bold text-lg">✦</span>
            </div>
            <div>
              <div className="text-white font-bold text-lg leading-tight" style={{ fontFamily: 'Cairo, sans-serif' }}>
                جلي وتلميع الرخام
              </div>
              <div className="text-xs" style={{ color: '#c9a227' }}>جدة - خدمات احترافية</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all duration-300 hover:text-yellow-400 relative group ${
                  location === link.href ? "text-yellow-400" : "text-white/90"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 right-0 h-0.5 transition-all duration-300 ${
                    location === link.href ? "w-full bg-yellow-400" : "w-0 bg-yellow-400 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:0575640550"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-black font-bold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #c9a227, #f0d060, #c9a227)' }}
            >
              <Phone size={16} />
              0575640550
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="قائمة التنقل"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ background: 'rgba(0,0,0,0.97)' }}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-base font-medium py-2 border-b border-white/10 transition-colors ${
                location === link.href ? "text-yellow-400" : "text-white/90 hover:text-yellow-400"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="tel:0575640550"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-full text-black font-bold text-sm mt-2"
            style={{ background: 'linear-gradient(135deg, #c9a227, #f0d060, #c9a227)' }}
          >
            <Phone size={16} />
            اتصل بنا: 0575640550
          </a>
        </div>
      </div>
    </nav>
  );
}
