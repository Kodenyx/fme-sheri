
-- Allow anonymous users to insert tool usage data
CREATE POLICY "Allow anonymous tool usage logging" 
  ON public.tool_usage 
  FOR INSERT 
  WITH CHECK (true);

-- Also allow reading tool usage data (for analytics)
CREATE POLICY "Allow reading tool usage data" 
  ON public.tool_usage 
  FOR SELECT 
  USING (true);
