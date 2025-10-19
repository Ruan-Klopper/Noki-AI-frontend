"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthLayout } from "@/components/auth/auth-layout"
import { Check, Eye, EyeOff } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Step 1: Terms
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // Step 2: Email & Password
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [selectedLMS, setSelectedLMS] = useState<string | null>(null)
  const [skipLMS, setSkipLMS] = useState(false)

  // Step 4: Canvas Setup (previously step 3)
  const [institutionUrl, setInstitutionUrl] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionTested, setConnectionTested] = useState(false)
  const [userProfile, setUserProfile] = useState<{ name: string; email: string } | null>(null)
  const [syncingData, setSyncingData] = useState(false)

  // Step 5: Preferences (previously step 4)
  const [emailReminders, setEmailReminders] = useState(true)

  const handleNext = async () => {
    if (step === 1 && !agreedToTerms) return
    if (step === 2 && (!email || !password || password !== confirmPassword)) return
    if (step === 3 && !selectedLMS && !skipLMS) return
    if (step === 4 && !skipLMS && !connectionTested) return

    if (step === 3 && skipLMS) {
      setStep(5) // Jump to preferences
      return
    }

    if (step === 4) {
      // Sync data
      setSyncingData(true)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setSyncingData(false)
    }

    if (step < 5) {
      setStep(step + 1)
    } else {
      // Complete signup
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/dashboard")
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      if (step === 5 && skipLMS) {
        setStep(3) // Go back to LMS selection
      } else {
        setStep(step - 1)
      }
    }
  }

  const handleTestConnection = async () => {
    setTestingConnection(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setUserProfile({
      name: "John Doe",
      email: "john.doe@university.edu",
    })
    setConnectionTested(true)
    setTestingConnection(false)
  }

  const handleGoogleSignUp = () => {
    // Implement Google OAuth flow
    console.log("Sign up with Google")
  }

  return (
    <AuthLayout>
      <div className={`w-full ${step === 3 || step === 4 ? "max-w-2xl" : "max-w-sm"}`}>
        <div
          key={step}
          className="bg-card rounded-2xl shadow-xl p-8 relative pb-28 animate-in fade-in zoom-in duration-300"
        >
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s === step ? "w-8 bg-noki-primary" : s < step ? "w-2 bg-noki-primary" : "w-2 bg-border"
                }`}
              />
            ))}
          </div>

          {/* Step 1: Terms and Conditions */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-poppins font-bold text-foreground mb-2">Welcome to Noki</h1>
                <p className="text-muted-foreground font-roboto">Let's get you set up</p>
              </div>

              <div className="bg-secondary rounded-xl p-6 border border-border">
                <h2 className="text-xl font-poppins font-semibold text-foreground mb-4">Terms and Conditions</h2>
                <div className="h-64 overflow-y-auto text-sm font-roboto text-muted-foreground space-y-4 mb-6">
                  <p>
                    Welcome to Noki. By using our service, you agree to these terms. Please read them carefully before
                    proceeding.
                  </p>
                  <p>
                    <strong>1. Acceptance of Terms</strong>
                    <br />
                    By accessing and using Noki, you accept and agree to be bound by the terms and provision of this
                    agreement.
                  </p>
                  <p>
                    <strong>2. Use License</strong>
                    <br />
                    Permission is granted to temporarily use Noki for personal, non-commercial transitory viewing only.
                  </p>
                  <p>
                    <strong>3. Privacy Policy</strong>
                    <br />
                    Your privacy is important to us. We collect and use your data in accordance with our Privacy Policy.
                  </p>
                  <p>
                    <strong>4. User Responsibilities</strong>
                    <br />
                    You are responsible for maintaining the confidentiality of your account and password.
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
                <h1 className="text-3xl font-poppins font-bold text-foreground mb-2">Create your account</h1>
                <p className="text-muted-foreground font-roboto">Enter your email and password</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-roboto font-medium text-foreground mb-2">
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
                  <label htmlFor="password" className="block text-sm font-roboto font-medium text-foreground mb-2">
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
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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

                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-sm text-red-500 font-roboto">Passwords do not match</p>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground font-roboto">Or continue with</span>
                  </div>
                </div>

                <button
                  onClick={handleGoogleSignUp}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground font-roboto font-medium hover:bg-muted transition-colors flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign up with Google
                </button>
              </div>
            </div>
          )}

          {/* Step 3: LMS Selection */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-poppins font-bold text-foreground mb-2">Link your LMS</h1>
                <p className="text-muted-foreground font-roboto">
                  Connect your learning management system to sync your courses
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                {/* Canvas LMS Option */}
                <button
                  onClick={() => {
                    setSelectedLMS("canvas")
                    setSkipLMS(false)
                  }}
                  className={`w-full p-6 rounded-xl border-2 transition-all ${
                    selectedLMS === "canvas"
                      ? "border-noki-primary bg-noki-primary/10"
                      : "border-border bg-card hover:border-muted"
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-poppins font-bold text-lg">Canvas</span>
                    </div>
                    <div className="text-center">
                      <h3 className="font-poppins font-semibold text-foreground">Canvas LMS</h3>
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
                      <span className="text-white font-poppins font-bold text-lg">GC</span>
                    </div>
                    <div className="text-center">
                      <h3 className="font-poppins font-semibold text-foreground">Google Classroom</h3>
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
                      setSkipLMS(e.target.checked)
                      if (e.target.checked) {
                        setSelectedLMS(null)
                      }
                    }}
                    className="w-5 h-5 rounded border-border text-noki-primary focus:ring-noki-primary"
                  />
                  <span className="text-sm text-foreground font-roboto">I don't want to link an LMS right now</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Canvas Setup */}
          {step === 4 && !skipLMS && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-poppins font-bold text-foreground mb-2">Connect Canvas LMS</h1>
                <p className="text-muted-foreground font-roboto">
                  Link your Canvas account to sync your courses and assignments
                </p>
              </div>

              <div className="bg-secondary rounded-xl h-48 flex items-center justify-center">
                <span className="text-muted-foreground font-roboto">Canvas Setup Demo Image</span>
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
                    Your Canvas institution URL (e.g., university.instructure.com)
                  </p>
                </div>

                <div>
                  <label htmlFor="accessToken" className="block text-sm font-roboto font-medium text-foreground mb-2">
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
                    disabled={!institutionUrl || !accessToken || testingConnection}
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
                        <h3 className="font-roboto font-semibold text-gray-800 mb-1">Connection Successful!</h3>
                        <p className="text-sm text-gray-600 font-roboto">
                          Welcome, <strong className="text-foreground">{userProfile.name}</strong>
                        </p>
                        <p className="text-sm text-gray-600 font-roboto">{userProfile.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {syncingData && (
                  <div className="bg-secondary border border-border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-noki-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-foreground font-roboto">Syncing your data with Noki...</p>
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
                <h1 className="text-3xl font-poppins font-bold text-foreground mb-2">Customize your experience</h1>
                <p className="text-muted-foreground font-roboto">Set your preferences</p>
              </div>

              <div className="space-y-4">
                <div className="bg-secondary rounded-xl p-6 border border-border">
                  <h3 className="font-poppins font-semibold text-foreground mb-4">Notifications</h3>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-roboto font-medium text-foreground">Email Reminders</p>
                      <p className="text-sm text-muted-foreground font-roboto pr-2.5">
                        Receive email notifications for upcoming assignments and deadlines
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
              {step > 1 ? (
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
              ) : step === 3 ? (
                <button
                  onClick={handleNext}
                  disabled={!selectedLMS && !skipLMS}
                  className="px-6 py-2.5 rounded-lg bg-noki-primary text-white font-roboto font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={isLoading || syncingData}
                  className="px-6 py-2.5 rounded-lg bg-noki-primary text-white font-roboto font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading || syncingData ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {syncingData ? "Syncing..." : "Loading..."}
                    </>
                  ) : step === 5 ? (
                    "Complete Setup"
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
  )
}
