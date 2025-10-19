"use client"

import { NokiButton } from "@/components/global/noki-button"
import { NokiCard } from "@/components/global/noki-card"
import Link from "next/link"
import {
  Sparkles,
  Calendar,
  FolderKanban,
  MessageSquare,
  Settings,
  CheckCircle2,
  BookOpen,
  Target,
  ArrowRight,
  Zap,
  TrendingUp,
} from "lucide-react"

export default function GettingStartedPage() {
  return (
    <div className="min-h-full bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-noki-primary/5 via-transparent to-noki-secondary/5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-noki-primary/10 border border-noki-primary/20 rounded-full">
              <Sparkles className="w-4 h-4 text-noki-primary" />
              <span className="text-sm font-medium text-noki-primary">AI-Powered Student Companion</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-poppins font-bold text-foreground">
              Welcome to <span className="text-noki-primary">Noki</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Your intelligent assistant that helps you manage assignments, organize tasks, and stay on top of your
              academic life with AI-powered insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/dashboard">
                <NokiButton variant="positive" size="lg" className="group">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </NokiButton>
              </Link>
              <button
                onClick={() => {
                  document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                <NokiButton variant="negative" size="lg">
                  Explore Features
                </NokiButton>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Features Section */}
      <div id="features-section" className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl md:text-4xl font-poppins font-bold text-foreground">
            Everything You Need to Succeed
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful features designed to help you stay organized and achieve your academic goals.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Large Feature - AI Assistant */}
          <NokiCard className="md:col-span-2 lg:row-span-2 p-8 bg-gradient-to-br from-noki-secondary/10 to-noki-primary/5 border-noki-secondary/20 hover:scale-[1.02] transition-all duration-300 group">
            <div className="h-full flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-noki-secondary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-8 h-8 text-noki-secondary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-poppins font-bold text-foreground">Chat with Noki AI</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Get instant help with assignments, course questions, and study planning. Noki understands your
                    context and provides personalized assistance.
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="w-4 h-4 text-noki-secondary" />
                  <span>Instant answers to your questions</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="w-4 h-4 text-noki-secondary" />
                  <span>Context-aware responses</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4 text-noki-secondary" />
                  <span>Study tips and strategies</span>
                </div>
              </div>
            </div>
          </NokiCard>

          {/* Medium Feature - Smart Scheduling */}
          <NokiCard className="md:col-span-1 p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/5 border-purple-500/20 hover:scale-[1.02] transition-all duration-300 group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-poppins font-semibold text-foreground">Smart Scheduling</h3>
                <p className="text-sm text-muted-foreground">
                  View your timetable in month, week, or day views with real-time indicators.
                </p>
              </div>
            </div>
          </NokiCard>

          {/* Medium Feature - Canvas Integration */}
          <NokiCard className="md:col-span-1 p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-500/20 hover:scale-[1.02] transition-all duration-300 group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-poppins font-semibold text-foreground">Canvas Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically sync courses, assignments, and deadlines from Canvas LMS.
                </p>
              </div>
            </div>
          </NokiCard>

          {/* Wide Feature - Project Management */}
          <NokiCard className="md:col-span-2 p-6 bg-gradient-to-br from-emerald-500/10 to-green-500/5 border-emerald-500/20 hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <FolderKanban className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-xl font-poppins font-semibold text-foreground">Project Management</h3>
                <p className="text-sm text-muted-foreground">
                  Organize courses, assignments, tasks, and todos all in one place. Switch between grouped and timeline
                  views to see what matters most.
                </p>
              </div>
            </div>
          </NokiCard>

          {/* Small Feature - Todo Tracking */}
          <NokiCard className="md:col-span-1 p-6 bg-gradient-to-br from-cyan-500/10 to-teal-500/5 border-cyan-500/20 hover:scale-[1.02] transition-all duration-300 group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-poppins font-semibold text-foreground">Todo Tracking</h3>
                <p className="text-sm text-muted-foreground">Track progress with daily completion stats and filters.</p>
              </div>
            </div>
          </NokiCard>

          {/* Small Feature - Settings */}
          <NokiCard className="md:col-span-1 p-6 bg-gradient-to-br from-orange-500/10 to-amber-500/5 border-orange-500/20 hover:scale-[1.02] transition-all duration-300 group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Settings className="w-6 h-6 text-orange-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-poppins font-semibold text-foreground">Customization</h3>
                <p className="text-sm text-muted-foreground">Personalize your experience with flexible settings.</p>
              </div>
            </div>
          </NokiCard>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NokiCard className="p-8 text-center space-y-2 bg-gradient-to-br from-noki-primary/5 to-transparent border-noki-primary/20">
            <div className="text-4xl font-poppins font-bold text-noki-primary">10K+</div>
            <div className="text-sm text-muted-foreground">Active Students</div>
          </NokiCard>
          <NokiCard className="p-8 text-center space-y-2 bg-gradient-to-br from-noki-secondary/5 to-transparent border-noki-secondary/20">
            <div className="text-4xl font-poppins font-bold text-noki-secondary">50K+</div>
            <div className="text-sm text-muted-foreground">Tasks Completed</div>
          </NokiCard>
          <NokiCard className="p-8 text-center space-y-2 bg-gradient-to-br from-emerald-500/5 to-transparent border-emerald-500/20">
            <div className="text-4xl font-poppins font-bold text-emerald-400">98%</div>
            <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
          </NokiCard>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-16 pb-24">
        <NokiCard className="p-12 bg-gradient-to-br from-noki-primary/10 via-noki-secondary/5 to-noki-primary/10 border-noki-primary/20 text-center space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold text-foreground">Ready to Get Started?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands of students who are already using Noki to stay organized and succeed academically.
            </p>
          </div>
          <Link href="/dashboard">
            <NokiButton variant="positive" size="lg" className="group">
              Start Using Noki Now
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </NokiButton>
          </Link>
        </NokiCard>
      </div>
    </div>
  )
}
