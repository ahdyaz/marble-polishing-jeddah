import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, LogIn } from "lucide-react";

export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const { user, loading } = useAuth();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const verifyPassword = trpc.adminPassword.verify.useMutation({
    onSuccess: (result) => {
      if (result.verified) {
        toast.success(result.message);
        onSuccess();
      } else {
        toast.error(result.message);
        setPassword("");
      }
      setIsLoading(false);
    },
    onError: () => {
      toast.error("حدث خطأ في التحقق");
      setIsLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      toast.error("يرجى إدخال كلمة المرور");
      return;
    }
    setIsLoading(true);
    verifyPassword.mutate({ password });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f5f5f5' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#c9a227' }} />
          <p className="mt-4" style={{ color: '#666' }}>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f5f5f5' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Cairo, sans-serif', color: '#1a1a1a' }}>
            لوحة التحكم
          </h1>
          <p className="mb-6" style={{ color: '#666' }}>يرجى تسجيل الدخول أولاً</p>
          <a
            href={getLoginUrl()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #c9a227, #f0d060)', color: '#000' }}
          >
            <LogIn size={18} />
            تسجيل الدخول
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f5f5f5, #e8e8e8)' }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #c9a227, #f0d060)' }}>
              <Lock size={32} style={{ color: '#000' }} />
            </div>
          </div>

          <h1 className="text-2xl font-black text-center mb-2" style={{ fontFamily: 'Cairo, sans-serif', color: '#1a1a1a' }}>
            لوحة التحكم
          </h1>
          <p className="text-center mb-8" style={{ color: '#666', fontSize: '14px' }}>
            أدخل كلمة المرور للوصول إلى لوحة التحكم
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: '#333', fontFamily: 'Cairo, sans-serif' }}>
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="w-full px-5 py-3.5 pr-12 rounded-xl border-2 outline-none transition-all"
                  style={{
                    borderColor: password ? '#c9a227' : '#e5e5e5',
                    background: '#fafafa',
                    fontFamily: 'Cairo, sans-serif',
                  }}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full py-3.5 rounded-xl font-bold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #c9a227, #f0d060)', color: '#000' }}
            >
              <Lock size={20} />
              {isLoading ? "جاري التحقق..." : "الدخول"}
            </button>
          </form>

          <p className="text-center mt-6" style={{ color: '#999', fontSize: '12px' }}>
            كلمة المرور مشفرة وآمنة
          </p>
        </div>
      </div>
    </div>
  );
}
