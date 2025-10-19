"use client"

import { useState } from "react"
import { NokiCard } from "@/components/global/noki-card"
import {
  User,
  Mail,
  Shield,
  GraduationCap,
  RefreshCw,
  Trash2,
  LogOut,
  Zap,
  TrendingUp,
  Crown,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Eye,
  EyeOff,
  Edit2,
  Link,
} from "lucide-react"

export default function SettingsPage() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showAccountDeleteConfirm, setShowAccountDeleteConfirm] = useState(false)
  const [showToken, setShowToken] = useState(false)
  const [isEditingToken, setIsEditingToken] = useState(false)
  const [canvasToken, setCanvasToken] = useState("1234~abcdefghijklmnopqrstuvwxyz1234567890")
  const [canvasUrl, setCanvasUrl] = useState("https://canvas.institution.edu")
  const [tempToken, setTempToken] = useState(canvasToken)

  const handleSync = () => {
    setIsSyncing(true)
    // Simulate sync
    setTimeout(() => {
      setIsSyncing(false)
    }, 2000)
  }

  const handleDeleteCanvasData = () => {
    setShowDeleteConfirm(false)
    // Handle delete canvas data
  }

  const handleDeleteAccount = () => {
    setShowAccountDeleteConfirm(false)
    // Handle account deletion
  }

  const handleSaveToken = () => {
    setCanvasToken(tempToken)
    setIsEditingToken(false)
    // Here you would typically make an API call to update the token
  }

  const handleCancelEdit = () => {
    setTempToken(canvasToken)
    setIsEditingToken(false)
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-poppins font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account and preferences</p>
      </div>

      {/* Personal Information */}
      <NokiCard>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-noki-primary/10 rounded-xl flex items-center justify-center">
              <User className="text-noki-primary" size={20} />
            </div>
            <h2 className="text-xl font-poppins font-semibold text-foreground">Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <div className="bg-secondary p-3 rounded-lg">
                <p className="text-foreground font-medium">Ruan Student</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email Address</label>
              <div className="bg-secondary p-3 rounded-lg flex items-center gap-2">
                <Mail size={16} className="text-muted-foreground" />
                <p className="text-foreground font-medium">student@example.com</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Student ID</label>
              <div className="bg-secondary p-3 rounded-lg">
                <p className="text-foreground font-medium">STU123456</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Account Type</label>
              <div className="bg-secondary p-3 rounded-lg flex items-center gap-2">
                <Shield size={16} className="text-muted-foreground" />
                <p className="text-foreground font-medium">Free Plan</p>
              </div>
            </div>
          </div>

          <button className="w-full md:w-auto bg-noki-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-noki-primary/90 transition-colors">
            Edit Profile
          </button>
        </div>
      </NokiCard>

      {/* Integrations */}
      <NokiCard>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
              <GraduationCap className="text-red-500" size={20} />
            </div>
            <h2 className="text-xl font-poppins font-semibold text-foreground">Canvas LMS Integration</h2>
          </div>

          <div className="bg-secondary p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500" size={20} />
                <div>
                  <p className="font-medium text-foreground">Connected</p>
                  <p className="text-sm text-muted-foreground">Your Canvas account is linked</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Link size={14} />
                  Institution URL
                </label>
                <div className="bg-background p-3 rounded-lg">
                  <p className="text-foreground font-mono text-sm">{canvasUrl}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Shield size={14} />
                  Canvas API Token
                </label>
                {!isEditingToken ? (
                  <div className="bg-background p-3 rounded-lg flex items-center justify-between gap-3">
                    <p className="text-foreground font-mono text-sm flex-1 overflow-hidden">
                      {showToken ? canvasToken : "••••••••••••••••••••••••••••••••"}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowToken(!showToken)}
                        className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                        title={showToken ? "Hide token" : "Show token"}
                      >
                        {showToken ? (
                          <EyeOff size={16} className="text-muted-foreground" />
                        ) : (
                          <Eye size={16} className="text-muted-foreground" />
                        )}
                      </button>
                      <button
                        onClick={() => setIsEditingToken(true)}
                        className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                        title="Edit token"
                      >
                        <Edit2 size={16} className="text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={tempToken}
                      onChange={(e) => setTempToken(e.target.value)}
                      className="w-full bg-background border border-border p-3 rounded-lg text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-noki-primary"
                      placeholder="Enter your Canvas API token"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveToken}
                        className="bg-noki-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-noki-primary/90 transition-colors text-sm"
                      >
                        Save Token
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-secondary text-foreground px-4 py-2 rounded-lg font-medium hover:bg-muted transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar size={16} />
                <span>Last synced: 2 hours ago</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="flex items-center gap-2 bg-noki-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-noki-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
                  {isSyncing ? "Syncing..." : "Sync Now"}
                </button>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-lg font-medium hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete Canvas Data
                </button>
              </div>
            </div>
          </div>

          {/* Delete Canvas Data Confirmation */}
          {showDeleteConfirm && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <div className="space-y-2 flex-1">
                  <p className="font-medium text-foreground">Are you sure?</p>
                  <p className="text-sm text-muted-foreground">
                    This will permanently delete all your Canvas courses, assignments, and related data. This action
                    cannot be undone.
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleDeleteCanvasData}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors text-sm"
                    >
                      Yes, Delete Data
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="bg-secondary text-foreground px-4 py-2 rounded-lg font-medium hover:bg-muted transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </NokiCard>

      {/* AI Usage & Tokens */}
      <NokiCard>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-noki-tertiary/10 rounded-xl flex items-center justify-center">
              <Zap className="text-noki-tertiary" size={20} />
            </div>
            <h2 className="text-xl font-poppins font-semibold text-foreground">AI Usage</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-noki-primary/10 to-noki-tertiary/10 p-6 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">AI Tokens Remaining</p>
                <Zap className="text-noki-primary" size={18} />
              </div>
              <p className="text-3xl font-poppins font-bold text-foreground">2,450</p>
              <p className="text-xs text-muted-foreground mt-1">of 5,000 tokens</p>
              <div className="w-full bg-secondary rounded-full h-2 mt-3">
                <div className="bg-noki-primary h-2 rounded-full" style={{ width: "49%" }}></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-noki-tertiary/10 to-purple-500/10 p-6 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">This Month's Usage</p>
                <TrendingUp className="text-noki-tertiary" size={18} />
              </div>
              <p className="text-3xl font-poppins font-bold text-foreground">2,550</p>
              <p className="text-xs text-muted-foreground mt-1">tokens used</p>
              <p className="text-xs text-green-500 mt-2">↑ 12% from last month</p>
            </div>
          </div>

          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="font-medium text-foreground mb-3">Recent AI Activity</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Chat conversations</span>
                <span className="text-foreground font-medium">1,200 tokens</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Assignment help</span>
                <span className="text-foreground font-medium">850 tokens</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Study planning</span>
                <span className="text-foreground font-medium">500 tokens</span>
              </div>
            </div>
          </div>
        </div>
      </NokiCard>

      {/* Upgrade Account */}
      <NokiCard className="bg-gradient-to-br from-noki-primary/5 to-noki-tertiary/5 border-2 border-noki-primary/20">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-noki-primary to-noki-tertiary rounded-xl flex items-center justify-center">
              <Crown className="text-white" size={20} />
            </div>
            <h2 className="text-xl font-poppins font-semibold text-foreground">Upgrade to Premium</h2>
          </div>

          <p className="text-muted-foreground">
            Unlock unlimited AI tokens, advanced features, priority support, and more with Noki Premium.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-noki-primary flex-shrink-0" size={20} />
              <span className="text-sm text-foreground">Unlimited AI tokens</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-noki-primary flex-shrink-0" size={20} />
              <span className="text-sm text-foreground">Priority support</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-noki-primary flex-shrink-0" size={20} />
              <span className="text-sm text-foreground">Advanced analytics</span>
            </div>
          </div>

          <button className="w-full md:w-auto bg-gradient-to-r from-noki-primary to-noki-tertiary text-white px-8 py-3 rounded-lg font-poppins font-semibold hover:shadow-lg transition-all">
            Upgrade Now
          </button>
        </div>
      </NokiCard>

      {/* Account Actions */}
      <NokiCard>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
              <Shield className="text-orange-500" size={20} />
            </div>
            <h2 className="text-xl font-poppins font-semibold text-foreground">Account Actions</h2>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-secondary hover:bg-muted rounded-lg transition-colors group">
              <div className="flex items-center gap-3">
                <LogOut className="text-muted-foreground group-hover:text-foreground transition-colors" size={20} />
                <div className="text-left">
                  <p className="font-medium text-foreground">Logout</p>
                  <p className="text-sm text-muted-foreground">Sign out of your account</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setShowAccountDeleteConfirm(true)}
              className="w-full flex items-center justify-between p-4 bg-red-500/5 hover:bg-red-500/10 rounded-lg transition-colors group border border-red-500/20"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="text-red-500" size={20} />
                <div className="text-left">
                  <p className="font-medium text-red-500">Delete Account</p>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                </div>
              </div>
            </button>
          </div>

          {/* Delete Account Confirmation */}
          {showAccountDeleteConfirm && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <div className="space-y-2 flex-1">
                  <p className="font-medium text-foreground">Delete Your Account?</p>
                  <p className="text-sm text-muted-foreground">
                    This will permanently delete your account, all your projects, tasks, todos, and Canvas data. This
                    action cannot be undone and you will lose access immediately.
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleDeleteAccount}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors text-sm"
                    >
                      Yes, Delete My Account
                    </button>
                    <button
                      onClick={() => setShowAccountDeleteConfirm(false)}
                      className="bg-secondary text-foreground px-4 py-2 rounded-lg font-medium hover:bg-muted transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </NokiCard>
    </div>
  )
}
