import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getServices, getAllServices, createService, updateService, deleteService,
  getHeroSlides, getAllHeroSlides, createHeroSlide, updateHeroSlide, deleteHeroSlide,
  getSiteSettings, upsertSiteSetting, upsertManySettings,
  createContactMessage, getContactMessages, markMessageRead,
  getAdminPassword, setAdminPassword
} from "./db";
import { notifyOwner } from "./_core/notification";
import { createHash } from "crypto";

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Admin guard middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN', message: 'غير مصرح' });
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Services
  services: router({
    list: publicProcedure.query(() => getServices()),
    listAll: adminProcedure.query(() => getAllServices()),
    create: adminProcedure.input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      imageUrl: z.string().optional(),
      icon: z.string().optional(),
      order: z.number().optional(),
    })).mutation(({ input }) => createService(input)),
    update: adminProcedure.input(z.object({
      id: z.number(),
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      imageUrl: z.string().optional(),
      icon: z.string().optional(),
      order: z.number().optional(),
      isActive: z.boolean().optional(),
    })).mutation(({ input }) => {
      const { id, ...data } = input;
      return updateService(id, data);
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteService(input.id)),
  }),

  // Hero Slides
  heroSlides: router({
    list: publicProcedure.query(() => getHeroSlides()),
    listAll: adminProcedure.query(() => getAllHeroSlides()),
    create: adminProcedure.input(z.object({
      title: z.string().optional(),
      subtitle: z.string().optional(),
      imageUrl: z.string().min(1),
      order: z.number().optional(),
    })).mutation(({ input }) => createHeroSlide(input)),
    update: adminProcedure.input(z.object({
      id: z.number(),
      title: z.string().optional(),
      subtitle: z.string().optional(),
      imageUrl: z.string().optional(),
      order: z.number().optional(),
      isActive: z.boolean().optional(),
    })).mutation(({ input }) => {
      const { id, ...data } = input;
      return updateHeroSlide(id, data);
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteHeroSlide(input.id)),
  }),

  // Site Settings
  settings: router({
    getAll: publicProcedure.query(() => getSiteSettings()),
    update: adminProcedure.input(z.object({ key: z.string(), value: z.string(), label: z.string().optional() }))
      .mutation(({ input }) => upsertSiteSetting(input.key, input.value, input.label)),
    updateMany: adminProcedure.input(z.array(z.object({ key: z.string(), value: z.string(), label: z.string().optional() })))
      .mutation(({ input }) => upsertManySettings(input)),
  }),

  // Contact
  contact: router({
    send: publicProcedure.input(z.object({
      name: z.string().min(1),
      phone: z.string().optional(),
      email: z.string().email().optional(),
      message: z.string().min(1),
    })).mutation(async ({ input }) => {
      await createContactMessage(input);
      await notifyOwner({
        title: `رسالة جديدة من ${input.name}`,
        content: `الهاتف: ${input.phone || 'غير محدد'}\nالرسالة: ${input.message}`,
      });
      return { success: true };
    }),
    list: adminProcedure.query(() => getContactMessages()),
    markRead: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => markMessageRead(input.id)),
  }),

  // Admin Password Management
  adminPassword: router({
    verify: publicProcedure.input(z.object({ password: z.string() }))
      .mutation(async ({ input }) => {
        const stored = await getAdminPassword();
        if (!stored) return { verified: false, message: 'لم يتم تعيين كلمة مرور بعد' };
        const isValid = verifyPassword(input.password, stored.passwordHash);
        return { verified: isValid, message: isValid ? 'كلمة مرور صحيحة' : 'كلمة مرور خاطئة' };
      }),
    set: adminProcedure.input(z.object({ password: z.string().min(6) }))
      .mutation(async ({ input }) => {
        const hash = hashPassword(input.password);
        await setAdminPassword(hash);
        return { success: true, message: 'تم تحديث كلمة المرور بنجاح' };
      }),
  }),

  // Seed default data
  seed: router({
    init: adminProcedure.mutation(async () => {
      const defaultSettings = [
        { key: 'company_name', value: 'شركة جلي وتلميع الرخام بجدة', label: 'اسم الشركة' },
        { key: 'phone', value: '0575640550', label: 'رقم الهاتف' },
        { key: 'whatsapp', value: '0575640550', label: 'رقم الواتساب' },
        { key: 'address', value: 'جدة، المملكة العربية السعودية', label: 'العنوان' },
        { key: 'about_title', value: 'من نحن', label: 'عنوان صفحة من نحن' },
        { key: 'about_text', value: 'شركة متخصصة في جلي وتلميع الرخام بجدة منذ أكثر من 15 عاماً. نقدم خدمات احترافية عالية الجودة لتلميع وصيانة الرخام والحجر الطبيعي في المنازل والفلل والمجمعات التجارية. فريقنا المتخصص يستخدم أحدث التقنيات والمواد الاحترافية لضمان أفضل النتائج.', label: 'نص صفحة من نحن' },
        { key: 'hero_title', value: 'خبراء جلي وتلميع الرخام في جدة', label: 'عنوان الهيدر' },
        { key: 'hero_subtitle', value: 'نعيد لرخامك بريقه الأصلي بأحدث التقنيات وأفضل المواد الاحترافية', label: 'نص الهيدر الفرعي' },
        { key: 'footer_keywords', value: 'جلي رخام جدة، تلميع رخام جدة، جلي وتلميع الرخام، تلميع الرخام بالكريستال، جلي درج الرخام، جلي واجهات الحجر، عزل الرخام جدة، تلميع أرضيات الرخام، شركة جلي رخام جدة، خدمات الرخام جدة', label: 'كلمات مفتاحية الفوتر' },
        { key: 'map_lat', value: '21.5433', label: 'خط العرض للخريطة' },
        { key: 'map_lng', value: '39.1728', label: 'خط الطول للخريطة' },
      ];
      await upsertManySettings(defaultSettings);

      const defaultServices = [
        { title: 'تلميع الرخام بالكريستال', description: 'نستخدم تقنية الكريستال الاحترافية لتلميع الرخام وإعطائه لمعاناً استثنائياً يدوم طويلاً. هذه التقنية المتطورة تعمل على ملء المسام الدقيقة في الرخام وتعزيز صلابته.', imageUrl: '/manus-storage/marble-polishing-service_00315629.jpg', icon: '💎', order: 1 },
        { title: 'جلي درج الرخام', description: 'نقدم خدمة جلي وتلميع درج الرخام بأحدث الأجهزة والمواد المتخصصة، لإعادة بريق الدرج وإزالة الخدوش والبهتان مع الحفاظ على جماله وأناقته.', imageUrl: '/manus-storage/marble-staircase_a58df335.jpg', icon: '🏛️', order: 2 },
        { title: 'جلي واجهات الحجر والرخام', description: 'نتخصص في جلي وتلميع واجهات المباني المصنوعة من الحجر والرخام الطبيعي، مما يعيد لها مظهرها الأصلي الفاخر ويحميها من عوامل التعرية والتلوث.', imageUrl: '/manus-storage/stone-wall-polishing_6d4335f4.jpg', icon: '🏗️', order: 3 },
        { title: 'عزل الرخام', description: 'نوفر خدمة عزل الرخام باستخدام مواد عازلة عالية الجودة تحمي الرخام من البقع والرطوبة والتلف، مما يطيل عمره ويحافظ على جماله لسنوات طويلة.', imageUrl: '/manus-storage/marble-restoration_5b3c2d69.jpg', icon: '🛡️', order: 4 },
        { title: 'تلميع أرضيات الرخام', description: 'نقدم خدمة شاملة لتلميع أرضيات الرخام في المنازل والفلل والمجمعات التجارية، باستخدام أحدث ماكينات التلميع والمواد الاحترافية لنتائج مبهرة.', imageUrl: '/manus-storage/marble-floor-polished_f9583f11.jpg', icon: '✨', order: 5 },
        { title: 'صيانة وترميم الرخام', description: 'نقدم خدمات متكاملة لصيانة وترميم الرخام التالف، بما يشمل إصلاح الكسور والشقوق وإزالة البقع الصعبة وإعادة الرخام إلى حالته الأصلية.', imageUrl: '/manus-storage/marble-polishing-restoration_5396d381.jpg', icon: '🔧', order: 6 },
      ];
      for (const s of defaultServices) {
        await createService(s);
      }

      const defaultSlides = [
        { title: 'خبراء جلي وتلميع الرخام في جدة', subtitle: 'نعيد لرخامك بريقه الأصلي بأحدث التقنيات', imageUrl: '/manus-storage/marble-floor-polished_f9583f11.jpg', order: 1 },
        { title: 'تلميع الرخام بالكريستال', subtitle: 'لمعان استثنائي يدوم طويلاً', imageUrl: '/manus-storage/marble-hallway_990da899.jpg', order: 2 },
        { title: 'جلي واجهات الحجر والرخام', subtitle: 'نعيد الفخامة لواجهات مبانيكم', imageUrl: '/manus-storage/luxury-marble-floor_b7df12d0.jpg', order: 3 },
      ];
      for (const slide of defaultSlides) {
        await createHeroSlide(slide);
      }

      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
