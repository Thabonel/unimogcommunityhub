```
 Proven Code Libraries Found

     Primary: Mapbox Official Integration

     - react-map-gl (Official React wrapper)
       - Installation: npm install react-map-gl mapbox-gl @types/mapbox-gl
       - Fully reactive components with TypeScript support
       - Official React-friendly API wrapper
     - @mapbox/mapbox-gl-directions (Official Directions Plugin)
       - Installation: npm install @mapbox/mapbox-gl-directions
       - Proven directions integration with UI controls
       - Official Mapbox plugin with routing profiles

     Implementation Approach

     1. Use react-map-gl for main map component (battle-tested)
     2. Integrate @mapbox/mapbox-gl-directions for routing (official plugin)
     3. Follow official Mapbox React tutorial patterns

     Proven Code Examples

     - Official Mapbox GL Directions example (HTML/JS)
     - GeeksforGeeks React travel planner implementation
     - Multiple TypeScript integration patterns found
     - react-waypoint for scroll-triggered interactions

     Dependencies Required

     npm install react-map-gl mapbox-gl @mapbox/mapbox-gl-directions @types/mapbox-gl

     🔧 Implementation Strategy

     1. Replace TripMap placeholder with react-map-gl component
     2. Add MapboxDirections plugin for route planning
     3. Integrate with existing template system
     4. Maintain current architecture patterns

     All code sources are from official Mapbox documentation and proven community 
     implementations. No custom code creation needed - just integration of tested libraries.
WIS Interface: Upgrade to Professional UX/Product Spec
```
```
                                 │

```
```
     │                                                                                        │
     
```
```
│ Gap Analysis: Current Implementation vs. Target Spec                                   │

```
```
     │                                                                                        │
     
```
```
│ ✅ What We Already Have (Strengths)                                                     │

```
```
     │                                                                                        │
     
```
```
│ 1. Core Search Functionality: Working wis_search RPC integration with real database    │

```
```
     
```
```
│ 2. Document Detail Views: Complete technical content display with chunks and media     │

```
```
     
```
```
│ 3. Related Item Navigation: Clickable cross-links between procedures, parts, bulletins │

```
```
     │ 4. Media Integration: Working signed URL resolution via wis_media_url                  │
     │ 5. Responsive Foundation: Basic mobile-friendly layout structure                       │
     
```
```
│                                                                                        │

```
```
     
```
```
│ 🔄 Major Gaps to Bridge                                                                │

```
```
     │                                                                                        │
     
```
```
│ 1. Search & Navigation UX (HIGH IMPACT)                                                │

```
```
     
```
```
│                                                                                        │

```
```
     
```
```
│ Current: Basic search input with tabs                                                  │

```
```
     
```
```
│ Target: Professional search with model scope, live suggestions, result grouping        │

```
```
     │                                                                                        │
     │ Missing:                                                                               │
     
```
```
│ - Model selector with persistence ("Select Your Vehicle")                              │

```
```
     │ - Model-biased search (prepend model tokens like "U1700L 435 OM366")                   │
     │ - Debounced live suggestions while typing                                              │
     
```
```
│ - Result grouping by doc_id instead of separate tabs                                   │

```
```
     
```
```
│ - Global sticky search bar                                                             │

```
```
     
```
```
│                                                                                        │

```
```
     
```
```
│ 2. Filtering System (HIGH IMPACT)                                                      │

```
```
     
```
```
│                                                                                        │

```
```
     │ Current: No filters                                                                    │
     │ Target: Left rail/drawer with smart filters                                            │
     │                                                                                        │
     
```
```
│ Missing:                                                                               │

```
```
     
```
```
│ - Doc Type, System, Difficulty multi-select filters                                    │

```
```
     │ - "With Media" toggle filter                                                           │
     
```
```
│ - Active filter chips above results                                                    │

```
```
     
```
```
│ - Client-side result refinement                                                        │

```
```
     
```
```
│                                                                                        │

```
```
     │ 3. Result Cards Layout (MEDIUM IMPACT)                                                 │
     
```
```
│                                                                                        │

```
```
     │ Current: Basic cards with expand/collapse                                              │
     
```
```
│ Target: Streamlined cards with inline media strip                                      │

```
```
     
```
```
│                                                                                        │

```
```
     
```
```
│ Missing:                                                                               │

```
```
     
```
```
│ - Inline media thumbnails (up to 3 per card)                                           │

```
```
     │ - System badges (Engine/Transmission/Axles/etc.)                                       │
     │ - Difficulty indicators (1-5 stars)                                                    │
     │ - Virtualized list for performance (>100 results)                                      │
     
```
```
│ - "Add to Workspace" bookmarking                                                       │

```
```
     
```
```
│                                                                                        │

```
```
     │ 4. Document Detail Polish (MEDIUM IMPACT)                                              │
     │                                                                                        │
     │ Current: Working but basic modal                                                       │
     │ Target: Professional detail view with enhanced UX                                      │
     │                                                                                        │
     │ Missing:                                                                               │
     │ - Header toolbar (Print | Copy link | "Open in Barry")                                 │
     
```
```
│ - Step numbering and safety warnings highlighting                                      │

```
```
     
```
```
│ - Cross-links panel ("Related parts", "Related bulletins")                             │

```
```
     │ - Horizontal media gallery with lightbox                                               │
     │ - "Preload media" offline functionality                                                │
     │                                                                                        │
     │ 5. Barry Integration (HIGH IMPACT)                                                     │
     │                                                                                        │
     
```
```
│ Current: Separate Barry interface                                                      │

```
```
     
```
```
│ Target: Integrated AI panel with document context                                      │

```
```
     │                                                                                        │
     
```
```
│ Missing:                                                                               │

```
```
     │ - Right rail/slide-over Barry chat panel                                               │
     
```
```
│ - Context-aware queries using current document                                         │

```
```
     │ - "Manual Content" sidebar showing referenced docs                                     │
     
```
```
│ - Inline media in Barry responses                                                      │

```
```
     │ - Automatic doc citations in answers                                                   │
     
```
```
│                                                                                        │

```
```
     
```
```
│ 6. Mobile Experience (MEDIUM IMPACT)                                                   │

```
```
     │                                                                                        │
     
```
```
│ Current: Basic responsive layout                                                       │

```
```
     │ Target: Native mobile UX patterns                                                      │
     
```
```
│                                                                                        │

```
```
     │ Missing:                                                                               │
     
```
```
│ - Drawer navigation for filters                                                        │

```
```
     
```
```
│ - Slide-over panels for Barry/media                                                    │

```
```
     │ - Touch-optimized interactions                                                         │
     │ - Native PDF viewer integration                                                        │
     │                                                                                        │
     │ 7. Performance & Polish (LOW-MEDIUM IMPACT)                                            │
     
```
```
│                                                                                        │

```
```
     
```
```
│ Current: Basic loading states                                                          │

```
```
     │ Target: Premium performance experience                                                 │
     │                                                                                        │
     
```
```
│ Missing:                                                                               │

```
```
     
```
```
│ - Skeleton loaders for cards and images                                                │

```
```
     │ - Lazy loading for media (IntersectionObserver)                                        │
     
```
```
│ - Signed URL auto-renewal                                                              │

```
```
     │ - Keyboard shortcuts (/, Esc, j/k)                                                     │
     │ - Print-optimized CSS                                                                  │
     
```
```
│                                                                                        │

```
```
     
```
```
│ Implementation Plan                                                                    │

```
```
     │                                                                                        │
     
```
```
│ Phase 1: Search & Model Selection (Week 1)                                             │

```
```
     │                                                                                        │
     │ Goal: Transform basic search into professional model-scoped search                     │
     │ 1. Vehicle Model Selector                                                              │
     
```
```
│   - Card grid interface with search and tags                                           │

```
```
     │   - Model persistence in localStorage                                                  │
     │   - Model bias injection into search queries                                           │
     
```
```
│ 2. Enhanced Search UX                                                                  │

```
```
     
```
```
│   - Global sticky search bar                                                           │

```
```
     
```
```
│   - Live search suggestions (debounced)                                                │

```
```
     
```
```
│   - Result grouping by doc_id                                                          │

```
```
     │   - Search scope indicator                                                             │
     
```
```
│ 3. Smart Filtering System                                                              │

```
```
     │   - Left rail filter panel (desktop) / drawer (mobile)                                 │
     
```
```
│   - Multi-select filters: Doc Type, System, Difficulty, Media                          │

```
```
     │   - Active filter chips with one-click removal                                         │
     │   - Client-side result refinement                                                      │
     
```
```
│                                                                                        │

```
```
     │ Phase 2: Result Cards & Media (Week 1)                                                 │
     │                                                                                        │
     │ Goal: Create streamlined, media-rich result cards                                      │
     │ 1. Enhanced Result Cards                                                               │
     │   - Inline media thumbnails (max 3)                                                    │
     
```
```
│   - System and difficulty badges                                                       │

```
```
     │   - Improved typography and spacing                                                    │
     
```
```
│   - Virtualized list for performance                                                   │

```
```
     
```
```
│ 2. Media Integration Improvements                                                      │

```
```
     
```
```
│   - Thumbnail generation and caching                                                   │

```
```
     
```
```
│   - Lightbox modal for images                                                          │

```
```
     
```
```
│   - PDF preview indicators                                                             │

```
```
     │   - Lazy loading with IntersectionObserver                                             │
     
```
```
│ 3. Cross-Reference System                                                              │

```
```
     │   - Auto-detect part numbers in procedures                                             │
     
```
```
│   - "Related parts" and "Related bulletins" panels                                     │

```
```
     
```
```
│   - Smart token matching for recommendations                                           │

```
```
     
```
```
│                                                                                        │

```
```
     
```
```
│ Phase 3: Document Detail Enhancement (Week 2)                                          │

```
```
     │                                                                                        │
     
```
```
│ Goal: Professional document viewing experience                                         │

```
```
     │ 1. Enhanced Detail View                                                                │
     │   - Header toolbar with Print/Copy/Share actions                                       │
     
```
```
│   - Step numbering and safety warning highlights                                       │

```
```
     
```
```
│   - Torque specs and technical tables formatting                                       │

```
```
     
```
```
│   - Cross-links panel with related content                                             │

```
```
     
```
```
│ 2. Media Gallery Upgrade                                                               │

```
```
     │   - Horizontal scrolling gallery                                                       │
     │   - Grouped by media type (Photos/Diagrams/Tables)                                     │
     │   - Full-screen lightbox with zoom                                                     │
     
```
```
│   - PDF viewer integration                                                             │

```
```
     
```
```
│ 3. Offline Capabilities                                                                │

```
```
     
```
```
│   - "Preload media" per document                                                       │

```
```
     │   - Service worker caching                                                             │
     │   - Offline indicator and fallbacks                                                    │
     │                                                                                        │
     
```
```
│ Phase 4: Barry AI Integration (Week 2)                                                 │

```
```
     │                                                                                        │
     │ Goal: Context-aware AI mechanic integration                                            │
     │ 1. Integrated Chat Panel                                                               │
     
```
```
│   - Right rail (desktop) / slide-over (mobile)                                         │

```
```
     
```
```
│   - Context from currently viewed document                                             │

```
```
     │   - "Open in Barry" from any document                                                  │
     
```
```
│ 2. Enhanced AI Responses                                                               │

```
```
     │   - Automatic document citations                                                       │
     │   - Inline media thumbnails in responses                                               │
     │   - Safety warnings prominence                                                         │
     │   - Numbered step recommendations                                                      │
     │ 3. Manual Content Sidebar                                                              │
     
```
```
│   - "Current Reference" tab showing active docs                                        │

```
```
     │   - "Diagrams" tab with media from responses                                           │
     │   - Blue badge indicators for illustrated answers                                      │
     │                                                                                        │
     
```
```
│ Phase 5: Mobile & Performance (Week 3)                                                 │

```
```
     
```
```
│                                                                                        │

```
```
     │ Goal: Native mobile experience and performance optimization                            │
     │ 1. Mobile UX Patterns                                                                  │
     
```
```
│   - Navigation drawer for filters                                                      │

```
```
     │   - Slide-over panels for secondary content                                            │
     
```
```
│   - Touch gestures for media browsing                                                  │

```
```
     │   - Native PDF handling                                                                │
     │ 2. Performance Optimization                                                            │
     
```
```
│   - Skeleton loading states                                                            │

```
```
     
```
```
│   - Image lazy loading and caching                                                     │

```
```
     
```
```
│   - Signed URL renewal automation                                                      │

```
```
     
```
```
│   - Bundle optimization                                                                │

```
```
     │ 3. Accessibility & Polish                                                              │
     
```
```
│   - Keyboard navigation shortcuts                                                      │

```
```
     │   - ARIA labels and focus management                                                   │
     │   - Print-friendly CSS styles                                                          │
     
```
```
│   - Contrast and font size compliance                                                  │

```
```
     
```
```
│                                                                                        │

```
```
     │ Technical Architecture Changes                                                         │
     │                                                                                        │
     
```
```
│ Search Enhancement                                                                     │

```
```
     │                                                                                        │
     │ - Model prefix injection: "${modelTokens} ${userQuery}"                                │
     
```
```
│ - Debounced search with abort controller                                               │

```
```
     
```
```
│ - Result grouping logic: groupChunksByDocument()                                       │

```
```
     
```
```
│ - Filter state management with URL sync                                                │

```
```
     │                                                                                        │
     
```
```
│ Media Pipeline Improvements                                                            │

```
```
     │                                                                                        │
     │ - Thumbnail generation service                                                         │
     │ - Media type detection and icons                                                       │
     │ - Lazy loading intersection observer                                                   │
     │ - Lightbox component with keyboard nav                                                 │
     
```
```
│                                                                                        │

```
```
     │ Barry Integration Points                                                               │
     
```
```
│                                                                                        │

```
```
     │ - Document context provider                                                            │
     │ - Citation extraction from responses                                                   │
     
```
```
│ - Media embedding in chat messages                                                     │

```
```
     │ - Reference panel state management                                                     │
     
```
```
│                                                                                        │

```
```
     │ Success Metrics                                                                        │
     
```
```
│                                                                                        │

```
```
     
```
```
│ - Speed: Search response ≤400ms, TTFMP ≤1.5s                                           │

```
```
     
```
```
│ - Usability: Find procedure in ≤2 interactions                                         │

```
```
     │ - Engagement: Media click-through rates, Barry usage                                   │
     
```
```
│ - Mobile: Touch-friendly interactions, drawer usage                                    │

```
```
     
```
```
│                                                                                        │

```
```
     
```
```
│ Day-1 MVP Checklist                                                                    │

```
```
     │                                                                                        │
     
```
```
│ ✅ Global search with model scope✅ Result cards with inline media thumbnails✅           │

```
```
     │ Enhanced document view with media gallery✅ Barry integration with document             │
     
```
```
│ citations✅ Basic filters: Doc Type, System, With Media✅ Mobile drawer navigation       │

```
```
     │                                                                                        │
     │ This plan transforms our current functional WIS interface into the professional,       │
     │ ergonomic experience specified in your UX document - making it genuinely useful for    │
     
```
```
│ Unimog owners and techs with ≤2 interaction workflows and inline media throughout.     │

```
```
     
```
```
╰────────────────────────────────────────────────────────────────────────────────────────╯

```
```

>
```
```
 one thing I want to add, make sure the the system look at the users profile and always 

```
```
  
```
```
preselct in the drop the users vehicle model, do this once and then let it just stay there 

```
```
  like that, if the user wants to look at a different model they can use the dropdown to 
  select a different one but it wuill always revert to the users model when they go to the 
  
```
```
page

```
```

⏺ Understood! That's a great UX improvement. The system should:

  1. Auto-select user's vehicle model from their profile on first page load
  2. 
```
```
Persist that selection during the session

```
```
  3. Always revert back to the user's model when they return to the page
  4. Allow temporary switching to other models during the session

  This creates a personalized experience where users get their own vehicle's information by
   default, but can still explore other models when needed.

  I'll add this to the implementation plan - it will require:
  - Reading the user's vehicle model from their profile (likely from profiles table)
  - Setting that as the default selection on page load
  - Storing temporary selections in session state
  - Auto-reverting to user's model on page refresh/return

  This fits perfectly with the "Select Your Vehicle" model selector in the professional UX
  spec, making it truly personalized rather than just a generic selector.

  Should I proceed with the full implementation plan that includes this user-centric model
  selection behavior?

>
```
```
 go ahead

```
```
                                                                                          
⏺
```
```
 User approved Claude's plan:

```
```
  ⎿ WIS Interface: Upgrade to Professional UX/Product Spec with Personalized Vehicle 
    Selection

    Gap Analysis: Current Implementation vs. Target Spec

    
```
```
✅ What We Already Have (Strengths)

```
```

    
```
```
1. Core Search Functionality: Working wis_search RPC integration with real database

```
```
    2. Document Detail Views: Complete technical content display with chunks and media
    3. Related Item Navigation: Clickable cross-links between procedures, parts, bulletins
    
```
```
4. Media Integration: Working signed URL resolution via wis_media_url

```
```
    
```
```
5. Responsive Foundation: Basic mobile-friendly layout structure

```
```

    🔄 Major Gaps to Bridge

    
```
```
1. Personalized Vehicle Selection (NEW REQUIREMENT)

```
```

    Current: No model selection (WIS treated as model-agnostic)
    Target: User's vehicle auto-selected from profile, with temporary switching capability

    
```
```
Implementation:

```
```
    - Read user's vehicle model from profiles table on page load
    
```
```
- Auto-select user's model as default in dropdown

```
```
    - Allow temporary model switching during session
    - Always revert to user's model on page refresh/return
    
```
```
- Model bias injection into search queries: "${userModelTokens} ${searchQuery}"

```
```

    
```
```
2. Search & Navigation UX (HIGH IMPACT)

```
```

    
```
```
Current: Basic search input with tabs

```
```
    
```
```
Target: Professional search with personalized model scope, live suggestions, result 

```
```
    
```
```
grouping

```
```

    
```
```
Missing:

```
```
    - Personalized model selector with user's vehicle pre-selected
    - Model-biased search (prepend user's model tokens like "U1700L 435 OM366")
    - Debounced live suggestions while typing
    
```
```
- Result grouping by doc_id instead of separate tabs

```
```
    - Global sticky search bar

    
```
```
3. Filtering System (HIGH IMPACT)

```
```

    
```
```
Current: No filters

```
```
    
```
```
Target: Left rail/drawer with smart filters

```
```

    Missing:
    - Doc Type, System, Difficulty multi-select filters
    
```
```
- "With Media" toggle filter

```
```
    
```
```
- Active filter chips above results

```
```
    
```
```
- Client-side result refinement

```
```

    
```
```
4. Result Cards Layout (MEDIUM IMPACT)

```
```

    
```
```
Current: Basic cards with expand/collapse

```
```
    
```
```
Target: Streamlined cards with inline media strip

```
```

    
```
```
Missing:

```
```
    - Inline media thumbnails (up to 3 per card)
    
```
```
- System badges (Engine/Transmission/Axles/etc.)

```
```
    
```
```
- Difficulty indicators (1-5 stars)

```
```
    
```
```
- Virtualized list for performance (>100 results)

```
```
    
```
```
- "Add to Workspace" bookmarking

```
```

    
```
```
5. Document Detail Polish (MEDIUM IMPACT)

```
```

    
```
```
Current: Working but basic modal

```
```
    
```
```
Target: Professional detail view with enhanced UX

```
```

    
```
```
Missing:

```
```
    - Header toolbar (Print | Copy link | "Open in Barry")
    
```
```
- Step numbering and safety warnings highlighting

```
```
    
```
```
- Cross-links panel ("Related parts", "Related bulletins")

```
```
    
```
```
- Horizontal media gallery with lightbox

```
```
    - "Preload media" offline functionality

    
```
```
6. Barry Integration (HIGH IMPACT)

```
```

    
```
```
Current: Separate Barry interface

```
```
    
```
```
Target: Integrated AI panel with document context

```
```

    
```
```
Missing:

```
```
    - Right rail/slide-over Barry chat panel
    
```
```
- Context-aware queries using current document

```
```
    - "Manual Content" sidebar showing referenced docs
    
```
```
- Inline media in Barry responses

```
```
    
```
```
- Automatic doc citations in answers

```
```

    Implementation Plan

    
```
```
Phase 1: Personalized Model Selection & Search (Week 1 Priority)

```
```

    
```
```
Goal: Transform WIS into personalized experience with user's vehicle as default

```
```

    
```
```
1. User Vehicle Integration

```
```
    
```
```
  - Query user's profile to get their vehicle model/year

```
```
    
```
```
  - Create vehicle model mapping to WIS search tokens

```
```
    
```
```
  - Auto-select user's vehicle on page load

```
```
      - Implement session-based temporary model switching
    
```
```
2. Enhanced Vehicle Selector

```
```
    
```
```
  - Card grid interface with user's vehicle highlighted

```
```
      - Search and filter by year, engine type, series
    
```
```
  - "Your Vehicle" badge for user's model

```
```
    
```
```
  - Model persistence: user's vehicle (default) vs session choice

```
```
    3. Model-Biased Search
    
```
```
  - Prepend model tokens to all searches: "${modelTokens} ${userQuery}"

```
```
    
```
```
  - Model-specific result prioritization

```
```
    
```
```
  - Search scope indicator showing active model

```
```
    
```
```
  - Fallback to generic search if no model-specific results

```
```

    
```
```
Phase 2: Professional Search UX (Week 1)

```
```

    
```
```
Goal: Create fast, intuitive search experience

```
```

    
```
```
1. Global Search Enhancement

```
```
    
```
```
  - Sticky search bar with model scope chip

```
```
      - Debounced live suggestions while typing
    
```
```
  - Result grouping by doc_id (not separate tabs)

```
```
      - Search history for user's frequent queries
    
```
```
2. Smart Filtering System

```
```
    
```
```
  - Left rail filter panel (desktop) / drawer (mobile)

```
```
    
```
```
  - Multi-select filters: Doc Type, System, Difficulty, Media

```
```
      - Active filter chips with one-click removal
      - Client-side result refinement for performance
    
```
```
3. Search Results Optimization

```
```
      - Group chunks by document ID
    
```
```
  - Show best snippet per document

```
```
    
```
```
  - Model-relevance scoring boost

```
```
      - Empty state with model-specific suggestions

    
```
```
Phase 3: Enhanced Result Cards & Media (Week 1-2)

```
```

    
```
```
Goal: Create streamlined, media-rich result cards

```
```

    1. Professional Result Cards
    
```
```
  - Inline media thumbnails (max 3 per card)

```
```
    
```
```
  - System badges (Engine/Transmission/Axles/etc.)

```
```
      - Difficulty indicators (1-5 stars)
      - User's model compatibility indicators
    
```
```
2. Media Integration Improvements

```
```
    
```
```
  - Thumbnail generation and caching

```
```
      - Lightbox modal for images
    
```
```
  - PDF preview with first page thumbnail

```
```
    
```
```
  - Lazy loading with IntersectionObserver

```
```
    3. Performance Optimization
    
```
```
  - Virtualized list for >100 results

```
```
    
```
```
  - Progressive image loading

```
```
    
```
```
  - Signed URL caching and renewal

```
```

    Phase 4: Document Detail Enhancement (Week 2)

    
```
```
Goal: Professional document viewing experience

```
```

    
```
```
1. Enhanced Detail View

```
```
    
```
```
  - Header with user's model compatibility indicator

```
```
    
```
```
  - Toolbar: Print | Copy link | "Open in Barry" | "Add to My Workspace"

```
```
      - Step numbering with safety warning highlights
    
```
```
  - Torque specs and technical tables formatting

```
```
    
```
```
2. Cross-Reference System

```
```
      - "Related parts for your model" prioritization
      - Smart token matching for user's vehicle
    
```
```
  - Cross-links panel with model-specific recommendations

```
```
    
```
```
3. Media Gallery Upgrade

```
```
    
```
```
  - Horizontal scrolling gallery grouped by type

```
```
      - Full-screen lightbox with zoom and navigation
    
```
```
  - PDF viewer integration for technical diagrams

```
```
    
```
```
  - "Download for offline" functionality

```
```

    
```
```
Phase 5: Barry AI Integration (Week 2-3)

```
```

    Goal: Context-aware AI mechanic with user vehicle knowledge

    1. Personalized AI Integration
    
```
```
  - Barry knows user's vehicle model automatically

```
```
      - Context from currently viewed document
    
```
```
  - "Ask Barry about your [Model]" prompts

```
```
    
```
```
  - Right rail/slide-over chat panel

```
```
    2. Enhanced AI Responses
      - Model-specific answers prioritized
    
```
```
  - Automatic document citations with relevance to user's vehicle

```
```
    
```
```
  - Inline media thumbnails in responses

```
```
    
```
```
  - Safety warnings prominence for user's model

```
```
    3. Manual Content Integration
    
```
```
  - "Current Reference" tab showing active docs

```
```
    
```
```
  - "For Your Vehicle" section in Barry responses

```
```
    
```
```
  - Blue badge indicators for illustrated answers

```
```
      - Quick actions: "Save to My Workspace", "Print for garage"

    Phase 6: Mobile & Polish (Week 3)

    Goal: Native mobile experience with personalized touch

    
```
```
1. Mobile UX Patterns

```
```
      - User's vehicle always visible in header
    
```
```
  - Navigation drawer with model-specific shortcuts

```
```
      - Slide-over panels for Barry and media
    
```
```
  - Touch gestures optimized for technical content

```
```
    2. Personalization Features
      - "My Workspace" for bookmarked procedures
    
```
```
  - Recent searches for user's vehicle

```
```
    
```
```
  - Offline pack for user's most-used procedures

```
```
      - Push notifications for new bulletins affecting user's model

    
```
```
Technical Implementation Details

```
```

    
```
```
User Vehicle Integration

```
```

    // Get user's vehicle from profile
    const getUserVehicle = async (userId: string) => {
    
```
```
  const { data } = await supabase

```
```
        .from('profiles')
        .select('vehicle_model, vehicle_year, vehicle_series')
        .eq('id', userId)
    
```
```
    .single();

```
```
      return data;
    
```
```
};

```
```

    
```
```
// Convert to WIS search tokens

```
```
    
```
```
const getModelTokens = (vehicle: UserVehicle) => {

```
```
    
```
```
  return `${vehicle.model} ${vehicle.series} ${vehicle.year}`;

```
```
    
```
```
};

```
```

    
```
```
Model-Biased Search

```
```

    // Enhanced search with model bias
    
```
```
const searchWithModelBias = async (query: string, userModel: string) => {

```
```
    
```
```
  const biasedQuery = `${userModel} ${query}`;

```
```
    
```
```
  return await supabase.rpc('wis_search', { 

```
```
        q: biasedQuery, 
    
```
```
    limit_rows: 40 

```
```
      });
    };

    Vehicle Selector State Management

    interface VehicleState {
      userDefaultModel: UserVehicle;     // From profile, never changes
    
```
```
  currentSessionModel: UserVehicle; // Can be temporarily changed

```
```
      isUsingDefault: boolean;           // True when using user's vehicle
    
```
```
}

```
```

    
```
```
Success Metrics

```
```

    - Personalization: 90% of users use default model selection
    - Speed: Model-biased search ≤400ms, TTFMP ≤1.5s  
    
```
```
- Usability: Find procedure for user's vehicle in ≤2 interactions

```
```
    
```
```
- Engagement: Higher Barry usage with model context

```
```
    - Mobile: Touch-friendly model switching

    Day-1 MVP Checklist

    
```
```
✅ User vehicle auto-selection from profile✅ Model-biased search with user's vehicle 

```
```
    tokens✅ Personalized result cards with compatibility indicators✅ Enhanced document 
    view with model-specific context✅ Barry integration with user vehicle awareness✅ 
    
```
```
Basic filters: Doc Type, System, With Media, Model-Specific✅ Mobile drawer with 

```
```
    
```
```
user's vehicle prominently displayed  

```
```

    This plan creates a truly personalized WIS experience where users immediately see 
    information relevant to their specific Unimog model, while still allowing exploration 
    
```
```
of other models when needed.

```
```



⏺ Perfect! Let me start implementing the personalized WIS interface. I'll begin with Phase
  1 - the most critical part: personalized vehicle selection and model-biased search.

⏺ First, let me check the user profile structure to understand how vehicle information is
  stored:

⏺ Bash(find . -name "*.tsx" -o -name "*.ts" | xargs grep -l "profiles" | head -5)
  ⎿  Error: Command timed out after 2m 0.0s

⏺
```
```
 Let me check the user context and profiles more directly:

```
```

⏺ Read(src/contexts/AuthContext.tsx)
  ⎿  Read 
```
```
100 lines (ctrl+r to expand)

```
```

⏺
```
```
 Let me check if there's a user profile hook or service:

```
```


⏺
```
```
 Previous query still processing. Please try again.

```
```


⏺ Previous query still processing. Please try again.


⏺
```
```
 Previous query still processing. Please try again.

```
```

⏺
```
```
 Search(pattern: "**/*profile*")

```
```

╭─────────────────────────────────────────────────────────────────────────────────────────────╮
```
```


```
```
│ >                                                                                           │
╰─────────────────────────────────────────────────────────────────────────────────────────────╯
```
```


```
```
  
```
```
? for shortcuts                                       27 MCP servers failed · /mcp for info

```
```
                                                         Context left until auto-compact: 10%









```
