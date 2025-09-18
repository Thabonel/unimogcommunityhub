# WIS Modern Web Implementation Strategy

## Executive Summary

Based on our comprehensive analysis of the original Mercedes WIS system, this document outlines a complete strategy for implementing a modern web-based version that preserves the core workflows while leveraging contemporary web technologies and user experience patterns.

## Core Principles for Modern Implementation

### 1. Preserve Essential Workflows
- **Hierarchical Navigation**: Maintain the tree-based system browsing
- **Rich Media Integration**: High-quality images and diagrams
- **Cross-Referencing**: Automatic related content suggestions
- **Professional Presentation**: Clean, technical interface
- **Multi-Modal Search**: Tree browsing + text search + part number lookup

### 2. Enhance with Modern UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Progressive Web App**: Offline capability for workshop use
- **Touch Optimization**: Large targets for gloved hands
- **Voice Search**: Hands-free operation capability
- **Real-time Updates**: Live service bulletin notifications

## Technical Architecture

### Frontend Stack
```
┌─────────────────────────────────────────┐
│           React 18 + TypeScript          │
├─────────────────────────────────────────┤
│     Tailwind CSS + shadcn/ui             │
├─────────────────────────────────────────┤
│  React Query + Zustand State Management  │
├─────────────────────────────────────────┤
│       Service Workers (Offline)          │
├─────────────────────────────────────────┤
│      Workbox (PWA Framework)             │
└─────────────────────────────────────────┘
```

### Backend Infrastructure
```
┌─────────────────────────────────────────┐
│         Supabase PostgreSQL              │
├─────────────────────────────────────────┤
│      Supabase Edge Functions             │
├─────────────────────────────────────────┤
│     Supabase Storage (Media Files)       │
├─────────────────────────────────────────┤
│        Full-Text Search Engine           │
├─────────────────────────────────────────┤
│      Real-time Subscriptions             │
└─────────────────────────────────────────┘
```

## Database Schema Design

### Core Tables Structure
```sql
-- Vehicle Models
CREATE TABLE wis_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_code VARCHAR(10) NOT NULL, -- 'U435', 'U400', etc.
    model_name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Categories (Engine, Axles, etc.)
CREATE TABLE wis_systems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID REFERENCES wis_models(id),
    system_code VARCHAR(10) NOT NULL, -- '25', '01', etc.
    system_name VARCHAR(100) NOT NULL, -- 'Axles/Portal Hubs'
    description TEXT,
    sort_order INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Component Groups (Portal Hub, Differential)
CREATE TABLE wis_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    system_id UUID REFERENCES wis_systems(id),
    component_code VARCHAR(10) NOT NULL, -- '20', '10', etc.
    component_name VARCHAR(100) NOT NULL, -- 'Portal Hub Assembly'
    description TEXT,
    sort_order INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual Procedures
CREATE TABLE wis_procedures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component_id UUID REFERENCES wis_components(id),
    procedure_code VARCHAR(20) NOT NULL, -- '25.20.02'
    title VARCHAR(200) NOT NULL, -- 'Replace Portal Hub Seals'
    description TEXT,
    estimated_time_hours DECIMAL(3,1), -- 2.5
    difficulty_level INTEGER, -- 1-5
    safety_warnings TEXT[],
    overview TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Full-text search
    search_vector TSVECTOR GENERATED ALWAYS AS (
        to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || procedure_code)
    ) STORED
);

-- Procedure Steps
CREATE TABLE wis_procedure_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    procedure_id UUID REFERENCES wis_procedures(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    title VARCHAR(200),
    instruction TEXT NOT NULL,
    image_urls TEXT[],
    video_url TEXT,
    notes TEXT,
    warnings TEXT[],
    torque_specs JSONB, -- {"bolt_size": "M12", "torque_nm": 85}
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(procedure_id, step_number)
);

-- Parts Required
CREATE TABLE wis_procedure_parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    procedure_id UUID REFERENCES wis_procedures(id) ON DELETE CASCADE,
    part_number VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    quantity INTEGER DEFAULT 1,
    part_type VARCHAR(50), -- 'replacement', 'consumable', 'tool'
    mercedes_part_number VARCHAR(50),
    alternative_part_numbers TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tools Required
CREATE TABLE wis_procedure_tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    procedure_id UUID REFERENCES wis_procedures(id) ON DELETE CASCADE,
    tool_name VARCHAR(200) NOT NULL,
    tool_type VARCHAR(50), -- 'standard', 'special', 'safety'
    mercedes_tool_number VARCHAR(50),
    description TEXT,
    required BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cross-References
CREATE TABLE wis_procedure_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_procedure_id UUID REFERENCES wis_procedures(id) ON DELETE CASCADE,
    target_procedure_id UUID REFERENCES wis_procedures(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50), -- 'prerequisite', 'follow_up', 'related', 'alternative'
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(source_procedure_id, target_procedure_id, relationship_type)
);

-- Service Bulletins
CREATE TABLE wis_service_bulletins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bulletin_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content TEXT,
    bulletin_date DATE,
    models VARCHAR(50)[],
    systems VARCHAR(50)[],
    severity VARCHAR(20), -- 'info', 'important', 'critical'
    pdf_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Search
    search_vector TSVECTOR GENERATED ALWAYS AS (
        to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || bulletin_number)
    ) STORED
);

-- Bulletin-Procedure Relationships
CREATE TABLE wis_bulletin_procedures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bulletin_id UUID REFERENCES wis_service_bulletins(id) ON DELETE CASCADE,
    procedure_id UUID REFERENCES wis_procedures(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50), -- 'updates', 'supersedes', 'relates_to'
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(bulletin_id, procedure_id)
);

-- User Bookmarks
CREATE TABLE wis_user_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    procedure_id UUID REFERENCES wis_procedures(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, procedure_id)
);

-- Search Indexes
CREATE INDEX idx_procedures_search ON wis_procedures USING GIN(search_vector);
CREATE INDEX idx_bulletins_search ON wis_service_bulletins USING GIN(search_vector);
CREATE INDEX idx_procedures_component ON wis_procedures(component_id);
CREATE INDEX idx_procedure_steps_procedure ON wis_procedure_steps(procedure_id, step_number);
```

## Component Architecture

### 1. Main WIS Interface Component
```typescript
// src/components/wis/WISInterface.tsx
interface WISInterfaceProps {
  initialModel?: string;
  initialProcedure?: string;
}

const WISInterface: React.FC<WISInterfaceProps> = ({
  initialModel,
  initialProcedure
}) => {
  const [selectedModel, setSelectedModel] = useState(initialModel);
  const [selectedProcedure, setSelectedProcedure] = useState(initialProcedure);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'tree' | 'search'>('tree');

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar - Navigation Tree */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <WISModelSelector
          selectedModel={selectedModel}
          onModelSelect={setSelectedModel}
        />
        <WISSearchBox
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onModeChange={setViewMode}
        />
        <WISNavigationTree
          modelId={selectedModel}
          selectedProcedure={selectedProcedure}
          onProcedureSelect={setSelectedProcedure}
          searchMode={viewMode === 'search'}
          searchQuery={searchQuery}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {selectedProcedure ? (
          <WISProcedureViewer
            procedureId={selectedProcedure}
          />
        ) : (
          <WISWelcomeScreen selectedModel={selectedModel} />
        )}
      </div>

      {/* Right Sidebar - Related Content */}
      <div className="w-72 border-l border-gray-200">
        <WISRelatedContent
          procedureId={selectedProcedure}
        />
      </div>
    </div>
  );
};
```

### 2. Navigation Tree Component
```typescript
// src/components/wis/WISNavigationTree.tsx
interface TreeNode {
  id: string;
  type: 'model' | 'system' | 'component' | 'procedure';
  code: string;
  name: string;
  children?: TreeNode[];
  procedureCount?: number;
  estimatedTime?: number;
}

const WISNavigationTree: React.FC<WISNavigationTreeProps> = ({
  modelId,
  selectedProcedure,
  onProcedureSelect,
  searchMode,
  searchQuery
}) => {
  const { data: treeData, isLoading } = useWISTreeData(modelId, searchMode, searchQuery);

  const renderTreeNode = (node: TreeNode, level: number = 0) => (
    <div key={node.id} className={`ml-${level * 4}`}>
      <div
        className={cn(
          "flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer",
          selectedProcedure === node.id && "bg-blue-50 border-r-2 border-blue-500"
        )}
        onClick={() => node.type === 'procedure' && onProcedureSelect(node.id)}
      >
        <TreeIcon nodeType={node.type} isExpanded={true} />
        <span className="text-sm font-medium">{node.code}</span>
        <span className="text-sm text-gray-600 flex-1">{node.name}</span>
        {node.procedureCount && (
          <span className="text-xs text-gray-400">({node.procedureCount})</span>
        )}
        {node.estimatedTime && (
          <span className="text-xs text-blue-600">{node.estimatedTime}h</span>
        )}
      </div>
      {node.children?.map(child => renderTreeNode(child, level + 1))}
    </div>
  );

  if (isLoading) return <WISTreeSkeleton />;

  return (
    <ScrollArea className="flex-1">
      <div className="p-2">
        {treeData?.map(node => renderTreeNode(node))}
      </div>
    </ScrollArea>
  );
};
```

### 3. Procedure Viewer Component
```typescript
// src/components/wis/WISProcedureViewer.tsx
const WISProcedureViewer: React.FC<{ procedureId: string }> = ({
  procedureId
}) => {
  const { data: procedure, isLoading } = useWISProcedure(procedureId);
  const [activeTab, setActiveTab] = useState<'procedure' | 'tools' | 'parts' | 'diagrams'>('procedure');
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="flex flex-col h-full">
      {/* Procedure Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{procedure?.procedure_code}</h1>
            <h2 className="text-lg text-gray-600">{procedure?.title}</h2>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline">{procedure?.estimated_time_hours}h</Badge>
            <Badge variant="outline">Level {procedure?.difficulty_level}</Badge>
            <WISBookmarkButton procedureId={procedureId} />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="border-b rounded-none">
          <TabsTrigger value="procedure">Procedure</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="parts">Parts</TabsTrigger>
          <TabsTrigger value="diagrams">Diagrams</TabsTrigger>
        </TabsList>

        <TabsContent value="procedure" className="flex-1 p-0">
          <WISProcedureSteps
            procedureId={procedureId}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
          />
        </TabsContent>

        <TabsContent value="tools" className="flex-1 p-4">
          <WISToolsList procedureId={procedureId} />
        </TabsContent>

        <TabsContent value="parts" className="flex-1 p-4">
          <WISPartsList procedureId={procedureId} />
        </TabsContent>

        <TabsContent value="diagrams" className="flex-1 p-4">
          <WISDiagramsViewer procedureId={procedureId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
```

### 4. Procedure Steps Component
```typescript
// src/components/wis/WISProcedureSteps.tsx
const WISProcedureSteps: React.FC<WISProcedureStepsProps> = ({
  procedureId,
  currentStep,
  onStepChange
}) => {
  const { data: steps, isLoading } = useWISProcedureSteps(procedureId);
  const currentStepData = steps?.[currentStep - 1];

  return (
    <div className="flex h-full">
      {/* Step Navigation Sidebar */}
      <div className="w-64 border-r bg-gray-50">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Steps ({steps?.length || 0})</h3>
        </div>
        <ScrollArea className="flex-1">
          {steps?.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "p-3 border-b cursor-pointer hover:bg-gray-100",
                currentStep === index + 1 && "bg-blue-50 border-r-2 border-blue-500"
              )}
              onClick={() => onStepChange(index + 1)}
            >
              <div className="text-sm font-medium">Step {index + 1}</div>
              <div className="text-xs text-gray-600 truncate">
                {step.title || step.instruction?.substring(0, 50)}
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Step Content */}
      <div className="flex-1 flex flex-col">
        {currentStepData && (
          <>
            {/* Step Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  Step {currentStep} of {steps?.length}
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStepChange(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStepChange(Math.min(steps?.length || 1, currentStep + 1))}
                    disabled={currentStep === steps?.length}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>

              {currentStepData.title && (
                <h3 className="text-xl mb-2">{currentStepData.title}</h3>
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1 p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Instructions */}
                <div className="space-y-4">
                  <div className="prose max-w-none">
                    <ReactMarkdown>{currentStepData.instruction}</ReactMarkdown>
                  </div>

                  {currentStepData.warnings && currentStepData.warnings.length > 0 && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Safety Warning</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc list-inside">
                          {currentStepData.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {currentStepData.torque_specs && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Torque Specifications</h4>
                      <div className="text-sm">
                        {Object.entries(currentStepData.torque_specs).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span>{key}:</span>
                            <span className="font-mono">{value as string}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Media */}
                <div className="space-y-4">
                  {currentStepData.image_urls && currentStepData.image_urls.length > 0 && (
                    <WISImageGallery images={currentStepData.image_urls} />
                  )}

                  {currentStepData.video_url && (
                    <WISVideoPlayer url={currentStepData.video_url} />
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
```

## Search Implementation

### Multi-Modal Search Strategy
```typescript
// src/hooks/useWISSearch.ts
interface SearchOptions {
  query: string;
  searchType: 'all' | 'procedures' | 'parts' | 'bulletins';
  modelId?: string;
  systemId?: string;
}

const useWISSearch = (options: SearchOptions) => {
  return useQuery({
    queryKey: ['wis-search', options],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('wis_search', {
        search_query: options.query,
        search_type: options.searchType,
        model_id: options.modelId,
        system_id: options.systemId
      });

      if (error) throw error;
      return data;
    },
    enabled: options.query.length > 2,
    staleTime: 30000 // Cache for 30 seconds
  });
};

// Supabase Function: wis_search
CREATE OR REPLACE FUNCTION wis_search(
    search_query TEXT,
    search_type TEXT DEFAULT 'all',
    model_id UUID DEFAULT NULL,
    system_id UUID DEFAULT NULL
)
RETURNS TABLE(
    result_type TEXT,
    id UUID,
    title TEXT,
    description TEXT,
    code TEXT,
    rank REAL
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Search procedures
    IF search_type IN ('all', 'procedures') THEN
        RETURN QUERY
        SELECT
            'procedure'::TEXT as result_type,
            p.id,
            p.title,
            p.description,
            p.procedure_code as code,
            ts_rank(p.search_vector, plainto_tsquery('english', search_query)) as rank
        FROM wis_procedures p
        JOIN wis_components c ON p.component_id = c.id
        JOIN wis_systems s ON c.system_id = s.id
        JOIN wis_models m ON s.model_id = m.id
        WHERE p.search_vector @@ plainto_tsquery('english', search_query)
          AND (model_id IS NULL OR m.id = model_id)
          AND (system_id IS NULL OR s.id = system_id)
        ORDER BY rank DESC;
    END IF;

    -- Search service bulletins
    IF search_type IN ('all', 'bulletins') THEN
        RETURN QUERY
        SELECT
            'bulletin'::TEXT as result_type,
            b.id,
            b.title,
            b.description,
            b.bulletin_number as code,
            ts_rank(b.search_vector, plainto_tsquery('english', search_query)) as rank
        FROM wis_service_bulletins b
        WHERE b.search_vector @@ plainto_tsquery('english', search_query)
        ORDER BY rank DESC;
    END IF;

    -- Search by part number
    IF search_type IN ('all', 'parts') THEN
        RETURN QUERY
        SELECT
            'part'::TEXT as result_type,
            pp.procedure_id as id,
            ('Part: ' || pp.description)::TEXT as title,
            pp.part_number as description,
            pp.part_number as code,
            1.0::REAL as rank
        FROM wis_procedure_parts pp
        JOIN wis_procedures p ON pp.procedure_id = p.id
        WHERE pp.part_number ILIKE ('%' || search_query || '%')
           OR pp.mercedes_part_number ILIKE ('%' || search_query || '%')
           OR pp.description ILIKE ('%' || search_query || '%');
    END IF;
END;
$$;
```

## Offline Functionality

### Service Worker Implementation
```typescript
// public/sw.js - Service Worker for Offline Support
const CACHE_NAME = 'wis-offline-v1';
const STATIC_CACHE = [
  '/',
  '/wis',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/images/wis-icons.svg'
];

// Cache strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache-first for static assets
  if (url.pathname.startsWith('/static/') || url.pathname.startsWith('/images/')) {
    event.respondWith(cacheFirst(request));
  }

  // Network-first for API calls
  else if (url.pathname.startsWith('/api/') || url.hostname === 'supabase.co') {
    event.respondWith(networkFirst(request));
  }

  // Stale-while-revalidate for procedures
  else if (url.pathname.startsWith('/wis/')) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Store frequently accessed procedures for offline
const cacheFrequentProcedures = async (procedureIds) => {
  const cache = await caches.open(CACHE_NAME);

  for (const id of procedureIds) {
    const response = await fetch(`/api/wis/procedures/${id}`);
    if (response.ok) {
      await cache.put(`/api/wis/procedures/${id}`, response);
    }
  }
};
```

## Mobile/Tablet Optimization

### Responsive Layout Adaptations
```typescript
// Mobile-first responsive design
const WISMobileInterface: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<'tree' | 'procedure' | 'related'>('tree');

  return (
    <div className="h-screen flex flex-col">
      {/* Mobile Header */}
      <div className="bg-white border-b p-4 flex items-center justify-between lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="font-semibold">WIS Mobile</h1>
        <Button variant="ghost" size="sm">
          <Search className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 flex">
        {/* Collapsible Sidebar */}
        <div className={cn(
          "bg-white border-r transition-transform lg:translate-x-0 lg:relative lg:w-80",
          sidebarOpen ? "translate-x-0 absolute inset-y-0 left-0 w-80 z-50" : "-translate-x-full absolute"
        )}>
          <WISNavigationTree />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <WISProcedureViewer />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="bg-white border-t p-2 flex justify-around lg:hidden">
        <Button
          variant={activeView === 'tree' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('tree')}
        >
          <TreePine className="w-4 h-4 mr-1" />
          Browse
        </Button>
        <Button
          variant={activeView === 'procedure' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('procedure')}
        >
          <FileText className="w-4 h-4 mr-1" />
          Procedure
        </Button>
        <Button
          variant={activeView === 'related' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('related')}
        >
          <Link className="w-4 h-4 mr-1" />
          Related
        </Button>
      </div>
    </div>
  );
};
```

## Performance Optimization

### Image Optimization Strategy
```typescript
// src/components/wis/WISImageGallery.tsx
const WISImageGallery: React.FC<{ images: string[] }> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set<number>());

  // Lazy loading with intersection observer
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = imageRefs.current.indexOf(entry.target as HTMLImageElement);
            if (index !== -1) {
              setLoadedImages(prev => new Set(prev).add(index));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    imageRefs.current.forEach((img) => {
      if (img) observer.observe(img);
    });

    return () => observer.disconnect();
  }, [images]);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
        {loadedImages.has(selectedImage) ? (
          <img
            src={images[selectedImage]}
            alt={`Step image ${selectedImage + 1}`}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        ) : (
          <Skeleton className="w-full h-full" />
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              ref={el => imageRefs.current[index] = el}
              className={cn(
                "flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden",
                selectedImage === index ? "border-blue-500" : "border-gray-200"
              )}
              onClick={() => setSelectedImage(index)}
            >
              {loadedImages.has(index) ? (
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <Skeleton className="w-full h-full" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
```

## Voice Search Integration
```typescript
// src/hooks/useVoiceSearch.ts
const useVoiceSearch = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
    };

    return { recognition, isListening, transcript };
  }, []);
};
```

## Implementation Roadmap

### Phase 1: Core Infrastructure (Weeks 1-2)
1. Database schema creation and migration
2. Basic React components structure
3. Supabase integration setup
4. Authentication and user management

### Phase 2: Navigation & Search (Weeks 3-4)
1. Tree navigation component
2. Full-text search implementation
3. Cross-reference system
4. Basic procedure viewer

### Phase 3: Rich Content (Weeks 5-6)
1. Image gallery and optimization
2. Video player integration
3. PDF viewer for service bulletins
4. Offline functionality

### Phase 4: Mobile Optimization (Weeks 7-8)
1. Responsive design implementation
2. Touch optimization
3. Voice search integration
4. PWA features

### Phase 5: Advanced Features (Weeks 9-10)
1. User bookmarks and notes
2. Real-time bulletin updates
3. Analytics and usage tracking
4. Performance optimization

## Success Metrics

### User Experience Metrics
- **Navigation Efficiency**: Average time to find a procedure < 30 seconds
- **Mobile Usability**: Touch target size ≥ 44px, readable text without zoom
- **Offline Capability**: 80% of core functions work without internet
- **Search Accuracy**: Relevant results in top 3 positions for 90% of queries

### Technical Performance Metrics
- **Page Load Time**: < 3 seconds for procedure pages
- **Image Loading**: Progressive loading with < 1 second visible lag
- **Search Response**: < 500ms for search results
- **Mobile Performance**: Lighthouse score > 90

This comprehensive strategy preserves the proven workflows of the original WIS system while leveraging modern web technologies to create an even better user experience for mechanics and technicians.