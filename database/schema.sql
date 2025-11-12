-- Create possible_events table
CREATE TABLE IF NOT EXISTS public.possible_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT possible_events_pkey PRIMARY KEY (id),
  CONSTRAINT possible_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Enable Row-Level Security
ALTER TABLE public.possible_events ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read all events
CREATE POLICY "Authenticated users can read all events"
  ON public.possible_events
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can create their own events
CREATE POLICY "Authenticated users can create their own events"
  ON public.possible_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Authenticated users can delete their own events
CREATE POLICY "Authenticated users can delete their own events"
  ON public.possible_events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_possible_events_user_id ON public.possible_events(user_id);
CREATE INDEX IF NOT EXISTS idx_possible_events_created_at ON public.possible_events(created_at DESC);

