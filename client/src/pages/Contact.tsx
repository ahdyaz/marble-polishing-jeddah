import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Phone, MessageCircle, MapPin, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { MapView } from "@/components/Map";

export default function Contact() {
  const { data: settings } = trpc.settings.getAll.useQuery();
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const getSetting = (key: string, fallback: string) =>
    settings?.find((s) => s.key === key)?.value || fallback;

  const phone = getSetting("phone", "0575640550");
  const whatsapp = getSetting("whatsapp", "0575640550");
  const address = getSetting("address", "جدة، المملكة العربية السعودية");

  const sendMessage = trpc.contact.send.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setForm({ name: "", phone: "", email: "", message: "" });
      toast.success("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast.error("يرجى ملء الاسم والرسالة على الأقل");
      return;
    }
    sendMessage.mutate(form);
  };

  const contactInfo = [
    {
      icon: <Phone size={24} />,
      title: "رقم الهاتف",
      value: phone,
      href: `tel:${phone}`,
      color: '#c9a227',
    },
    {
      icon: <MessageCircle size={24} />,
      title: "واتساب",
      value: whatsapp,
      href: `https://wa.me/966${whatsapp.replace(/^0/, "")}`,
      color: '#25D366',
    },
    {
      icon: <MapPin size={24} />,
      title: "العنوان",
      value: address,
      href: "https://maps.google.com/?q=جدة+المملكة+العربية+السعودية",
      color: '#c9a227',
    },
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
            ✦ تواصل معنا
          </div>
          <h1
            className="text-5xl font-black text-white mb-4"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            اتصل بنا
          </h1>
          <div className="gold-divider" />
          <p className="text-lg mt-4 max-w-xl mx-auto" style={{ color: '#aaa' }}>
            نحن هنا لمساعدتك. تواصل معنا الآن للحصول على استشارة مجانية
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <h2
              className="text-2xl font-black mb-6"
              style={{ fontFamily: 'Cairo, sans-serif', color: '#1a1a1a' }}
            >
              معلومات التواصل
            </h2>

            {contactInfo.map((info, idx) => (
              <a
                key={idx}
                href={info.href}
                target={info.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:-translate-y-1 duration-300 group"
                style={{ background: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: `${info.color}20`, color: info.color }}
                >
                  {info.icon}
                </div>
                <div>
                  <div className="text-xs font-medium mb-1" style={{ color: '#999' }}>{info.title}</div>
                  <div className="font-bold" style={{ color: '#1a1a1a', direction: 'ltr', textAlign: 'right' }}>
                    {info.value}
                  </div>
                </div>
              </a>
            ))}

            {/* Quick WhatsApp */}
            <a
              href={`https://wa.me/966${whatsapp.replace(/^0/, "")}?text=${encodeURIComponent("مرحباً، أريد الاستفسار عن خدمات جلي وتلميع الرخام")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105"
              style={{ background: '#25D366', color: '#fff', boxShadow: '0 4px 20px rgba(37,211,102,0.3)' }}
            >
              <MessageCircle size={24} />
              تواصل عبر الواتساب الآن
            </a>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div
              className="p-8 rounded-3xl shadow-xl"
              style={{ background: '#fff' }}
            >
              <h2
                className="text-2xl font-black mb-6"
                style={{ fontFamily: 'Cairo, sans-serif', color: '#1a1a1a' }}
              >
                أرسل لنا رسالة
              </h2>

              {submitted ? (
                <div className="text-center py-12">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'rgba(201,162,39,0.1)', color: '#c9a227' }}
                  >
                    <CheckCircle size={40} />
                  </div>
                  <h3
                    className="text-2xl font-black mb-2"
                    style={{ fontFamily: 'Cairo, sans-serif', color: '#1a1a1a' }}
                  >
                    تم الإرسال بنجاح!
                  </h3>
                  <p style={{ color: '#666' }}>سنتواصل معك في أقرب وقت ممكن</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-6 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                    style={{ background: 'rgba(201,162,39,0.1)', color: '#a07820' }}
                  >
                    إرسال رسالة أخرى
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#555' }}>
                        الاسم الكامل *
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="أدخل اسمك الكامل"
                        className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2"
                        style={{
                          borderColor: '#e5e5e5',
                          background: '#fafafa',
                          fontFamily: 'Cairo, sans-serif',
                        }}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#555' }}>
                        رقم الهاتف
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="05xxxxxxxx"
                        className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2"
                        style={{
                          borderColor: '#e5e5e5',
                          background: '#fafafa',
                          direction: 'ltr',
                          textAlign: 'right',
                        }}
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#555' }}>
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="example@email.com"
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2"
                      style={{
                        borderColor: '#e5e5e5',
                        background: '#fafafa',
                        direction: 'ltr',
                        textAlign: 'right',
                      }}
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#555' }}>
                      رسالتك *
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="اكتب رسالتك هنا... (نوع الخدمة المطلوبة، موقعك، أي تفاصيل إضافية)"
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2 resize-none"
                      style={{
                        borderColor: '#e5e5e5',
                        background: '#fafafa',
                        fontFamily: 'Cairo, sans-serif',
                      }}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sendMessage.isPending}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] disabled:opacity-70"
                    style={{
                      background: 'linear-gradient(135deg, #c9a227, #f0d060, #c9a227)',
                      color: '#000',
                      boxShadow: '0 4px 20px rgba(201,162,39,0.3)',
                    }}
                  >
                    {sendMessage.isPending ? (
                      <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={20} />
                        إرسال الرسالة
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2
            className="text-2xl font-black mb-6 text-center"
            style={{ fontFamily: 'Cairo, sans-serif', color: '#1a1a1a' }}
          >
            موقعنا على الخريطة
          </h2>
          <div className="rounded-3xl overflow-hidden shadow-xl" style={{ height: 400 }}>
            <MapView
              initialCenter={{ lat: 21.5433, lng: 39.1728 }}
              initialZoom={12}
              onMapReady={(map) => {
                // Add marker for Jeddah
                new google.maps.Marker({
                  position: { lat: 21.5433, lng: 39.1728 },
                  map,
                  title: 'جلي وتلميع الرخام - جدة',
                  animation: google.maps.Animation.DROP,
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
