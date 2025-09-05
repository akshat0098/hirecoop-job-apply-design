import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle, Upload, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  resume: File | null;
  coverLetter: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  resume?: string;
  coverLetter?: string;
}

export const CandidateForm = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    resume: null,
    coverLetter: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateField = (name: string, value: string | File | null): string | undefined => {
    switch (name) {
      case "fullName":
        return !value || (typeof value === "string" && value.trim().length < 2)
          ? "Full name must be at least 2 characters"
          : undefined;
      case "email":
        if (!value || typeof value !== "string") return "Email is required";
        return !validateEmail(value) ? "Please enter a valid email address" : undefined;
      case "phoneNumber":
        if (!value || typeof value !== "string") return "Phone number is required";
        return !validatePhoneNumber(value)
          ? "Please enter a valid phone number with country code"
          : undefined;
      case "resume":
        if (!value) return "Resume is required";
        if (value instanceof File) {
          if (value.size > 10 * 1024 * 1024) return "File size must be less than 10MB";
          const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
          ];
          return !allowedTypes.includes(value.type)
            ? "Only PDF and DOCX files are allowed"
            : undefined;
        }
        return undefined;
      default:
        return undefined;
    }
  };

  const handleInputChange = (name: keyof FormData, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleInputChange("resume", file);
  };

  const removeFile = () => {
    handleInputChange("resume", null);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    newErrors.fullName = validateField("fullName", formData.fullName);
    newErrors.email = validateField("email", formData.email);
    newErrors.phoneNumber = validateField("phoneNumber", formData.phoneNumber);
    newErrors.resume = validateField("resume", formData.resume);

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
      toast({
        title: "Application Submitted! 🎉",
        description: "Thank you for applying! Our team will review your application and contact you soon.",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const wordCount = formData.coverLetter.trim().split(/\s+/).filter(word => word.length > 0).length;
  const maxWords = 500;

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
        <Card className="w-full max-w-md text-center shadow-brand">
          <CardContent className="pt-12 pb-8">
            <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Application Submitted 🎉
            </h2>
            <p className="text-muted-foreground mb-6">
              Thank you for applying! Our team will review your application and contact you soon.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="w-full"
            >
              Submit Another Application
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <div className="max-w-2xl mx-auto py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <img 
            src="/lovable-uploads/04207b4c-5ef3-44db-b0a4-8d182b51e87b.png" 
            alt="Artizence" 
            className="h-12 mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Join Our Team
          </h1>
          <p className="text-xl text-muted-foreground">
            We&apos;re looking for talented individuals to help shape the future
          </p>
        </div>

        {/* Job Details */}
        <Card className="shadow-soft mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">Senior Frontend Developer</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Full-time</span>
                  <span>•</span>
                  <span>Remote / San Francisco, CA</span>
                  <span>•</span>
                  <span>$120,000 - $160,000</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="bg-gradient-primary text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Now Hiring
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">About the Role</h3>
              <p className="text-muted-foreground leading-relaxed">
                We&apos;re seeking a talented Senior Frontend Developer to join our innovative team at Artizence. 
                You&apos;ll be responsible for building cutting-edge user interfaces and creating exceptional 
                digital experiences that push the boundaries of what&apos;s possible on the web.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Key Responsibilities</h3>
              <ul className="text-muted-foreground space-y-2">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gradient-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Develop responsive, high-performance web applications using React, TypeScript, and modern frontend technologies
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gradient-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Collaborate with designers and backend developers to implement pixel-perfect user interfaces
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gradient-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Optimize applications for maximum speed and scalability across various devices and browsers
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gradient-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Mentor junior developers and contribute to code reviews and best practices
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">What We&apos;re Looking For</h3>
              <ul className="text-muted-foreground space-y-2">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gradient-secondary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  5+ years of experience in frontend development with React and TypeScript
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gradient-secondary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Strong understanding of modern CSS, responsive design, and web accessibility standards
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gradient-secondary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Experience with state management libraries (Redux, Zustand) and testing frameworks
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gradient-secondary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Excellent communication skills and ability to work in a collaborative environment
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-accent/10 to-primary/10 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Why Join Artizence?</h3>
              <p className="text-sm text-muted-foreground">
                Join a team that values innovation, creativity, and work-life balance. We offer competitive 
                compensation, comprehensive benefits, flexible work arrangements, and the opportunity to work 
                on exciting projects that make a real impact.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-brand">
          <CardHeader>
            <CardTitle className="text-2xl">Application Form</CardTitle>
            <CardDescription>
              Please fill out all required fields to submit your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="e.g., John Smith"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className={errors.fullName ? "border-destructive" : ""}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g., john.smith@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  placeholder="e.g., +1 (555) 123-4567"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  className={errors.phoneNumber ? "border-destructive" : ""}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-destructive">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Supporting Documents Section */}
              <div className="space-y-6 pt-6 border-t">
                <h3 className="text-lg font-semibold">Supporting Documents</h3>
                
                {/* Resume Upload */}
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume *</Label>
                  <div className="space-y-3">
                    {!formData.resume ? (
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload your resume (PDF or DOCX, max 10MB)
                        </p>
                        <Input
                          id="resume"
                          type="file"
                          accept=".pdf,.docx,.doc"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("resume")?.click()}
                        >
                          Choose File
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">{formData.resume.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(formData.resume.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeFile}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    {errors.resume && (
                      <p className="text-sm text-destructive">{errors.resume}</p>
                    )}
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="space-y-2">
                  <Label htmlFor="coverLetter">
                    Cover Letter{" "}
                    <span className="text-sm text-muted-foreground font-normal">
                      (optional but recommended)
                    </span>
                  </Label>
                  <Textarea
                    id="coverLetter"
                    placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                    className="min-h-[120px] resize-none"
                    value={formData.coverLetter}
                    onChange={(e) => handleInputChange("coverLetter", e.target.value)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>300-500 words recommended</span>
                    <span className={wordCount > maxWords ? "text-destructive" : ""}>
                      {wordCount}/{maxWords} words
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity h-12 text-lg font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  "Apply Now"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};