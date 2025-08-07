
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const TagTest = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [selectedTag, setSelectedTag] = useState("GHL_TAG_NAME");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  const tagOptions = [
    { value: "GHL_TAG_NAME", label: "Free User Tag" },
    { value: "GHL_PAID_TAG_NAME", label: "Paid User Tag" },
    { value: "GHL_REGULAR_TAG_NAME", label: "Regular Program Tag" },
    { value: "custom_tag", label: "Custom Tag (Direct)" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('Testing GHL contact addition with:', {
        email: email.trim(),
        firstName: firstName.trim() || undefined,
        tagName: selectedTag
      });

      const { data, error } = await supabase.functions.invoke('add-ghl-contact', {
        body: {
          email: email.trim(),
          firstName: firstName.trim() || undefined,
          tagName: selectedTag
        }
      });

      if (error) throw error;

      const result = {
        timestamp: new Date().toLocaleTimeString(),
        email: email.trim(),
        firstName: firstName.trim() || 'N/A',
        tagName: selectedTag,
        success: data.success,
        action: data.action,
        contactId: data.contactId,
        error: data.error
      };

      setResults(prev => [result, ...prev]);

      if (data.success) {
        toast({
          title: "Success!",
          description: `Contact ${data.action} with tag: ${selectedTag}`,
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Something went wrong",
          variant: "destructive",
        });
      }

    } catch (error: any) {
      console.error('Error testing GHL contact:', error);
      
      const result = {
        timestamp: new Date().toLocaleTimeString(),
        email: email.trim(),
        firstName: firstName.trim() || 'N/A',
        tagName: selectedTag,
        success: false,
        action: 'error',
        error: error.message
      };

      setResults(prev => [result, ...prev]);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-primary p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#3B1E5E' }}>
            GHL Tag Testing
          </h1>
          <p className="text-lg" style={{ color: '#3B1E5E' }}>
            Quickly test different tag scenarios with the GoHighLevel integration
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Test Form */}
          <Card className="border-0 shadow-2xl">
            <CardHeader>
              <CardTitle style={{ color: '#3B1E5E' }}>Test Contact Addition</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#3B1E5E' }}>
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="test@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#3B1E5E' }}>
                    First Name (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#3B1E5E' }}>
                    Tag to Test
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {tagOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSelectedTag(option.value)}
                        className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          selectedTag === option.value
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedTag === 'custom_tag' && (
                  <div>
                    <Input
                      type="text"
                      placeholder="Enter custom tag name"
                      value={selectedTag === 'custom_tag' ? '' : selectedTag}
                      onChange={(e) => setSelectedTag(e.target.value)}
                      className="w-full"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white font-bold py-3 rounded-lg"
                  style={{ backgroundColor: '#E19013' }}
                >
                  {isSubmitting ? "Testing..." : "Test GHL Contact Addition"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="border-0 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle style={{ color: '#3B1E5E' }}>Test Results</CardTitle>
              {results.length > 0 && (
                <Button
                  onClick={clearResults}
                  variant="outline"
                  size="sm"
                >
                  Clear
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No tests run yet. Submit the form to see results.
                </p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {results.map((result, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant={result.success ? "default" : "destructive"}>
                          {result.success ? "Success" : "Error"}
                        </Badge>
                        <span className="text-xs text-gray-500">{result.timestamp}</span>
                      </div>
                      
                      <div className="text-sm space-y-1">
                        <p><strong>Email:</strong> {result.email}</p>
                        <p><strong>Name:</strong> {result.firstName}</p>
                        <p><strong>Tag:</strong> {result.tagName}</p>
                        {result.success && (
                          <>
                            <p><strong>Action:</strong> {result.action}</p>
                            {result.contactId && (
                              <p><strong>Contact ID:</strong> {result.contactId}</p>
                            )}
                          </>
                        )}
                        {result.error && (
                          <p className="text-red-600"><strong>Error:</strong> {result.error}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm" style={{ color: '#3B1E5E' }}>
            This page directly calls the add-ghl-contact function to test different tag scenarios.
            Check the console and results above for detailed information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TagTest;
