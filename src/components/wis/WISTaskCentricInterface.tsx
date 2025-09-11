import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  FileText, 
  Wrench, 
  AlertTriangle, 
  Zap,
  MessageSquare,
  ArrowLeft,
  Target,
  Clock,
  Users,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { WISProfessionalSearch, WISSearchResult, WISSuggestion } from './WISProfessionalSearch';
import { WISProcedurePack } from './WISProcedurePack';

interface WISTaskCentricInterfaceProps {
  modelBias?: string;
  className?: string;
}

type ViewMode = 'search' | 'procedure';

export function WISTaskCentricInterface({ 
  modelBias = 'U435',
  className = ""
}: WISTaskCentricInterfaceProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('search');
  const [selectedResult, setSelectedResult] = useState<WISSearchResult | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentModelBias, setCurrentModelBias] = useState<string>(modelBias);
  const [userProfileModel, setUserProfileModel] = useState<string | null>(null);
  const searchRef = useRef<any>(null);

  // Load user's profile model on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user?.id) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('unimog_model')
            .eq('id', user.id)
            .single();

          if (profile?.unimog_model) {
            setUserProfileModel(profile.unimog_model);
            setCurrentModelBias(profile.unimog_model);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }
    };

    loadUserProfile();
  }, [user?.id]);

  const handleResultSelect = (result: WISSearchResult) => {
    setSelectedResult(result);
    setViewMode('procedure');
  };

  const handleSuggestionSelect = (suggestion: WISSuggestion) => {
    setSearchQuery(suggestion.label);
  };

  const handleModelChange = (modelCode: string) => {
    setCurrentModelBias(modelCode);
  };

  const handleQuickSearch = (task: string) => {
    setSearchQuery(task);
    // Trigger search immediately by calling the search component's execute function
    if (searchRef.current && searchRef.current.executeSearch) {
      searchRef.current.executeSearch(task);
    }
  };

  const handleBackToSearch = () => {
    setViewMode('search');
    setSelectedResult(null);
  };

  const handleOpenInBarry = (context: any) => {
    // Navigate to Barry AI mechanic page
    navigate('/knowledge/ai-mechanic');
  };

  if (viewMode === 'procedure' && selectedResult) {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Back Navigation */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToSearch}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Search</span>
            <span>→</span>
            <Badge variant="outline">{selectedResult.doc_type}</Badge>
            <span>→</span>
            <span className="font-medium">{selectedResult.title}</span>
          </div>
        </div>

        {/* Procedure Pack */}
        <WISProcedurePack
          searchResult={selectedResult}
          onClose={handleBackToSearch}
          onOpenInBarry={handleOpenInBarry}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-3 text-gray-900">
            <Target className="w-8 h-8 text-blue-600" />
            Mercedes-Benz WIS Workshop System
          </CardTitle>
          <div className="flex items-center gap-6 text-sm text-gray-700 mt-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span>4,875 Documents</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>10,345 Media Files</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Task-Centric Design</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Predictive Search</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-6">
            Professional workshop information system with predictive search and complete procedure packs. 
            Simply describe what you're fixing, and get everything you need assembled in one place.
          </p>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/70 border border-blue-200 p-4 rounded-lg">
              <FileText className="w-6 h-6 mb-2 text-blue-600" />
              <div className="text-lg font-bold text-gray-900">850</div>
              <div className="text-sm text-gray-600">Repair Procedures</div>
            </div>
            <div className="bg-white/70 border border-green-200 p-4 rounded-lg">
              <Wrench className="w-6 h-6 mb-2 text-green-600" />
              <div className="text-lg font-bold text-gray-900">3,900</div>
              <div className="text-sm text-gray-600">Parts & Components</div>
            </div>
            <div className="bg-white/70 border border-orange-200 p-4 rounded-lg">
              <AlertTriangle className="w-6 h-6 mb-2 text-orange-600" />
              <div className="text-lg font-bold text-gray-900">125</div>
              <div className="text-sm text-gray-600">Service Bulletins</div>
            </div>
            <div className="bg-white/70 border border-purple-200 p-4 rounded-lg">
              <MessageSquare className="w-6 h-6 mb-2 text-purple-600" />
              <div className="text-lg font-bold text-gray-900">Barry</div>
              <div className="text-sm text-gray-600">AI Assistant</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task-Centric Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-600" />
            Task-Centric Search
          </CardTitle>
          <p className="text-gray-600">
            Tell us what you're working on, and we'll assemble everything you need in a complete procedure pack.
          </p>
        </CardHeader>
        <CardContent>
          <WISProfessionalSearch
            ref={searchRef}
            onResultSelect={handleResultSelect}
            onSuggestionSelect={handleSuggestionSelect}
            modelBias={currentModelBias}
            onModelChange={handleModelChange}
            searchQuery={searchQuery}
            onQueryChange={setSearchQuery}
            className="w-full"
          />

          {/* Quick Access Examples */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Workshop Tasks</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { task: 'Engine Oil Change', category: 'Maintenance', icon: '🛢️' },
                { task: 'Brake Service', category: 'Safety', icon: '🛑' },
                { task: 'Transmission Service', category: 'Drivetrain', icon: '⚙️' },
                { task: 'Portal Axle Service', category: 'Drivetrain', icon: '🔧' },
                { task: 'Hydraulic System', category: 'Systems', icon: '💧' },
                { task: 'Differential Service', category: 'Drivetrain', icon: '🔩' },
                { task: 'Alternator Belt', category: 'Engine', icon: '⚡' },
                { task: 'Coolant System', category: 'Engine', icon: '🌡️' }
              ].map((item, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-start hover:bg-gray-50"
                  onClick={() => handleQuickSearch(item.task)}
                >
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="font-medium text-sm">{item.task}</div>
                  <div className="text-xs text-gray-500">{item.category}</div>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>How Task-Centric Search Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Describe Your Task</h3>
              <p className="text-gray-600 text-sm">
                Simply type what you're trying to fix or maintain. Our predictive search understands automotive terminology.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Get Procedure Pack</h3>
              <p className="text-gray-600 text-sm">
                We assemble everything you need: steps, tools, parts, safety warnings, diagrams, and related bulletins.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Complete the Task</h3>
              <p className="text-gray-600 text-sm">
                Follow the step-by-step procedure with progress tracking, timer, and Barry AI assistance when needed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Barry AI Integration */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <MessageSquare className="w-5 h-5" />
            Ask WIS Barry
          </CardTitle>
          <p className="text-green-700">
            Need help understanding a procedure or troubleshooting an issue? 
            Barry has access to the complete WIS database and can provide expert guidance.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleOpenInBarry(null)}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Start Conversation with Barry
            </Button>
            <div className="text-sm text-green-700">
              <strong>Barry can help with:</strong> Procedure clarification, troubleshooting, 
              part identification, torque specifications, and alternative repair methods.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Information */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Professional WIS Database</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Database Coverage</h4>
              <ul className="space-y-1">
                <li>• Complete Mercedes-Benz Unimog U435 Series (1974-1991)</li>
                <li>• All engine variants: OM352, OM366, OM314</li>
                <li>• Transmission systems: UG8/1, UG8/2</li>
                <li>• Complete parts catalog with supersession data</li>
                <li>• Official service bulletins and technical updates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Media Library</h4>
              <ul className="space-y-1">
                <li>• 4,941 high-resolution photos</li>
                <li>• 3,603 technical diagrams (PDF)</li>
                <li>• 1,166 wiring schematics (PNG)</li>
                <li>• 605 specification tables (PDF)</li>
                <li>• 28 performance charts (PDF)</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Quality Assurance:</strong> All data extracted from official Mercedes Workshop Information System. 
              Part numbers follow Mercedes OEM format (A### ### ## ##). Cross-references to aftermarket suppliers included. 
              Torque specifications and safety warnings verified against production documentation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default WISTaskCentricInterface;