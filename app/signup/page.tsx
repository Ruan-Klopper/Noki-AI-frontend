"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Check, Eye, EyeOff } from "lucide-react";
import { useAuthContext } from "@/services/auth/auth-context";
import "@/styles/google-signin.css";

export default function SignUpPage() {
  const router = useRouter();
  const {
    register,
    googleAuth,
    isLoading,
    initializeGoogleAuth,
    googleLoading,
    renderGoogleButton,
  } = useAuthContext();
  const [step, setStep] = useState(1);

  // Handle URL step parameter for Google Sign-In redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const stepParam = urlParams.get("step");
    if (stepParam && !isNaN(Number(stepParam))) {
      const stepNumber = Number(stepParam);
      if (stepNumber >= 1 && stepNumber <= 5) {
        setStep(stepNumber);
        // Clean up URL
        window.history.replaceState({}, "", "/signup");
      }
    }
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Initialize Google Auth and render button on component mount
  useEffect(() => {
    const initAndRender = async () => {
      try {
        await initializeGoogleAuth();
        // Render the Google Sign-In button after initialization
        renderGoogleButton("google-signup-button", {
          theme: "outline",
          size: "large",
          text: "signup_with",
          shape: "pill",
          logo_alignment: "center",
          width: 320,
        });

        // Apply custom styling after button renders
        setTimeout(() => {
          const googleButton = document.querySelector(
            "#google-signup-button iframe"
          );
          if (googleButton) {
            // Add custom classes or styles
            (googleButton as HTMLElement).style.borderRadius = "12px";
            (googleButton as HTMLElement).style.boxShadow =
              "0 4px 12px rgba(0, 0, 0, 0.15)";
            (googleButton as HTMLElement).style.transition = "all 0.3s ease";
          }
        }, 100);
      } catch (error) {
        console.error("Failed to initialize Google Auth:", error);
      }
    };

    initAndRender();
  }, [initializeGoogleAuth, renderGoogleButton]);

  // Step 1: Terms
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Step 2: Personal Info & Password
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [selectedLMS, setSelectedLMS] = useState<string | null>(null);
  const [skipLMS, setSkipLMS] = useState(false);

  // Step 4: Canvas Setup (previously step 3)
  const [institutionUrl, setInstitutionUrl] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionTested, setConnectionTested] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [syncingData, setSyncingData] = useState(false);

  // Step 5: Preferences (previously step 4)
  const [emailReminders, setEmailReminders] = useState(true);

  const handleNext = async () => {
    // Step 1: Terms validation
    if (step === 1 && !agreedToTerms) return;

    // Step 2: Personal info and password validation + Registration
    if (step === 2) {
      if (!firstname || !lastname || !email || !password || !confirmPassword) {
        setError("Please fill in all fields");
        return;
      }
      if (firstname.trim().length < 2) {
        setError("First name must be at least 2 characters long");
        return;
      }
      if (lastname.trim().length < 2) {
        setError("Last name must be at least 2 characters long");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters long");
        return;
      }

      // Clear any previous errors and proceed with registration
      setError("");
      await handleEmailSignUp();
      return; // Don't proceed to next step, handleEmailSignUp will handle navigation
    }

    // Step 3: LMS selection validation
    if (step === 3 && !selectedLMS && !skipLMS) return;

    // Step 4: Canvas connection validation
    if (step === 4 && !skipLMS && !connectionTested) return;

    // Handle LMS skip - jump to preferences
    if (step === 3 && skipLMS) {
      setStep(5); // Jump to preferences
      return;
    }

    // Handle Canvas data sync
    if (step === 4) {
      // Sync data
      setSyncingData(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSyncingData(false);
    }

    // Navigate to next step
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Complete setup (no registration needed here anymore)
      router.push("/dashboard");
    }
  };

  const handleEmailSignUp = async () => {
    setError("");
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const response = await register({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.toLowerCase(),
        password,
      });

      if (response.success) {
        setSuccess(true);
        // Show success message for 2 seconds before proceeding to step 3
        setTimeout(() => {
          setStep(3);
          setSuccess(false); // Clear success message
        }, 2000);
      } else {
        setError(response.message || "Sign up failed");
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      // Handle backend error responses directly
      if (error.message) {
        setError(error.message);
      } else {
        setError("An error occurred during sign up");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      if (step === 5 && skipLMS) {
        setStep(3); // Go back to LMS selection
      } else {
        setStep(step - 1);
      }
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setUserProfile({
      name: "John Doe",
      email: "john.doe@university.edu",
    });
    setConnectionTested(true);
    setTestingConnection(false);
  };

  return (
    <AuthLayout>
      <div
        className={`w-full ${
          step === 3 || step === 4 ? "max-w-2xl" : "max-w-sm"
        }`}
      >
        <div
          key={step}
          className="bg-card rounded-2xl shadow-xl p-8 relative pb-28 animate-in fade-in zoom-in duration-300"
        >
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s === step
                    ? "w-8 bg-noki-primary"
                    : s < step
                    ? "w-2 bg-noki-primary"
                    : "w-2 bg-border"
                }`}
              />
            ))}
          </div>

          {/* Step 1: Terms and Conditions */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-poppins font-bold text-foreground mb-2">
                  Welcome to Noki
                </h1>
                <p className="text-muted-foreground font-roboto">
                  Let's get you set up
                </p>
              </div>

              <div className="bg-secondary rounded-xl p-6 border border-border">
                <h2 className="text-xl font-poppins font-semibold text-foreground mb-4">
                  Terms and Conditions
                </h2>
                <div className="h-64 overflow-y-auto text-sm font-roboto text-muted-foreground space-y-4 mb-6">
                  <p>
                    Welcome to Noki. By using our service, you agree to these
                    terms. Please read them carefully before proceeding.
                  </p>
                  <p>
                    <strong>1. Acceptance of Terms</strong>
                    <br />
                    By accessing and using Noki, you accept and agree to be
                    bound by the terms and provision of this agreement.
                  </p>
                  <p>
                    <strong>2. Use License</strong>
                    <br />
                    Permission is granted to temporarily use Noki for personal,
                    non-commercial transitory viewing only.
                  </p>
                  <p>
                    <strong>3. Privacy Policy</strong>
                    <br />
                    Your privacy is important to us. We collect and use your
                    data in accordance with our Privacy Policy.
                  </p>
                  <p>
                    <strong>4. User Responsibilities</strong>
                    <br />
                    You are responsible for maintaining the confidentiality of
                    your account and password.
                  </p>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <div className="relative flex items-center justify-center mt-1">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="w-5 h-5 rounded border-border text-noki-primary focus:ring-noki-primary"
                    />
                  </div>
                  <span className="text-sm font-roboto text-foreground">
                    I have read and agree to the Terms and Conditions
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Email & Password */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-poppins font-bold text-foreground mb-2">
                  Create your account
                </h1>
                <p className="text-muted-foreground font-roboto">
                  Enter your email and password
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-roboto font-semibold text-red-800 mb-1">
                        Validation Error
                      </h3>
                      <p className="text-sm text-red-600 font-roboto">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstname"
                      className="block text-sm font-roboto font-medium text-foreground mb-2"
                    >
                      First Name
                    </label>
                    <input
                      id="firstname"
                      type="text"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary font-roboto"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastname"
                      className="block text-sm font-roboto font-medium text-foreground mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastname"
                      type="text"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary font-roboto"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-roboto font-medium text-foreground mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary font-roboto"
                    placeholder="student@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-roboto font-medium text-foreground mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary font-roboto pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-roboto font-medium text-foreground mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary font-roboto"
                    placeholder="••••••••"
                  />
                </div>

                {/* Password validation feedback */}
                {password && (
                  <div className="space-y-1">
                    {password.length < 8 && (
                      <p className="text-sm text-red-500 font-roboto">
                        Password must be at least 8 characters long
                      </p>
                    )}
                    {password.length >= 8 && (
                      <p className="text-sm text-green-500 font-roboto">
                        ✓ Password length is good
                      </p>
                    )}
                  </div>
                )}

                {password &&
                  confirmPassword &&
                  password !== confirmPassword && (
                    <p className="text-sm text-red-500 font-roboto">
                      Passwords do not match
                    </p>
                  )}

                {password &&
                  confirmPassword &&
                  password === confirmPassword &&
                  password.length >= 8 && (
                    <p className="text-sm text-green-500 font-roboto">
                      ✓ Passwords match
                    </p>
                  )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground font-roboto">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Sign-Up Button Container */}
                <div className="w-full">
                  {googleLoading ? (
                    <div className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground font-roboto font-medium flex items-center justify-center gap-3 opacity-50">
                      <div className="w-5 h-5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                      Signing up with Google...
                    </div>
                  ) : (
                    <div
                      id="google-signup-button"
                      className="w-full flex items-center justify-center google-signin-container"
                    ></div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: LMS Selection */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-poppins font-bold text-foreground mb-2">
                  Link your LMS
                </h1>
                <p className="text-muted-foreground font-roboto">
                  Connect your learning management system to sync your courses
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                {/* Canvas LMS Option */}
                <button
                  onClick={() => {
                    setSelectedLMS("canvas");
                    setSkipLMS(false);
                  }}
                  className={`w-full p-6 rounded-xl border-2 transition-all ${
                    selectedLMS === "canvas"
                      ? "border-noki-primary bg-noki-primary/10"
                      : "border-border bg-card hover:border-muted"
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-poppins font-bold text-lg">
                        Canvas
                      </span>
                    </div>
                    <div className="text-center">
                      <h3 className="font-poppins font-semibold text-foreground">
                        Canvas LMS
                      </h3>
                      <p className="text-xs text-muted-foreground font-roboto mt-1">
                        Sync your courses, assignments, and grades
                      </p>
                    </div>
                  </div>
                </button>

                {/* Google Classroom Option - Coming Soon */}
                <button
                  disabled
                  className="w-full p-6 rounded-xl border-2 border-border bg-secondary opacity-60 cursor-not-allowed relative"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-poppins font-bold text-lg">
                        GC
                      </span>
                    </div>
                    <div className="text-center">
                      <h3 className="font-poppins font-semibold text-foreground">
                        Google Classroom
                      </h3>
                      <p className="text-xs text-muted-foreground font-roboto mt-1">
                        Sync your classes and assignments
                      </p>
                      <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-roboto font-medium rounded-full">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </button>

                <label className="flex items-center gap-3 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    checked={skipLMS}
                    onChange={(e) => {
                      setSkipLMS(e.target.checked);
                      if (e.target.checked) {
                        setSelectedLMS(null);
                      }
                    }}
                    className="w-5 h-5 rounded border-border text-noki-primary focus:ring-noki-primary"
                  />
                  <span className="text-sm text-foreground font-roboto">
                    I don't want to link an LMS right now
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Canvas Setup */}
          {step === 4 && !skipLMS && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-poppins font-bold text-foreground mb-2">
                  Connect Canvas LMS
                </h1>
                <p className="text-muted-foreground font-roboto">
                  Link your Canvas account to sync your courses and assignments
                </p>
              </div>

              <div className="bg-secondary rounded-xl h-48 flex items-center justify-center">
                <span className="text-muted-foreground font-roboto">
                  Canvas Setup Demo Image
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="institutionUrl"
                    className="block text-sm font-roboto font-medium text-foreground mb-2"
                  >
                    Institution URL
                  </label>
                  <input
                    id="institutionUrl"
                    type="url"
                    value={institutionUrl}
                    onChange={(e) => setInstitutionUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary font-roboto"
                    placeholder="https://university.instructure.com"
                  />
                  <p className="text-xs text-muted-foreground font-roboto mt-1">
                    Your Canvas institution URL (e.g.,
                    university.instructure.com)
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="accessToken"
                    className="block text-sm font-roboto font-medium text-foreground mb-2"
                  >
                    Access Token
                  </label>
                  <input
                    id="accessToken"
                    type="password"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-noki-primary font-roboto font-mono"
                    placeholder="••••••••••••••••••••"
                  />
                  <p className="text-xs text-muted-foreground font-roboto mt-1">
                    Generate an access token from your Canvas account settings
                  </p>
                </div>

                {!connectionTested && (
                  <button
                    onClick={handleTestConnection}
                    disabled={
                      !institutionUrl || !accessToken || testingConnection
                    }
                    className="w-full px-4 py-3 rounded-lg bg-noki-primary text-white font-roboto font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {testingConnection ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Testing Connection...
                      </>
                    ) : (
                      "Test Connection"
                    )}
                  </button>
                )}

                {connectionTested && userProfile && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-roboto font-semibold text-gray-800 mb-1">
                          Connection Successful!
                        </h3>
                        <p className="text-sm text-gray-600 font-roboto">
                          Welcome,{" "}
                          <strong className="text-foreground">
                            {userProfile.name}
                          </strong>
                        </p>
                        <p className="text-sm text-gray-600 font-roboto">
                          {userProfile.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {syncingData && (
                  <div className="bg-secondary border border-border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-noki-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-foreground font-roboto">
                        Syncing your data with Noki...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: User Preferences */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-poppins font-bold text-foreground mb-2">
                  Customize your experience
                </h1>
                <p className="text-muted-foreground font-roboto">
                  Set your preferences
                </p>
              </div>

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-roboto font-semibold text-green-800 mb-1">
                        Account Created & Logged In!
                      </h3>
                      <p className="text-sm text-green-600 font-roboto">
                        Welcome to Noki! You're now logged in. Proceeding to LMS
                        setup...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-roboto font-semibold text-red-800 mb-1">
                        Registration Failed
                      </h3>
                      <p className="text-sm text-red-600 font-roboto mb-3">
                        {error}
                      </p>
                      <button
                        onClick={() => {
                          setError("");
                          handleEmailSignUp();
                        }}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-roboto font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Retrying..." : "Try Again"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="bg-secondary rounded-xl p-6 border border-border">
                  <h3 className="font-poppins font-semibold text-foreground mb-4">
                    Notifications
                  </h3>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-roboto font-medium text-foreground">
                        Email Reminders
                      </p>
                      <p className="text-sm text-muted-foreground font-roboto pr-2.5">
                        Receive email notifications for upcoming assignments and
                        deadlines
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailReminders}
                      onChange={(e) => setEmailReminders(e.target.checked)}
                      className="w-5 h-5 rounded border-border text-noki-primary focus:ring-noki-primary"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Button group inside the card, fixed to bottom of card */}
          <div className="absolute bottom-0 left-0 right-0 bg-secondary border-t border-border rounded-b-2xl p-4">
            <div className="flex items-center justify-between gap-4">
              {step > 1 && step <= 2 ? (
                <button
                  onClick={handlePrevious}
                  className="px-6 py-2.5 rounded-lg border border-border text-foreground font-roboto font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
              ) : (
                <div />
              )}

              {step === 1 ? (
                <button
                  onClick={() => agreedToTerms && handleNext()}
                  disabled={!agreedToTerms}
                  className="px-6 py-2.5 rounded-lg bg-noki-primary text-white font-roboto font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Agree & Continue
                </button>
              ) : step === 2 ? (
                <button
                  onClick={handleNext}
                  disabled={
                    !firstname ||
                    !lastname ||
                    !email ||
                    !password ||
                    !confirmPassword ||
                    password !== confirmPassword ||
                    password.length < 8 ||
                    isSubmitting
                  }
                  className="px-6 py-2.5 rounded-lg bg-noki-primary text-white font-roboto font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              ) : step === 3 ? (
                <button
                  onClick={handleNext}
                  disabled={!selectedLMS && !skipLMS}
                  className="px-6 py-2.5 rounded-lg bg-noki-primary text-white font-roboto font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : step === 4 ? (
                <button
                  onClick={handleNext}
                  disabled={!skipLMS && !connectionTested}
                  className="px-6 py-2.5 rounded-lg bg-noki-primary text-white font-roboto font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={
                    isSubmitting ||
                    isLoading ||
                    syncingData ||
                    (step === 5 && !!error && !success)
                  }
                  className="px-6 py-2.5 rounded-lg bg-noki-primary text-white font-roboto font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting || isLoading || syncingData ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {syncingData ? "Syncing..." : "Loading..."}
                    </>
                  ) : step === 5 ? (
                    "Go to Dashboard"
                  ) : (
                    "Next"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
