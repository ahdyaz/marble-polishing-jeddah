import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Phone, MessageCircle, ChevronLeft, ChevronRight, Star, Award, Users, Clock } from "lucide-react";

// Hero Slider Component
function HeroSlider() {
  const { data: slides } = trpc.heroSlides.list.useQuery();
  const [current, setCurrent] = useState(0);
  const { data: settings } = trpc.settings.getAll.useQuery();

  const getSetting = (key: string, fallback: string) =>
    settings?.find((s) => s.key === key)?.value || fallback;

  const heroTitle = getSetting("hero_title", "خبراء جلي وتلميع الرخام في جدة");
  const heroSubtitle = getSetting("hero_subtitle", "نعيد لرخامك بريقه الأصلي بأحدث التقنيات وأفضل المواد الاحترافية");

  const defaultSlides = [
    {
      id: 1,
      imageUrl: "/manus-storage/marble-floor-polished_f9583f11.jpg",
      title: heroTitle,
      subtitle: heroSubtitle,
    },
    {
      id: 2,
      imageUrl: "/manus-storage/marble-hallway_990da899.jpg",
      title: "تلميع الرخام بالكريستال",
      subtitle: "لمعان استثنائي يدوم طويلاً",
    },
    {
      id: 3,
      imageUrl: "/manus-storage/luxury-marble-floor_b7df12d0.jpg",
      title: "جلي واجهات الحجر والرخام",
      subtitle: "نعيد الفخامة لواجهات مبانيكم",
    },
  ];

  const activeSlides = (slides && slides.length > 0) ? slides : defaultSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const prev = () => setCurrent((c) => (c - 1 + activeSlides.length) % activeSlides.length);
  const next = () => setCurrent((c) => (c + 1) % activeSlides.length);

  const phone = getSetting("phone", "0575640550");
  const whatsapp = getSetting("whatsapp", "0575640550");

  return (
    <div className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Slides */}
      {activeSlides.map((slide, idx) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: idx === current ? 1 : 0, zIndex: idx === current ? 1 : 0 }}
        >
          <img
            src={slide.imageUrl}
            alt={slide.title || ""}
            className="w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 100%)' }} />
        </div>
      ))}

      {/* Gold shimmer overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(201,162,39,0.08) 0%, transparent 70%)',
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 3 }}>
        <div className="container mx-auto px-4 text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ background: 'rgba(201,162,39,0.2)', border: '1px solid rgba(201,162,39,0.5)', color: '#f0d060' }}
          >
            <Star size={14} fill="currentColor" />
            خدمات احترافية منذ أكثر من 15 عاماً
          </div>

          {/* Title */}
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight"
            style={{ fontFamily: 'Cairo, sans-serif', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
          >
            {activeSlides[current]?.title || heroTitle}
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-2xl mb-10 max-w-3xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}
          >
            {activeSlides[current]?.subtitle || heroSubtitle}
          </p>

          {/* Gold divider */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, #c9a227)' }} />
            <div className="w-2 h-2 rounded-full" style={{ background: '#c9a227' }} />
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, #c9a227, transparent)' }} />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #c9a227, #f0d060, #c9a227)',
                color: '#000',
                boxShadow: '0 4px 20px rgba(201,162,39,0.4)',
              }}
            >
              <Phone size={20} />
              اتصل الآن: {phone}
            </a>
            <a
              href={`https://wa.me/966${whatsapp.replace(/^0/, "")}?text=${encodeURIComponent("مرحباً، أريد الاستفسار عن خدمات جلي وتلميع الرخام")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 border-2"
              style={{
                background: 'rgba(37,211,102,0.15)',
                borderColor: '#25D366',
                color: '#fff',
              }}
            >
              <MessageCircle size={20} style={{ color: '#25D366' }} />
              واتساب
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(201,162,39,0.3)', border: '1px solid rgba(201,162,39,0.5)', color: '#fff', zIndex: 4 }}
        aria-label="السابق"
      >
        <ChevronRight size={24} />
      </button>
      <button
        onClick={next}
        className="absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(201,162,39,0.3)', border: '1px solid rgba(201,162,39,0.5)', color: '#fff', zIndex: 4 }}
        aria-label="التالي"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2" style={{ zIndex: 4 }}>
        {activeSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: idx === current ? 32 : 10,
              height: 10,
              background: idx === current ? '#c9a227' : 'rgba(255,255,255,0.4)',
            }}
            aria-label={`الشريحة ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Stats Section
function StatsSection() {
  const stats = [
    { icon: <Award size={32} />, value: "15+", label: "سنة خبرة" },
    { icon: <Users size={32} />, value: "5000+", label: "عميل راضٍ" },
    { icon: <Star size={32} />, value: "100%", label: "ضمان الجودة" },
    { icon: <Clock size={32} />, value: "24/7", label: "خدمة متواصلة" },
  ];

  return (
    <div style={{ background: '#0a0a0a' }} className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="text-center group"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110"
                style={{ background: 'rgba(201,162,39,0.15)', color: '#c9a227' }}
              >
                {stat.icon}
              </div>
              <div
                className="text-4xl font-black mb-2"
                style={{ fontFamily: 'Cairo, sans-serif', color: '#c9a227' }}
              >
                {stat.value}
              </div>
              <div className="text-sm" style={{ color: '#888' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Services Section
function ServicesSection() {
  const { data: services, isLoading } = trpc.services.list.useQuery();

  const defaultServices = [
    { id: 1, title: "تلميع الرخام بالكريستال", description: "نستخدم تقنية الكريستال الاحترافية لتلميع الرخام وإعطائه لمعاناً استثنائياً يدوم طويلاً.", imageUrl: "/manus-storage/marble-polishing-service_00315629.jpg", icon: "💎" },
    { id: 2, title: "جلي درج الرخام", description: "نقدم خدمة جلي وتلميع درج الرخام بأحدث الأجهزة والمواد المتخصصة.", imageUrl: "/manus-storage/marble-staircase_a58df335.jpg", icon: "🏛️" },
    { id: 3, title: "جلي واجهات الحجر والرخام", description: "نتخصص في جلي وتلميع واجهات المباني المصنوعة من الحجر والرخام الطبيعي.", imageUrl: "/manus-storage/stone-wall-polishing_6d4335f4.jpg", icon: "🏗️" },
    { id: 4, title: "عزل الرخام", description: "نوفر خدمة عزل الرخام باستخدام مواد عازلة عالية الجودة تحمي الرخام من البقع والرطوبة.", imageUrl: "/manus-storage/marble-restoration_5b3c2d69.jpg", icon: "🛡️" },
    { id: 5, title: "تلميع أرضيات الرخام", description: "نقدم خدمة شاملة لتلميع أرضيات الرخام في المنازل والفلل والمجمعات التجارية.", imageUrl: "/manus-storage/marble-floor-polished_f9583f11.jpg", icon: "✨" },
    { id: 6, title: "صيانة وترميم الرخام", description: "نقدم خدمات متكاملة لصيانة وترميم الرخام التالف بما يشمل إصلاح الكسور والشقوق.", imageUrl: "/manus-storage/marble-polishing-restoration_5396d381.jpg", icon: "🔧" },
  ];

  const activeServices = (services && services.length > 0) ? services : defaultServices;

  return (
    <section className="py-20" style={{ background: '#f8f5f0' }}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
            style={{ background: 'rgba(201,162,39,0.1)', color: '#a07820' }}
          >
            ✦ خدماتنا المتميزة
          </div>
          <h2
            className="text-4xl md:text-5xl font-black mb-4"
            style={{ fontFamily: 'Cairo, sans-serif', color: '#1a1a1a' }}
          >
            خدمات جلي وتلميع الرخام
          </h2>
          <div className="gold-divider" />
          <p className="text-lg mt-4 max-w-2xl mx-auto" style={{ color: '#666' }}>
            نقدم مجموعة متكاملة من خدمات الرخام الاحترافية في جدة بأعلى معايير الجودة
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeServices.map((service, idx) => (
            <div
              key={service.id}
              className="service-card rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
              style={{ background: '#fff', animationDelay: `${idx * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={service.imageUrl || "/manus-storage/marble-interior_b141459b.jpg"}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)', opacity: 0.7 }}
                />
                {/* Icon badge */}
                <div
                  className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ background: 'rgba(201,162,39,0.9)', backdropFilter: 'blur(4px)' }}
                >
                  {service.icon}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ fontFamily: 'Cairo, sans-serif', color: '#1a1a1a' }}
                >
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#666' }}>
                  {service.description}
                </p>
                <div
                  className="h-0.5 w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: 'linear-gradient(90deg, #c9a227, #f0d060)' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #1a1a1a, #333)',
              color: '#c9a227',
              border: '2px solid #c9a227',
            }}
          >
            عرض جميع الخدمات
            <ChevronLeft size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Why Choose Us Section
function WhyUsSection() {
  const features = [
    { icon: "🏆", title: "خبرة 15 عاماً", desc: "نمتلك خبرة واسعة في مجال جلي وتلميع الرخام بجدة" },
    { icon: "⚙️", title: "أحدث التقنيات", desc: "نستخدم أحدث الأجهزة والمواد الاحترافية المستوردة" },
    { icon: "👨‍🔧", title: "فريق متخصص", desc: "فريقنا من المتخصصين المدربين على أعلى مستوى" },
    { icon: "✅", title: "ضمان الجودة", desc: "نضمن رضاكم التام أو نعيد العمل مجاناً" },
    { icon: "💰", title: "أسعار تنافسية", desc: "نقدم أفضل الأسعار مع الحفاظ على أعلى جودة" },
    { icon: "🚀", title: "سرعة في التنفيذ", desc: "ننجز العمل في الوقت المحدد دون تأخير" },
  ];

  return (
    <section className="py-20" style={{ background: '#1a1a1a' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
            style={{ background: 'rgba(201,162,39,0.15)', color: '#c9a227' }}
          >
            ✦ لماذا تختارنا
          </div>
          <h2
            className="text-4xl md:text-5xl font-black text-white mb-4"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            الأفضل في جدة
          </h2>
          <div className="gold-divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl group transition-all duration-300 hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(201,162,39,0.2)',
              }}
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ fontFamily: 'Cairo, sans-serif', color: '#c9a227' }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#888' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  const { data: settings } = trpc.settings.getAll.useQuery();
  const phone = settings?.find((s) => s.key === "phone")?.value || "0575640550";
  const whatsapp = settings?.find((s) => s.key === "whatsapp")?.value || "0575640550";

  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)' }}
    >
      {/* Gold decorative elements */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #c9a227, transparent)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #c9a227, transparent)' }}
      />

      <div className="container mx-auto px-4 text-center relative z-10">
        <h2
          className="text-4xl md:text-5xl font-black text-white mb-4"
          style={{ fontFamily: 'Cairo, sans-serif' }}
        >
          هل تحتاج خدمات جلي الرخام؟
        </h2>
        <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: '#aaa' }}>
          تواصل معنا الآن للحصول على استشارة مجانية وعرض سعر مناسب
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-3 px-10 py-4 rounded-full font-bold text-xl transition-all hover:scale-105 hover:shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #c9a227, #f0d060, #c9a227)',
              color: '#000',
              boxShadow: '0 4px 30px rgba(201,162,39,0.4)',
            }}
          >
            <Phone size={24} />
            {phone}
          </a>
          <a
            href={`https://wa.me/966${whatsapp.replace(/^0/, "")}?text=${encodeURIComponent("مرحباً، أريد الاستفسار عن خدمات جلي وتلميع الرخام")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-10 py-4 rounded-full font-bold text-xl transition-all hover:scale-105 border-2"
            style={{ borderColor: '#25D366', color: '#25D366' }}
          >
            <MessageCircle size={24} />
            واتساب
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSlider />
      <StatsSection />
      <ServicesSection />
      <WhyUsSection />
      <CTASection />
    </div>
  );
}
