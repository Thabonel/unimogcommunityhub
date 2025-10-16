import Layout from '@/components/Layout';
import { VerificationUploadForm } from '@/components/verification/VerificationUploadForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CheckCircle, Users, Lock } from 'lucide-react';

export default function VerifyOwnership() {
  return (
    <Layout>
      <div className="container py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-military-green/10 mb-4">
            <Shield className="h-8 w-8 text-military-green" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Verify Your Unimog Ownership</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join the verified owner community and unlock exclusive features like The Garage and Workshop Barry
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Verified Badge</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get a verified owner badge displayed on your profile, posts, and comments
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                <Lock className="h-6 w-6 text-amber-600" />
              </div>
              <CardTitle className="text-lg">The Garage</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access exclusive garage features, workshop manuals, and advanced Barry diagnostics
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Verified Community</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect with other verified owners and share knowledge with real enthusiasts
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Upload Form */}
        <VerificationUploadForm />

        {/* How It Works */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>How Verification Works</CardTitle>
            <CardDescription>Simple 3-step process to get verified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-military-green text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">Take a Photo</h4>
                <p className="text-sm text-muted-foreground">
                  Take a photo of your Unimog with a handwritten note showing your username and today's date. This proves you actually own the vehicle.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-military-green text-white flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">Submit Details</h4>
                <p className="text-sm text-muted-foreground">
                  Tell us about your Unimog - model, year, location, and your story. This helps us build a verified community database.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-military-green text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">Get Reviewed</h4>
                <p className="text-sm text-muted-foreground">
                  Our team reviews your submission within 48 hours. Once approved, you'll get your verified badge and access to The Garage!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
