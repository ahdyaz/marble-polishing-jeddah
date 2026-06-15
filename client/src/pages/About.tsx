import { trpc } from "@/lib/trpc";
import { Award, Users, Star, Shield } from "lucide-react";

export default function About() {
  const { data: settings } = trpc.settings.getAll.useQuery();

  const getSetting = (key: string, fallback: string) =>
    settings?.find((s) => s.key === key)?.value || fallback;

  const aboutTitle = getSetting("about_title", "من نحن");
  const aboutText = getSetting(
    "about_text",
    "شركة متخصصة في جلي وتلميع الرخام بجدة منذ أكثر من 15 عاماً. نقدم خدمات احترافية عالية الجودة لتلميع وصيانة الرخام والحجر الطبيعي في المنازل والفلل والمجمعات التجارية. فريقنا المتخصص يستخدم أحدث التقنيات والمواد الاحترافية لضمان أفضل النتائج."
  );

  const values = [
    { icon: <Award size={32} />, title: "الجودة أولاً", desc: "نلتزم بأعلى معايير الجودة في كل مشروع ننفذه" },
    { icon: <Users size={32} />, title: "رضا العملاء", desc: "رضا عملائنا هو هدفنا الأول والأخير" },
    { icon: <Star size={32} />, title: "الاحترافية", desc: "فريق متخصص ومدرب على أعلى مستوى من الاحترافية" },
    { icon: <Shield size={32} />, title: "الأمانة والثقة", desc: "نبني علاقات طويلة الأمد مع عملائنا مبنية على الثقة" },
  ];

  const milestones = [
    { year: "2009", event: "تأسيس الشركة في جدة" },
    { year: "2012", event: "توسيع نطاق الخدمات لتشمل الواجهات" },
    { year: "2016", event: "استيراد أحدث تقنيات التلميع الأوروبية" },
    { year: "2020", event: "تجاوز 3000 مشروع منجز بنجاح" },
    { year: "2024", event: "أكثر من 5000 عميل راضٍ في جدة" },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#f8f5f0' }}>
      {/* Page Hero */}
      <div
        className="relative pt-32 pb-20 text-center"
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{ backgroundImage: `url(/manus-storage/marble-interior_b141459b.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="relative z-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
            style={{ background: 'rgba(201,162,39,0.2)', color: '#f0d060' }}
          >
            ✦ تعرف علينا
          </div>
          <h1
            className="text-5xl font-black text-white mb-4"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            {aboutTitle}
          </h1>
          <div className="gold-divider" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-20">
        {/* About Text */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ background: 'rgba(201,162,39,0.1)', color: '#a07820' }}
            >
              ✦ قصتنا
            </div>
            <h2
              className="text-4xl font-black mb-6"
              style={{ fontFamily: 'Cairo, sans-serif', color: '#1a1a1a' }}
            >
              خبرة أكثر من 15 عاماً في خدمات الرخام
            </h2>
            <div className="h-1 w-20 mb-6" style={{ background: 'linear-gradient(90deg, #c9a227, #f0d060)' }} />
            <p className="text-lg leading-relaxed mb-6" style={{ color: '#555' }}>
              {aboutText}
            </p>
            <p className="text-base leading-relaxed" style={{ color: '#666' }}>
              نخدم مدينة جدة وضواحيها بالكامل، ونفخر بثقة آلاف العملاء الذين اختاروا خدماتنا لتلميع وصيانة رخامهم.
              نستخدم أحدث التقنيات الأوروبية والمواد الاحترافية عالية الجودة لضمان نتائج استثنائية.
            </p>
          </div>

          <div className="relative">
            <img
              src="/manus-storage/marble-polishing-restoration_5396d381.jpg"
              alt="من نحن - جلي وتلميع الرخام بجدة"
              className="w-full h-96 object-cover rounded-2xl shadow-2xl"
            />
            {/* Gold frame decoration */}
            <div
              className="absolute -bottom-4 -left-4 w-full h-full rounded-2xl -z-10"
              style={{ border: '2px solid rgba(201,162,39,0.4)' }}
            />
            {/* Stats badge */}
            <div
              className="absolute -top-6 -right-6 p-5 rounded-2xl shadow-xl text-center"
              style={{ background: 'linear-gradient(135deg, #c9a227, #f0d060)', color: '#000' }}
            >
              <div className="text-3xl font-black" style={{ fontFamily: 'Cairo, sans-serif' }}>15+</div>
              <div className="text-xs font-bold">سنة خبرة</div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-black mb-4"
              style={{ fontFamily: 'Cairo, sans-serif', color: '#1a1a1a' }}
            >
              قيمنا ومبادئنا
            </h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl text-center transition-all hover:-translate-y-2 duration-300"
                style={{ background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(201,162,39,0.1)', color: '#c9a227' }}
                >
                  {v.icon}
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ fontFamily: 'Cairo, sans-serif', color: '#1a1a1a' }}
                >
                  {v.title}
                </h3>
                <p className="text-sm" style={{ color: '#666' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div
          className="p-10 rounded-3xl"
          style={{ background: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)', border: '1px solid rgba(201,162,39,0.2)' }}
        >
          <h2
            className="text-3xl font-black text-white text-center mb-10"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            مسيرتنا عبر السنين
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div
              className="absolute right-1/2 top-0 bottom-0 w-px"
              style={{ background: 'linear-gradient(to bottom, #c9a227, rgba(201,162,39,0.1))' }}
            />
            <div className="space-y-8">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-6 ${idx % 2 === 0 ? "flex-row-reverse" : ""}`}
                >
                  <div className={`flex-1 ${idx % 2 === 0 ? "text-right" : "text-left"}`}>
                    <div
                      className="inline-block px-4 py-2 rounded-xl"
                      style={{ background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.3)' }}
                    >
                      <div
                        className="text-xl font-black"
                        style={{ color: '#c9a227', fontFamily: 'Cairo, sans-serif' }}
                      >
                        {m.year}
                      </div>
                      <div className="text-sm" style={{ color: '#aaa' }}>{m.event}</div>
                    </div>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0 relative z-10"
                    style={{ background: '#c9a227', boxShadow: '0 0 10px rgba(201,162,39,0.5)' }}
                  />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
