import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FormStep1 } from "./FormStep1";
import { FormStep2 } from "./FormStep2";

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
  const [currentStep, setCurrentStep] = useState(1);
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

  const handleSubmit = async () => {
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

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

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
            {currentStep === 1 ? (
              <FormStep1
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
                onNext={handleNext}
              />
            ) : (
              <FormStep2
                formData={formData}
                errors={errors}
                isSubmitting={isSubmitting}
                onInputChange={handleInputChange}
                onFileUpload={handleFileUpload}
                onRemoveFile={removeFile}
                onSubmit={handleSubmit}
                onBack={handleBack}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};