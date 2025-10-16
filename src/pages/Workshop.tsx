import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen, Wrench, Users, Car, Search, Save, UserPlus, CheckCircle, TrendingUp, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Workshop() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-military-green to-camo-brown text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container relative py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Award className="h-4 w-4" />
              <span className="text-sm font-medium">Verified Owners Only</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">THE WORKSHOP</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Factory-grade technical support. Step-by-step repairs. Verified owner community.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>45 Factory Manuals</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>10,000+ Pages</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>95% AI Accuracy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Feature Cards */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Repair Manuals Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-military-green">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-khaki-tan/20 flex items-center justify-center mb-4 group-hover:bg-khaki-tan/30 transition-colors">
                <BookOpen className="h-6 w-6 text-military-green" />
              </div>
              <CardTitle className="text-2xl">Repair Manuals</CardTitle>
              <CardDescription className="text-base">
                45+ factory manuals. Search, read, reference. Every system covered.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">45 manuals</span>
                  <span className="text-muted-foreground">10,000+ pages</span>
                  <span className="text-muted-foreground">95% accuracy</span>
                </div>
                <Link to="/workshop/manuals" className="block">
                  <Button className="w-full bg-military-green hover:bg-military-green/90">
                    Browse Manuals
                    <BookOpen className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Barry Workshop Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-amber-600">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                <Wrench className="h-6 w-6 text-amber-700" />
              </div>
              <CardTitle className="text-2xl">Barry Workshop</CardTitle>
              <CardDescription className="text-base">
                Advanced diagnostics. Step-by-step guidance. Get help 24/7.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                    GPT-4o Powered
                  </Badge>
                  <span className="text-muted-foreground">~4s response</span>
                </div>
                <Link to="/workshop/barry" className="block">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700">
                    Start Diagnosing
                    <Wrench className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Community Repairs Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-600">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Users className="h-6 w-6 text-blue-700" />
              </div>
              <CardTitle className="text-2xl">Community Repairs</CardTitle>
              <CardDescription className="text-base">
                See how other owners fixed problems. Share your solutions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">500+ repairs</span>
                  <span className="text-muted-foreground">2000+ photos</span>
                </div>
                <Link to="/workshop/community-repairs" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    View Repairs
                    <Users className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/profile/vehicles">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Car className="h-8 w-8 mx-auto mb-3 text-military-green" />
                  <p className="font-semibold">My Vehicles</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/workshop/history">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Search className="h-8 w-8 mx-auto mb-3 text-military-green" />
                  <p className="font-semibold">Recent Searches</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/workshop/saved">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Save className="h-8 w-8 mx-auto mb-3 text-military-green" />
                  <p className="font-semibold">Saved Repairs</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/profile/referral">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <UserPlus className="h-8 w-8 mx-auto mb-3 text-military-green" />
                  <p className="font-semibold">Invite a Friend</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Feature Highlights Section */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader className="pb-3">
              <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold">45+</CardTitle>
              <CardDescription>Manuals Updated</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <div className="mx-auto h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </div>
              <CardTitle className="text-3xl font-bold">95%</CardTitle>
              <CardDescription>Accurate Answers</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-3xl font-bold">500+</CardTitle>
              <CardDescription>Community Repairs</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold">100%</CardTitle>
              <CardDescription>Verified Owners</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
