import { trpc } from "@/lib/trpc";
import { Phone, MessageCircle } from "lucide-react";

export default function Services() {
  const { data: services, isLoading } = trpc.services.list.useQuery();
  const { data: settings } = trpc.settings.getAll.useQuery();

  const phone = settings?.find((s) => s.key === "phone")?.value || "0575640550";
  const whatsapp = settings?.find((s) => s.key === "whatsapp")?.value || "0575640550";

  const defaultServices = [
    { id: 1, title: "تلميع الرخام بالكريستال", description: "نستخدم تقنية الكريستال الاحترافية لتلميع الرخام وإعطائه لمعاناً استثنائياً يدوم طويلاً. هذه التقنية المتطورة تعمل على ملء المسام الدقيقة في الرخام وتعزيز صلابته وحمايته من التلف.", imageUrl: "/manus-storage/marble-polishing-service_00315629.jpg", icon: "💎" },
    { id: 2, title: "جلي درج الرخام", description: "نقدم خدمة جلي وتلميع درج الرخام بأحدث الأجهزة والمواد المتخصصة، لإعادة بريق الدرج وإزالة الخدوش والبهتان مع الحفاظ على جماله وأناقته.", imageUrl: "/manus-storage/marble-staircase_a58df335.jpg", icon: "🏛️" },
    { id: 3, title: "جلي واجهات الحجر والرخام", description: "نتخصص في جلي وتلميع واجهات المباني المصنوعة من الحجر والرخام الطبيعي، مما يعيد لها مظهرها الأصلي الفاخر ويحميها من عوامل التعرية والتلوث.", imageUrl: "/manus-storage/stone-wall-polishing_6d4335f4.jpg", icon: "🏗️" },
    { id: 4, title: "عزل الرخام", description: "نوفر خدمة عزل الرخام باستخدام مواد عازلة عالية الجودة تحمي الرخام من البقع والرطوبة والتلف، مما يطيل عمره ويحافظ على جماله لسنوات طويلة.", imageUrl: "/manus-storage/marble-restoration_5b3c2d69.jpg", icon: "🛡️" },
    { id: 5, title: "تلميع أرضيات الرخام", description: "نقدم خدمة شاملة لتلميع أرضيات الرخام في المنازل والفلل والمجمعات التجارية، باستخدام أحدث ماكينات التلميع والمواد الاحترافية لنتائج مبهرة.", imageUrl: "/manus-storage/marble-floor-polished_f9583f11.jpg", icon: "✨" },
    { id: 6, title: "صيانة وترميم الرخام", description: "نقدم خدمات متكاملة لصيانة وترميم الرخام التالف، بما يشمل إصلاح الكسور والشقوق وإزالة البقع الصعبة وإعادة الرخام إلى حالته الأصلية.", imageUrl: "/manus-storage/marble-polishing-restoration_5396d381.jpg", icon: "🔧" },
  ];

  const activeServices = (services && services.length > 0) ? services : defaultServices;

  return (
    <div className="min-h-screen" style={{ background: '#f8f5f0' }}>
      {/* Page Hero */}
      <div
        className="relative pt-32 pb-20 text-center"
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `url(/manus-storage/marble-interior_b141459b.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="relative z-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
            style={{ background: 'rgba(201,162,39,0.2)', color: '#f0d060' }}
          >
            ✦ خدماتنا المتميزة
          </div>
          <h1
            className="text-5xl font-black text-white mb-4"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            خدمات جلي وتلميع الرخام
          </h1>
          <div className="gold-divider" />
          <p className="text-lg mt-4 max-w-2xl mx-auto" style={{ color: '#aaa' }}>
            نقدم مجموعة متكاملة من خدمات الرخام الاحترافية في جدة
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {activeServices.map((service, idx) => (
            <div
              key={service.id}
              className="rounded-2xl overflow-hidden shadow-xl group transition-all duration-300 hover:-translate-y-2"
              style={{ background: '#fff' }}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                  <img
                    src={service.imageUrl || "/manus-storage/marble-interior_b141459b.jpg"}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ background: 'rgba(201,162,39,0.9)' }}
                  >
                    {service.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="md:w-3/5 p-8 flex flex-col justify-center">
                  <h3
                    className="text-2xl font-black mb-4"
                    style={{ fontFamily: 'Cairo, sans-serif', color: '#1a1a1a' }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-base leading-relaxed mb-6" style={{ color: '#555' }}>
                    {service.description}
                  </p>
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105 self-start"
                    style={{
                      background: 'linear-gradient(135deg, #c9a227, #f0d060)',
                      color: '#000',
                    }}
                  >
                    <Phone size={16} />
                    احصل على عرض سعر
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className="mt-16 p-10 rounded-3xl text-center"
          style={{ background: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)', border: '1px solid rgba(201,162,39,0.3)' }}
        >
          <h3
            className="text-3xl font-black text-white mb-4"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            تواصل معنا الآن
          </h3>
          <p className="mb-8" style={{ color: '#aaa' }}>
            للاستفسار عن أي من خدماتنا أو الحصول على عرض سعر مجاني
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #c9a227, #f0d060)', color: '#000' }}
            >
              <Phone size={20} />
              {phone}
            </a>
            <a
              href={`https://wa.me/966${whatsapp.replace(/^0/, "")}?text=${encodeURIComponent("مرحباً، أريد الاستفسار عن خدمات جلي وتلميع الرخام")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 border-2"
              style={{ borderColor: '#25D366', color: '#25D366' }}
            >
              <MessageCircle size={20} />
              واتساب
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
