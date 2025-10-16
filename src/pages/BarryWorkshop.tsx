import Layout from '@/components/Layout';
import { SecureBarryChat } from '@/components/knowledge/SecureBarryChat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, Zap, Shield, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function BarryWorkshop() {
  const suggestedPrompts = [
    {
      icon: Wrench,
      title: 'Portal Axle Rebuild',
      prompt: 'Help me plan a complete portal axle rebuild for my U1700L. What tools do I need, what's the time estimate, and what are the critical steps?',
      category: 'Major Repair'
    },
    {
      icon: Zap,
      title: 'Starting Issues',
      prompt: 'My Unimog won't start. The engine cranks but doesn't fire. Walk me through systematic troubleshooting.',
      category: 'Diagnostics'
    },
    {
      icon: Shield,
      title: 'Pre-Trip Checklist',
      prompt: 'I'm planning a remote expedition. Generate a comprehensive pre-trip diagnostic checklist based on the factory maintenance schedule.',
      category: 'Maintenance'
    },
    {
      icon: Wrench,
      title: 'Electrical Diagnosis',
      prompt: 'I have an intermittent electrical issue - lights flickering when engine is running. Help me diagnose the electrical system step by step.',
      category: 'Diagnostics'
    }
  ];

  return (
    <Layout>
      <div className="container py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <Wrench className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Workshop Barry</h1>
              <p className="text-muted-foreground">Advanced AI diagnostics for verified owners</p>
            </div>
            <Badge className="ml-auto bg-green-600">
              <Shield className="h-3 w-3 mr-1" />
              Verified Only
            </Badge>
          </div>

          {/* Workshop Mode Features */}
          <Alert className="bg-amber-50 border-amber-200">
            <Zap className="h-4 w-4 text-amber-600" />
            <AlertDescription>
              <strong className="text-amber-900">Workshop Mode Active:</strong>
              <span className="text-amber-800"> Barry can now ask diagnostic questions, create repair plans, suggest tools & parts, and provide step-by-step troubleshooting.</span>
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Barry Workshop Chat</CardTitle>
                    <CardDescription>Get advanced diagnostics and repair planning</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    GPT-4o • Two-Pass RAG
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <SecureBarryChat height="600px" />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* What Workshop Barry Can Do */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Workshop Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Interactive Troubleshooting</p>
                    <p className="text-xs text-muted-foreground">
                      Barry asks diagnostic questions to narrow down the problem
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Repair Planning</p>
                    <p className="text-xs text-muted-foreground">
                      Creates step-by-step plans with time estimates and tool lists
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Parts & Tools Suggestions</p>
                    <p className="text-xs text-muted-foreground">
                      Recommends specific parts and tools from the manual
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Manual Citations</p>
                    <p className="text-xs text-muted-foreground">
                      Every answer includes exact manual page references
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Suggested Prompts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Suggested Diagnostics</CardTitle>
                <CardDescription>Try these workshop prompts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                    onClick={() => {
                      // This would trigger sending the prompt to Barry
                      // For now it's just a visual element
                      console.log('Send prompt:', prompt.prompt);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-md bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                        <prompt.icon className="h-4 w-4 text-amber-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-1">{prompt.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{prompt.prompt}</p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {prompt.category}
                        </Badge>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Safety Notice */}
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-amber-900">Safety First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-amber-800">
                  Barry provides guidance based on factory manuals but is not a substitute for professional mechanical expertise.
                  Always follow proper safety procedures and consult a qualified technician for critical repairs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
