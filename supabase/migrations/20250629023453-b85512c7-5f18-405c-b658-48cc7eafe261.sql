
-- Create a table to capture tool usage analytics
CREATE TABLE public.tool_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  email_address TEXT NOT NULL,
  original_email TEXT NOT NULL,
  transformed_email TEXT NOT NULL,
  email_category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) 
ALTER TABLE public.tool_usage ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view their own usage data
CREATE POLICY "Users can view their own usage data" 
  ON public.tool_usage 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to insert their own usage data
CREATE POLICY "Users can create their own usage data" 
  ON public.tool_usage 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_tool_usage_user_id ON public.tool_usage(user_id);
CREATE INDEX idx_tool_usage_created_at ON public.tool_usage(created_at);
