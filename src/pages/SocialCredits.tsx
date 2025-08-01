
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Gift, CheckCircle, Clock, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUsageTracking } from "@/hooks/useUsageTracking";
import Navbar from "@/components/Navbar";

const SocialCredits = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const { toast } = useToast();
  const { email } = useUsageTracking();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select an image under 10MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `social-proofs/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('social-media-proofs')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('social-media-proofs')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "Image required",
        description: "Please upload a screenshot of your social media post",
        variant: "destructive",
      });
      return;
    }

    if (!email) {
      toast({
        title: "Email required",
        description: "Please use the tool first to register your email",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image
      const imageUrl = await uploadImage(selectedFile);

      // Submit for review
      const { error } = await supabase
        .from('social_media_credits')
        .insert({
          email: email,
          image_url: imageUrl,
          status: 'pending',
          credits_awarded: 0
        });

      if (error) throw error;

      toast({
        title: "Submission received!",
        description: "Your social media proof is under review. You'll get 15 bonus credits once approved!",
      });

      // Reset form
      setSelectedFile(null);
      setPreviewUrl("");
      loadSubmissions();

    } catch (error) {
      console.error('Error submitting proof:', error);
      toast({
        title: "Submission failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadSubmissions = async () => {
    if (!email) return;

    try {
      const { data, error } = await supabase
        .from('social_media_credits')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
  };

  React.useEffect(() => {
    loadSubmissions();
  }, [email]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <Navbar />
      
      <div className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#3B1E5E' }}>
              Earn <span style={{ color: '#E19013' }}>15 Bonus Credits</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto" style={{ color: '#3B1E5E' }}>
              Tag us on social media and get 15 extra email makeovers per month!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Submission Form */}
            <Card className="border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3" style={{ color: '#3B1E5E' }}>
                  <Gift className="w-6 h-6" style={{ color: '#E19013' }} />
                  Submit Your Proof
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#3B1E5E' }}>
                      How to earn credits:
                    </label>
                    <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm" style={{ color: '#3B1E5E' }}>
                      <p>1. Post about FixMyEmail on any social platform</p>
                      <p>2. Tag us or mention our tool</p>
                      <p>3. Upload a screenshot below</p>
                      <p>4. Get 15 bonus credits once approved!</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#3B1E5E' }}>
                      Upload Screenshot
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {previewUrl ? (
                        <div className="space-y-4">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="max-w-full h-32 object-contain mx-auto rounded"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setSelectedFile(null);
                              setPreviewUrl("");
                            }}
                          >
                            Choose Different Image
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-600 mb-4">Click to upload your screenshot</p>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="max-w-xs mx-auto"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !selectedFile}
                    className="w-full text-white font-bold text-lg py-3 rounded-full"
                    style={{ backgroundColor: '#E19013' }}
                  >
                    {isSubmitting ? "Submitting..." : "Submit for 15 Bonus Credits"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Submissions History */}
            <Card className="border-0 shadow-2xl">
              <CardHeader>
                <CardTitle style={{ color: '#3B1E5E' }}>Your Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                {submissions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No submissions yet</p>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <div key={submission.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(submission.status)}
                            <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(submission.status)}`}>
                              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(submission.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {submission.status === 'approved' && (
                          <p className="text-sm text-green-600 font-medium">
                            +15 bonus credits awarded!
                          </p>
                        )}
                        
                        {submission.status === 'rejected' && submission.notes && (
                          <p className="text-sm text-red-600">
                            Reason: {submission.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialCredits;
