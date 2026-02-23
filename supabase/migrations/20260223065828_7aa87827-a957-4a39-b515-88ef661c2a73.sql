
-- People pins on the map
CREATE TABLE public.people (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('boy', 'girl')),
  area TEXT NOT NULL,
  quote TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  real_votes INTEGER NOT NULL DEFAULT 0,
  fake_votes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public read/update (no auth required for this fun app)
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view people" ON public.people FOR SELECT USING (true);
CREATE POLICY "Anyone can update votes" ON public.people FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can insert people" ON public.people FOR INSERT WITH CHECK (true);
