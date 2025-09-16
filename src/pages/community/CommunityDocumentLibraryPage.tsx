import React from 'react';
import { CommunityDocumentLibrary } from '@/components/community/CommunityDocumentLibrary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Library,
  Upload,
  Users,
  TrendingUp,
  FileText,
  Share2,
  Heart,
  Download,
  Star
} from 'lucide-react';

export default function CommunityDocumentLibraryPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-military-green to-camo-brown text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Library className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Community Document Library
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Access thousands of technical documents created by Barry AI and shared by
              Unimog enthusiasts worldwide. From maintenance procedures to parts catalogs,
              find the resources you need or contribute your own.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="gap-2">
                <Upload className="w-5 h-5" />
                Share Your Documents
              </Button>
              <Button size="lg" variant="outline" className="gap-2 text-white border-white hover:bg-white hover:text-military-green">
                <FileText className="w-5 h-5" />
                Browse Library
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need in One Place
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">AI-Generated Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Professional PowerPoint presentations, Excel spreadsheets, and PDF guides
                  created by Barry AI for specific Unimog procedures and maintenance tasks.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Every document shared by real Unimog owners and mechanics, ensuring
                  practical, tested solutions for common issues and maintenance procedures.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Quality Rated</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Community rating system helps you find the most useful documents.
                  Rate and review documents to help others discover the best resources.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Download className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Instant Download</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Download any document instantly in its original format. All files are
                  safely stored and available 24/7 with fast download speeds.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Statistics */}
          <div className="bg-gray-50 rounded-lg p-8 mb-16">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-military-green mb-2">2,500+</div>
                <div className="text-gray-600">Documents Available</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-military-green mb-2">850+</div>
                <div className="text-gray-600">Community Members</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-military-green mb-2">15,000+</div>
                <div className="text-gray-600">Downloads This Month</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-military-green mb-2">4.8★</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Generate or Upload</h3>
                <p className="text-gray-600">
                  Ask Barry AI to create custom documents for your Unimog, or upload
                  your own technical resources that others might find useful.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Share with Community</h3>
                <p className="text-gray-600">
                  Choose to share your documents with the community. Add descriptions,
                  tags, and specify which Unimog models they apply to.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Download & Rate</h3>
                <p className="text-gray-600">
                  Browse, download, and rate documents. Your feedback helps others
                  find the most valuable resources for their Unimog projects.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-military-green rounded-lg p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Contribute?</h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of Unimog enthusiasts sharing knowledge and resources
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="gap-2">
                <Heart className="w-5 h-5" />
                Start Sharing
              </Button>
              <Button size="lg" variant="outline" className="gap-2 text-white border-white hover:bg-white hover:text-military-green">
                <Share2 className="w-5 h-5" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Library Component */}
      <div className="container mx-auto px-4 pb-16">
        <CommunityDocumentLibrary />
      </div>
    </div>
  );
}