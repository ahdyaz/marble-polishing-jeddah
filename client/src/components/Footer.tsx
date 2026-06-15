import { Link } from "wouter";
import { Phone, MessageCircle, MapPin, Mail } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Footer() {
  const { data: settings } = trpc.settings.getAll.useQuery();

  const getSetting = (key: string, fallback: string) =>
    settings?.find((s) => s.key === key)?.value || fallback;

  const keywords = getSetting(
    "footer_keywords",
    "جلي رخام جدة، تلميع رخام جدة، جلي وتلميع الرخام، تلميع الرخام بالكريستال، جلي درج الرخام، جلي واجهات الحجر، عزل الرخام جدة، تلميع أرضيات الرخام"
  );

  const phone = getSetting("phone", "0575640550");
  const whatsapp = getSetting("whatsapp", "0575640550");

  return (
    <footer style={{ background: '#0a0a0a', color: '#e5e5e5' }}>
      {/* Gold top border */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #c9a227, #f0d060, #c9a227)' }} />

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #c9a227, #f0d060)' }}
              >
                <span className="text-black font-bold text-lg">✦</span>
              </div>
              <div>
                <div className="text-white font-bold text-xl" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  جلي وتلميع الرخام بجدة
                </div>
                <div className="text-sm" style={{ color: '#c9a227' }}>خدمات احترافية متخصصة</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#aaa' }}>
              شركة متخصصة في جلي وتلميع الرخام بجدة منذ أكثر من 15 عاماً. نقدم خدمات احترافية عالية الجودة
              لتلميع وصيانة الرخام والحجر الطبيعي في المنازل والفلل والمجمعات التجارية بمدينة جدة والمنطقة الغربية.
            </p>
            <div className="flex gap-3">
              <a
                href={`https://wa.me/966${whatsapp.replace(/^0/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                style={{ background: '#25D366', color: '#fff' }}
              >
                <MessageCircle size={16} />
                واتساب
              </a>
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #c9a227, #f0d060)', color: '#000' }}
              >
                <Phone size={16} />
                اتصل بنا
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5" style={{ fontFamily: 'Cairo, sans-serif' }}>
              روابط سريعة
            </h3>
            <div className="h-0.5 w-12 mb-5" style={{ background: 'linear-gradient(90deg, #c9a227, #f0d060)' }} />
            <ul className="space-y-3">
              {[
                { href: "/", label: "الصفحة الرئيسية" },
                { href: "/services", label: "خدماتنا" },
                { href: "/about", label: "من نحن" },
                { href: "/contact", label: "اتصل بنا" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-yellow-400 flex items-center gap-2"
                    style={{ color: '#aaa' }}
                  >
                    <span style={{ color: '#c9a227' }}>◈</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5" style={{ fontFamily: 'Cairo, sans-serif' }}>
              تواصل معنا
            </h3>
            <div className="h-0.5 w-12 mb-5" style={{ background: 'linear-gradient(90deg, #c9a227, #f0d060)' }} />
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-3 text-sm transition-colors hover:text-yellow-400"
                  style={{ color: '#aaa' }}
                >
                  <Phone size={16} style={{ color: '#c9a227', flexShrink: 0 }} />
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/966${whatsapp.replace(/^0/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm transition-colors hover:text-yellow-400"
                  style={{ color: '#aaa' }}
                >
                  <MessageCircle size={16} style={{ color: '#25D366', flexShrink: 0 }} />
                  {whatsapp} (واتساب)
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm" style={{ color: '#aaa' }}>
                  <MapPin size={16} style={{ color: '#c9a227', flexShrink: 0, marginTop: 2 }} />
                  جدة، المملكة العربية السعودية
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* SEO Keywords Section */}
        <div
          className="mt-12 pt-8 border-t"
          style={{ borderColor: '#222' }}
        >
          <h4 className="text-xs font-medium mb-3" style={{ color: '#666' }}>
            خدماتنا في جدة:
          </h4>
          <p className="text-xs leading-relaxed" style={{ color: '#555' }}>
            {keywords}
          </p>
        </div>

        {/* Copyright */}
        <div
          className="mt-8 pt-6 border-t text-center"
          style={{ borderColor: '#1a1a1a' }}
        >
          <p className="text-xs" style={{ color: '#555' }}>
            © {new Date().getFullYear()} جلي وتلميع الرخام بجدة. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
