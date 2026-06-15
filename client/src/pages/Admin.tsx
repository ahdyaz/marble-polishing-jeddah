import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import {
  Settings, Image, Layers, MessageSquare, Plus, Trash2, Edit3, Save, X, Eye, EyeOff, RefreshCw, Lock
} from "lucide-react";
import AdminLogin from "./AdminLogin";

type Tab = "settings" | "services" | "slides" | "messages" | "password";

// Settings Tab
function SettingsTab() {
  const { data: settings, refetch } = trpc.settings.getAll.useQuery();
  const updateMany = trpc.settings.updateMany.useMutation({
    onSuccess: () => { toast.success("تم حفظ الإعدادات بنجاح"); refetch(); },
    onError: () => toast.error("حدث خطأ أثناء الحفظ"),
  });

  const settingFields = [
    { key: "company_name", label: "اسم الشركة" },
    { key: "phone", label: "رقم الهاتف" },
    { key: "whatsapp", label: "رقم الواتساب" },
    { key: "address", label: "العنوان" },
    { key: "hero_title", label: "عنوان الهيدر الرئيسي" },
    { key: "hero_subtitle", label: "النص الفرعي للهيدر" },
    { key: "about_title", label: "عنوان صفحة من نحن" },
    { key: "footer_keywords", label: "كلمات مفتاحية الفوتر (SEO)" },
  ];

  const [values, setValues] = useState<Record<string, string>>({});

  const getValue = (key: string) => {
    if (values[key] !== undefined) return values[key];
    return settings?.find((s) => s.key === key)?.value || "";
  };

  const handleSave = () => {
    const updates = settingFields.map((f) => ({ key: f.key, value: getValue(f.key), label: f.label }));
    updateMany.mutate(updates);
  };

  // About text separately (textarea)
  const aboutText = values["about_text"] !== undefined
    ? values["about_text"]
    : settings?.find((s) => s.key === "about_text")?.value || "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>إعدادات الموقع</h2>
        <button
          onClick={handleSave}
          disabled={updateMany.isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #c9a227, #f0d060)', color: '#000' }}
        >
          <Save size={16} />
          {updateMany.isPending ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {settingFields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium mb-2" style={{ color: '#555' }}>
              {field.label}
            </label>
            <input
              type="text"
              value={getValue(field.key)}
              onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border outline-none transition-all"
              style={{ borderColor: '#e5e5e5', background: '#fafafa', fontFamily: 'Cairo, sans-serif' }}
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#555' }}>
          نص صفحة من نحن
        </label>
        <textarea
          value={aboutText}
          onChange={(e) => setValues((v) => ({ ...v, about_text: e.target.value }))}
          rows={5}
          className="w-full px-4 py-3 rounded-xl border outline-none transition-all resize-none"
          style={{ borderColor: '#e5e5e5', background: '#fafafa', fontFamily: 'Cairo, sans-serif' }}
        />
      </div>
    </div>
  );
}

// Services Tab
function ServicesTab() {
  const { data: services, refetch } = trpc.services.listAll.useQuery();
  const createService = trpc.services.create.useMutation({
    onSuccess: () => { toast.success("تم إضافة الخدمة"); refetch(); setShowAdd(false); setNewService({ title: "", description: "", imageUrl: "", icon: "", order: 0 }); },
    onError: () => toast.error("حدث خطأ"),
  });
  const updateService = trpc.services.update.useMutation({
    onSuccess: () => { toast.success("تم تحديث الخدمة"); refetch(); setEditId(null); },
    onError: () => toast.error("حدث خطأ"),
  });
  const deleteService = trpc.services.delete.useMutation({
    onSuccess: () => { toast.success("تم حذف الخدمة"); refetch(); },
    onError: () => toast.error("حدث خطأ"),
  });

  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [newService, setNewService] = useState({ title: "", description: "", imageUrl: "", icon: "", order: 0 });
  const [editData, setEditData] = useState<Record<string, string | number | boolean>>({});

  const startEdit = (s: any) => {
    setEditId(s.id);
    setEditData({ title: s.title, description: s.description || "", imageUrl: s.imageUrl || "", icon: s.icon || "", order: s.order || 0, isActive: s.isActive });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>إدارة الخدمات</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #c9a227, #f0d060)', color: '#000' }}
        >
          <Plus size={16} />
          إضافة خدمة
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="p-6 rounded-2xl border" style={{ borderColor: '#e5e5e5', background: '#fafafa' }}>
          <h3 className="font-bold mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>إضافة خدمة جديدة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {[
              { key: "title", label: "عنوان الخدمة", type: "text" },
              { key: "icon", label: "الأيقونة (إيموجي)", type: "text" },
              { key: "imageUrl", label: "رابط الصورة", type: "text" },
              { key: "order", label: "الترتيب", type: "number" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium mb-1" style={{ color: '#555' }}>{f.label}</label>
                <input
                  type={f.type}
                  value={String(newService[f.key as keyof typeof newService])}
                  onChange={(e) => setNewService((v) => ({ ...v, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ borderColor: '#e5e5e5', fontFamily: 'Cairo, sans-serif' }}
                />
              </div>
            ))}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" style={{ color: '#555' }}>الوصف</label>
            <textarea
              value={newService.description}
              onChange={(e) => setNewService((v) => ({ ...v, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border outline-none resize-none"
              style={{ borderColor: '#e5e5e5', fontFamily: 'Cairo, sans-serif' }}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => createService.mutate(newService)}
              disabled={!newService.title || createService.isPending}
              className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm"
              style={{ background: '#1a1a1a', color: '#c9a227' }}
            >
              <Save size={14} />
              حفظ
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm"
              style={{ background: '#f0f0f0', color: '#555' }}
            >
              <X size={14} />
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="space-y-4">
        {services?.map((s) => (
          <div
            key={s.id}
            className="p-5 rounded-2xl border"
            style={{ borderColor: '#e5e5e5', background: '#fff', opacity: s.isActive ? 1 : 0.6 }}
          >
            {editId === s.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { key: "title", label: "العنوان" },
                    { key: "icon", label: "الأيقونة" },
                    { key: "imageUrl", label: "رابط الصورة" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs font-medium mb-1" style={{ color: '#888' }}>{f.label}</label>
                      <input
                        type="text"
                        value={String(editData[f.key] || "")}
                        onChange={(e) => setEditData((v) => ({ ...v, [f.key]: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                        style={{ borderColor: '#e5e5e5', fontFamily: 'Cairo, sans-serif' }}
                      />
                    </div>
                  ))}
                </div>
                <textarea
                  value={String(editData.description || "")}
                  onChange={(e) => setEditData((v) => ({ ...v, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border outline-none resize-none text-sm"
                  style={{ borderColor: '#e5e5e5', fontFamily: 'Cairo, sans-serif' }}
                  placeholder="الوصف"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => updateService.mutate({ id: s.id, ...editData as any })}
                    className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-sm font-bold"
                    style={{ background: '#1a1a1a', color: '#c9a227' }}
                  >
                    <Save size={12} /> حفظ
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-sm"
                    style={{ background: '#f0f0f0', color: '#555' }}
                  >
                    <X size={12} /> إلغاء
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {s.imageUrl && (
                  <img src={s.imageUrl} alt={s.title} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{s.icon}</span>
                    <h3 className="font-bold truncate" style={{ fontFamily: 'Cairo, sans-serif' }}>{s.title}</h3>
                  </div>
                  <p className="text-sm truncate" style={{ color: '#888' }}>{s.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => updateService.mutate({ id: s.id, isActive: !s.isActive })}
                    className="p-2 rounded-lg transition-colors"
                    style={{ background: s.isActive ? 'rgba(201,162,39,0.1)' : '#f0f0f0', color: s.isActive ? '#c9a227' : '#999' }}
                    title={s.isActive ? "إخفاء" : "إظهار"}
                  >
                    {s.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={() => startEdit(s)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ background: 'rgba(26,26,26,0.08)', color: '#333' }}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => { if (confirm("هل أنت متأكد من حذف هذه الخدمة؟")) deleteService.mutate({ id: s.id }); }}
                    className="p-2 rounded-lg transition-colors"
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Slides Tab
function SlidesTab() {
  const { data: slides, refetch } = trpc.heroSlides.listAll.useQuery();
  const createSlide = trpc.heroSlides.create.useMutation({
    onSuccess: () => { toast.success("تم إضافة الشريحة"); refetch(); setShowAdd(false); setNewSlide({ title: "", subtitle: "", imageUrl: "", order: 0 }); },
    onError: () => toast.error("حدث خطأ"),
  });
  const updateSlide = trpc.heroSlides.update.useMutation({
    onSuccess: () => { toast.success("تم تحديث الشريحة"); refetch(); },
    onError: () => toast.error("حدث خطأ"),
  });
  const deleteSlide = trpc.heroSlides.delete.useMutation({
    onSuccess: () => { toast.success("تم حذف الشريحة"); refetch(); },
    onError: () => toast.error("حدث خطأ"),
  });

  const [showAdd, setShowAdd] = useState(false);
  const [newSlide, setNewSlide] = useState({ title: "", subtitle: "", imageUrl: "", order: 0 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>إدارة صور الهيدر</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #c9a227, #f0d060)', color: '#000' }}
        >
          <Plus size={16} />
          إضافة شريحة
        </button>
      </div>

      {showAdd && (
        <div className="p-6 rounded-2xl border" style={{ borderColor: '#e5e5e5', background: '#fafafa' }}>
          <h3 className="font-bold mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>إضافة شريحة جديدة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {[
              { key: "title", label: "العنوان" },
              { key: "subtitle", label: "النص الفرعي" },
              { key: "imageUrl", label: "رابط الصورة *" },
              { key: "order", label: "الترتيب", type: "number" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium mb-1" style={{ color: '#555' }}>{f.label}</label>
                <input
                  type={f.type || "text"}
                  value={String(newSlide[f.key as keyof typeof newSlide])}
                  onChange={(e) => setNewSlide((v) => ({ ...v, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ borderColor: '#e5e5e5', fontFamily: 'Cairo, sans-serif' }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => createSlide.mutate(newSlide)}
              disabled={!newSlide.imageUrl || createSlide.isPending}
              className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm"
              style={{ background: '#1a1a1a', color: '#c9a227' }}
            >
              <Save size={14} /> حفظ
            </button>
            <button onClick={() => setShowAdd(false)} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm" style={{ background: '#f0f0f0', color: '#555' }}>
              <X size={14} /> إلغاء
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slides?.map((slide) => (
          <div key={slide.id} className="rounded-2xl overflow-hidden border" style={{ borderColor: '#e5e5e5', background: '#fff' }}>
            <div className="relative h-40">
              <img src={slide.imageUrl} alt={slide.title || ""} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-end p-3">
                <div className="text-white">
                  <div className="font-bold text-sm">{slide.title}</div>
                  <div className="text-xs opacity-80">{slide.subtitle}</div>
                </div>
              </div>
              {!slide.isActive && (
                <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold" style={{ background: '#ef4444', color: '#fff' }}>مخفي</div>
              )}
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-xs" style={{ color: '#888' }}>الترتيب: {slide.order}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => updateSlide.mutate({ id: slide.id, isActive: !slide.isActive })}
                  className="p-1.5 rounded-lg"
                  style={{ background: slide.isActive ? 'rgba(201,162,39,0.1)' : '#f0f0f0', color: slide.isActive ? '#c9a227' : '#999' }}
                >
                  {slide.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  onClick={() => { if (confirm("حذف هذه الشريحة؟")) deleteSlide.mutate({ id: slide.id }); }}
                  className="p-1.5 rounded-lg"
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Messages Tab
function MessagesTab() {
  const { data: messages, refetch } = trpc.contact.list.useQuery();
  const markRead = trpc.contact.markRead.useMutation({
    onSuccess: () => refetch(),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>رسائل التواصل</h2>
        <button onClick={() => refetch()} className="p-2 rounded-lg" style={{ background: '#f0f0f0' }}>
          <RefreshCw size={16} />
        </button>
      </div>

      {messages?.length === 0 && (
        <div className="text-center py-12" style={{ color: '#888' }}>
          <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
          <p>لا توجد رسائل بعد</p>
        </div>
      )}

      <div className="space-y-4">
        {messages?.map((msg) => (
          <div
            key={msg.id}
            className="p-5 rounded-2xl border transition-all"
            style={{
              borderColor: msg.isRead ? '#e5e5e5' : '#c9a227',
              background: msg.isRead ? '#fff' : 'rgba(201,162,39,0.04)',
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>{msg.name}</span>
                  {!msg.isRead && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: '#c9a227', color: '#000' }}>جديد</span>
                  )}
                </div>
                {msg.phone && (
                  <a href={`tel:${msg.phone}`} className="text-sm block mb-1" style={{ color: '#c9a227' }}>
                    📞 {msg.phone}
                  </a>
                )}
                {msg.email && (
                  <div className="text-sm mb-2" style={{ color: '#888' }}>✉️ {msg.email}</div>
                )}
                <p className="text-sm leading-relaxed" style={{ color: '#555' }}>{msg.message}</p>
                <div className="text-xs mt-2" style={{ color: '#bbb' }}>
                  {new Date(msg.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {!msg.isRead && (
                <button
                  onClick={() => markRead.mutate({ id: msg.id })}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0"
                  style={{ background: '#1a1a1a', color: '#c9a227' }}
                >
                  تحديد كمقروء
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Admin Password Tab
function AdminPasswordTab() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const setAdminPassword = trpc.adminPassword.set.useMutation({
    onSuccess: () => {
      toast.success("تم تحديث كلمة المرور بنجاح");
      setPassword("");
      setConfirmPassword("");
    },
    onError: () => toast.error("حدث خطأ أثناء تحديث كلمة المرور"),
  });

  const handleSave = () => {
    if (!password.trim()) {
      toast.error("يرجى إدخال كلمة المرور");
      return;
    }
    if (password.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }
    setAdminPassword.mutate({ password });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>كلمة مرور لوحة التحكم</h2>
      </div>

      <div className="bg-blue-50 border rounded-xl p-4" style={{ borderColor: '#c9a227', background: '#fffbf0' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>كلمة المرور الحالية مشفرة وآمنة. يمكنك تغييرها من هنا.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#555' }}>كلمة المرور الجديدة</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="أدخل كلمة مرور جديدة (6 أحرف على الأقل)"
            className="w-full px-4 py-3 rounded-xl border outline-none transition-all"
            style={{ borderColor: '#e5e5e5', background: '#fafafa', fontFamily: 'Cairo, sans-serif' }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#555' }}>تأكيد كلمة المرور</label>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="أعد إدخال كلمة المرور"
            className="w-full px-4 py-3 rounded-xl border outline-none transition-all"
            style={{ borderColor: '#e5e5e5', background: '#fafafa', fontFamily: 'Cairo, sans-serif' }}
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="showPass"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="w-4 h-4 rounded"
            style={{ accentColor: '#c9a227' }}
          />
          <label htmlFor="showPass" className="text-sm" style={{ color: '#666' }}>عرض كلمة المرور</label>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={setAdminPassword.isPending}
        className="w-full px-5 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 disabled:opacity-50"
        style={{ background: 'linear-gradient(135deg, #c9a227, #f0d060)', color: '#000' }}
      >
        {setAdminPassword.isPending ? "جاري التحديث..." : "تحديث كلمة المرور"}
      </button>
    </div>
  );
}

// Seed Data
function SeedButton() {
  const seed = trpc.seed.init.useMutation({
    onSuccess: () => toast.success("تم تهيئة البيانات الافتراضية بنجاح! أعد تحميل الصفحة."),
    onError: () => toast.error("حدث خطأ أثناء التهيئة"),
  });
  return (
    <button
      onClick={() => { if (confirm("هل تريد تهيئة البيانات الافتراضية؟ سيتم إضافة الخدمات والإعدادات الأساسية.")) seed.mutate(); }}
      disabled={seed.isPending}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
      style={{ background: 'rgba(201,162,39,0.1)', color: '#a07820', border: '1px solid rgba(201,162,39,0.3)' }}
    >
      <RefreshCw size={14} className={seed.isPending ? "animate-spin" : ""} />
      {seed.isPending ? "جاري التهيئة..." : "تهيئة البيانات الافتراضية"}
    </button>
  );
}

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("settings");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8f5f0' }}>
        <div className="w-10 h-10 border-4 border-t-yellow-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8f5f0' }}>
        <div className="text-center p-10 rounded-3xl shadow-xl" style={{ background: '#fff', maxWidth: 400 }}>
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(201,162,39,0.1)' }}
          >
            <Settings size={36} style={{ color: '#c9a227' }} />
          </div>
          <h1 className="text-2xl font-black mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>لوحة التحكم</h1>
          <p className="mb-6" style={{ color: '#666' }}>يجب تسجيل الدخول للوصول إلى لوحة التحكم</p>
          <a
            href={getLoginUrl()}
            className="block w-full py-3 rounded-xl font-bold text-center transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #c9a227, #f0d060)', color: '#000' }}
          >
            تسجيل الدخول
          </a>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8f5f0' }}>
        <div className="text-center p-10 rounded-3xl shadow-xl" style={{ background: '#fff', maxWidth: 400 }}>
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-black mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>غير مصرح</h1>
          <p style={{ color: '#666' }}>ليس لديك صلاحية الوصول إلى لوحة التحكم</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "settings" as Tab, label: "الإعدادات", icon: <Settings size={18} /> },
    { id: "services" as Tab, label: "الخدمات", icon: <Layers size={18} /> },
    { id: "slides" as Tab, label: "صور الهيدر", icon: <Image size={18} /> },
    { id: "messages" as Tab, label: "الرسالل", icon: <MessageSquare size={18} /> },
    { id: "password" as Tab, label: "كلمة المرور", icon: <Lock size={18} /> },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: '#f8f5f0' }}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black" style={{ fontFamily: 'Cairo, sans-serif', color: '#1a1a1a' }}>
              لوحة التحكم
            </h1>
            <p className="text-sm mt-1" style={{ color: '#888' }}>
              مرحباً، {user?.name || "المدير"}
            </p>
          </div>
          <SeedButton />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap"
              style={{
                background: activeTab === tab.id ? 'linear-gradient(135deg, #c9a227, #f0d060)' : '#fff',
                color: activeTab === tab.id ? '#000' : '#555',
                boxShadow: activeTab === tab.id ? '0 4px 15px rgba(201,162,39,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          className="p-8 rounded-3xl shadow-lg"
          style={{ background: '#fff' }}
        >
          {activeTab === "settings" && <SettingsTab />}
          {activeTab === "services" && <ServicesTab />}
          {activeTab === "slides" && <SlidesTab />}
          {activeTab === "messages" && <MessagesTab />}
          {activeTab === "password" && <AdminPasswordTab />}
        </div>
      </div>
    </div>
  );
}
