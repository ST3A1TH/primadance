
-- Blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_ro TEXT NOT NULL DEFAULT '',
  title_ru TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL DEFAULT '',
  content_ro TEXT NOT NULL DEFAULT '',
  content_ru TEXT NOT NULL DEFAULT '',
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- SEO settings table
CREATE TABLE public.seo_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL UNIQUE,
  title_ro TEXT NOT NULL DEFAULT '',
  title_ru TEXT NOT NULL DEFAULT '',
  description_ro TEXT NOT NULL DEFAULT '',
  description_ru TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

-- Blog posts policies
CREATE POLICY "Anyone can read published posts" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Admins can do anything with posts" ON public.blog_posts FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- SEO settings policies
CREATE POLICY "Anyone can read SEO settings" ON public.seo_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update SEO settings" ON public.seo_settings FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert SEO settings" ON public.seo_settings FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Seed default SEO settings
INSERT INTO public.seo_settings (page_key, title_ro, title_ru, description_ro, description_ru) VALUES
('homepage', 'Prima Dance — Studio de Dans pentru Adulți în Chișinău', 'Prima Dance — Танцевальная Студия для Взрослых в Кишинёве', 'Studio de dans modern în Chișinău. Lecții de dans latin, ballroom și Pro-Am pentru adulți.', 'Современная танцевальная студия в Кишинёве. Латинские, бальные танцы и Pro-Am для взрослых.'),
('booking', 'Rezervare — Prima Dance Chișinău', 'Запись — Prima Dance Кишинёв', 'Rezervă-ți locul la cursurile de dans Prima Dance.', 'Запишитесь на занятия в Prima Dance.'),
('my-account', 'Contul Meu — Prima Dance', 'Мой аккаунт — Prima Dance', 'Verifică programările tale la Prima Dance.', 'Проверьте свои записи в Prima Dance.');

-- Gallery images table for admin-managed gallery
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read gallery images" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage gallery" ON public.gallery_images FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Storage bucket for admin uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);

-- Storage policies for gallery bucket
CREATE POLICY "Anyone can view gallery images" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Admins can upload gallery images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete gallery images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'::app_role));
