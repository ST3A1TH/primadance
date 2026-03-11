
CREATE TABLE public.faqs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_ro text NOT NULL DEFAULT '',
  question_ru text NOT NULL DEFAULT '',
  answer_ro text NOT NULL DEFAULT '',
  answer_ru text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published FAQs" ON public.faqs
  FOR SELECT TO public USING (published = true);

CREATE POLICY "Admins can do anything with FAQs" ON public.faqs
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
