import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { WISEPCViewer } from '@/components/wis/WISEPCViewer';
import { WISContentViewer } from '@/components/wis/WISContentViewer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  BookOpen, 
  Settings, 
  Bookmark,
  Info,
  Shield,
  Clock,
  Users
} from 'lucide-react';
import { useWISEPC } from '@/hooks/use-wis-epc';
import { Link } from 'react-router-dom';

const WISEPCPage = () => {
  const { bookmarks, usageStats, isAuthenticated } = useWISEPC();
  const [activeTab, setActiveTab] = useState('viewer');

  const features = [
    {
      icon: <BookOpen className="w-5 h-5 text-blue-500" />,
      title: "Workshop Procedures",
      description: "Complete step-by-step repair and maintenance instructions for all Mercedes and Unimog models."
    },
    {
      icon: <Settings className="w-5 h-5 text-green-500" />,
      title: "Electronic Parts Catalog",
      description: "Detailed parts diagrams, part numbers, and specifications with interactive exploded views."
    },
    {
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      title: "Diagnostic Procedures",
      description: "Professional diagnostic workflows, troubleshooting guides, and error code explanations."
    },
    {
      icon: <Shield className="w-5 h-5 text-red-500" />,
      title: "Safety Information",
      description: "Critical safety procedures, warnings, and precautions for professional repair work."
    }
  ];

  const renderBookmarks = () => {
    if (!isAuthenticated) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Sign in to view your WIS EPC bookmarks</p>
          <Button asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      );
    }

    if (bookmarks.length === 0) {
      return (
        <div className="text-center py-8">
          <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookmarks Yet</h3>
          <p className="text-gray-600 mb-4">
            Start a WIS EPC session and bookmark important procedures for quick access later.
          </p>
          <Button onClick={() => setActiveTab('viewer')}>
            <Zap className="w-4 h-4 mr-2" />
            Start WIS EPC
          </Button>
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {bookmarks.map((bookmark) => (
          <Card key={bookmark.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{bookmark.title}</h3>
                  {bookmark.description && (
                    <p className="text-sm text-gray-600 mt-1">{bookmark.description}</p>
                  )}
                  {bookmark.procedure_path && (
                    <p className="text-xs text-blue-600 mt-1 font-mono">
                      {bookmark.procedure_path}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {bookmark.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    <span className="text-xs text-gray-500">
                      {new Date(bookmark.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {bookmark.screenshot_url && (
                  <img
                    src={bookmark.screenshot_url}
                    alt="Procedure screenshot"
                    className="w-16 h-16 rounded border ml-4"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderUsageStats = () => {
    if (!isAuthenticated || !usageStats) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">Sign in to view your usage statistics</p>
        </div>
      );
    }

    return (
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Subscription Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Current Plan</p>
                <p className="text-lg font-semibold capitalize">{usageStats.tier}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Priority Level</p>
                <p className="text-lg font-semibold">{usageStats.priorityLevel}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {usageStats.tier === 'free' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Monthly Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Minutes Used</span>
                  <span className="font-semibold">
                    {usageStats.usedMinutes} / {usageStats.totalMinutes}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, usageStats.usagePercentage)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    {usageStats.remainingMinutes} minutes remaining
                  </span>
                  {usageStats.usagePercentage > 80 && (
                    <Button asChild size="sm" variant="outline">
                      <Link to="/pricing">Upgrade</Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Access History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Session history and detailed usage logs will be available here once you start using WIS EPC.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Zap className="w-8 h-8 text-blue-500" />
              <h1 className="text-3xl font-bold text-gray-900">Mercedes WIS EPC</h1>
              <Badge variant="secondary">Professional Edition</Badge>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access the complete Mercedes Workshop Information System and Electronic Parts Catalog 
              directly in your browser. Professional diagnostic tools for Unimog and Mercedes vehicles.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="viewer">WIS EPC Viewer</TabsTrigger>
              <TabsTrigger value="bookmarks">My Bookmarks</TabsTrigger>
              <TabsTrigger value="usage">Usage & Stats</TabsTrigger>
              <TabsTrigger value="help">Help & Info</TabsTrigger>
            </TabsList>

            <TabsContent value="viewer" className="mt-6">
              <WISContentViewer />
            </TabsContent>

            <TabsContent value="bookmarks" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bookmark className="w-5 h-5" />
                    Saved Procedures
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderBookmarks()}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usage" className="mt-6">
              {renderUsageStats()}
            </TabsContent>

            <TabsContent value="help" className="mt-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      What is Mercedes WIS EPC?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      The Mercedes Workshop Information System (WIS) and Electronic Parts Catalog (EPC) 
                      is the official diagnostic and repair information system used by Mercedes-Benz dealerships 
                      and professional workshops worldwide.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">WIS Features:</h4>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• Step-by-step repair procedures</li>
                          <li>• Diagnostic troubleshooting guides</li>
                          <li>• Technical service bulletins</li>
                          <li>• Torque specifications</li>
                          <li>• Fluid capacities and specifications</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">EPC Features:</h4>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• Interactive parts diagrams</li>
                          <li>• Part numbers and pricing</li>
                          <li>• Assembly illustrations</li>
                          <li>• Parts compatibility information</li>
                          <li>• Supersession data</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Requirements & Browser Compatibility</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Supported Browsers:</h4>
                      <p className="text-sm text-gray-600">
                        Chrome 90+, Firefox 88+, Safari 14+, Edge 90+. JavaScript and cookies must be enabled.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Recommended Setup:</h4>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• Stable internet connection (minimum 5 Mbps)</li>
                        <li>• Screen resolution 1280x720 or higher</li>
                        <li>• Keyboard and mouse for optimal navigation</li>
                        <li>• Pop-up blocker disabled for this domain</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Getting Help</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Need assistance with WIS EPC? Here are your options:
                    </p>
                    <div className="grid gap-3">
                      <Button asChild variant="outline" className="justify-start">
                        <Link to="/knowledge/ai-mechanic">
                          <Zap className="w-4 h-4 mr-2" />
                          Ask Barry (AI Mechanic)
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="justify-start">
                        <Link to="/community">
                          <Users className="w-4 h-4 mr-2" />
                          Community Forum
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="justify-start">
                        <Link to="/contact">
                          <Info className="w-4 h-4 mr-2" />
                          Contact Support
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default WISEPCPage;