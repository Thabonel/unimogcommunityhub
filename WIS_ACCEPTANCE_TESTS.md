# Workshop Information System (WIS) Acceptance Tests

## Test Scenarios

### 1. Basic Navigation and UI Tests

#### Test 1.1: Page Access
- **Action**: Navigate to `/workshop`
- **Expected**: 
  - Page loads successfully
  - Shows "Mercedes-Benz Workshop Information System (WIS)" header
  - Displays hero section with WIS description
  - Shows model selector with U1700L pre-selected
  - Shows search/Barry tabs

#### Test 1.2: Model Selection
- **Action**: Click on model selector cards
- **Expected**:
  - U1700L (435 Series) 🇦🇺 is highlighted by default
  - Other models can be selected
  - "Filtering content for: [Model Name]" badge appears
  - Search context updates to selected model

### 2. Workshop Database Search Tests

#### Test 2.1: Basic Search
- **Action**: 
  1. Enter "alternator replacement" in search box
  2. Click Search button
- **Expected**:
  - Search results appear grouped by document type
  - Tabs show: Procedures, Parts, Bulletins, Wiring
  - Results show procedure chunks with "alternator" content
  - Each result shows document title, type badge, and content snippets

#### Test 2.2: Part Number Search
- **Action**:
  1. Select U1700L model
  2. Enter "A000 010 07 20" in search
  3. Press Enter
- **Expected**:
  - Returns parts catalog results
  - Shows part information with photos
  - Media gallery displays part images and diagrams
  - "Open full doc" button expands complete part documentation

#### Test 2.3: Model-Specific Filtering
- **Action**:
  1. Search for "engine oil" with U1700L selected
  2. Switch to U1300L model
  3. Search for same term
- **Expected**:
  - Results change based on selected model
  - U1700L results show OM366 engine specifics
  - Model switching updates search context appropriately

### 3. Document Expansion Tests

#### Test 3.1: Full Document Loading
- **Action**: Click "Open full doc" button on a search result
- **Expected**:
  - Document expands to show all chunks
  - Content displays in logical order (by chunk_index)
  - Button changes to "Collapse"
  - All media for document loads in gallery

#### Test 3.2: Media Gallery Functionality
- **Action**: Interact with media items in results
- **Expected**:
  - Images display as thumbnails with descriptions
  - PDFs show with "Open PDF" button
  - Clicking opens media in new tab
  - Failed media shows error state gracefully

### 4. Barry AI Chat Tests

#### Test 4.1: Basic Chat Functionality
- **Action**: 
  1. Switch to "Chat with Barry" tab
  2. See Barry's greeting message
  3. Type "How do I change oil in U1700L?" 
  4. Send message
- **Expected**:
  - Greeting appears: "G'day! I'm Barry..."
  - Message sends successfully
  - Barry responds with relevant oil change information
  - Response includes manual references if available

#### Test 4.2: Technical Question with References
- **Action**: Ask "What's the torque specification for wheel bolts?"
- **Expected**:
  - Barry provides specific torque values
  - Response includes references to relevant manual sections
  - Reference badges appear below Barry's message
  - Manual Content sidebar shows referenced documents

#### Test 4.3: Manual Content Sidebar
- **Action**: 
  1. Ask a technical question that generates references
  2. Check "Current Reference" tab in sidebar
  3. Click "Open full doc" on a reference
- **Expected**:
  - References appear in sidebar
  - Document expands showing full procedure
  - Diagrams tab shows any referenced images
  - Media thumbnails are clickable

### 5. Category Filter Tests

#### Test 5.1: Procedure Filtering
- **Action**: 
  1. Search for "maintenance"
  2. Click "Procedures" tab
- **Expected**:
  - Only procedure-type documents shown
  - Results show step-by-step instructions
  - Tab count reflects filtered results
  - Procedure-specific icons and badges

#### Test 5.2: Wiring Diagram Filtering
- **Action**:
  1. Search for "electrical"
  2. Click "Wiring" tab
- **Expected**:
  - Only documents with diagram/schematic media shown
  - Results focus on electrical procedures and bulletins
  - Media gallery emphasizes wiring diagrams
  - Electrical schematic thumbnails visible

### 6. Error Handling Tests

#### Test 6.1: Empty Search Results
- **Action**: Search for "nonexistent term xyz123"
- **Expected**:
  - "No Results Found" message appears
  - Suggestion to try different search terms
  - No error messages in console
  - Interface remains functional

#### Test 6.2: Media Loading Failures
- **Action**: View document with broken media references
- **Expected**:
  - Failed media shows "Failed to load" state
  - Other media items still load normally
  - No JavaScript errors
  - Document content still accessible

#### Test 6.3: Barry API Failures
- **Action**: Send message when OpenAI API is unavailable
- **Expected**:
  - Barry responds with fallback message
  - No chat interface breakage
  - Error logged appropriately
  - User can continue chatting

### 7. Performance Tests

#### Test 7.1: Search Response Time
- **Action**: Perform various searches
- **Expected**:
  - Search results appear within 2-3 seconds
  - Loading states show during searches
  - Large media galleries load progressively
  - Interface remains responsive

#### Test 7.2: Media Loading Performance
- **Action**: Open documents with multiple images
- **Expected**:
  - Thumbnails load quickly
  - Lazy loading prevents performance issues
  - Failed loads don't block other content
  - Signed URLs work consistently

### 8. Integration Tests

#### Test 8.1: Cross-Component Communication
- **Action**: 
  1. Search in Workshop Database
  2. Switch to Barry tab
  3. Ask about search results
- **Expected**:
  - Model selection persists across tabs
  - Barry context includes selected model
  - Manual Content sidebar updates appropriately
  - No data loss between components

#### Test 8.2: Responsive Design
- **Action**: Access on mobile device
- **Expected**:
  - Layout adapts to mobile screen
  - Touch interactions work properly
  - Media gallery remains usable
  - Chat interface is mobile-friendly

## Pass/Fail Criteria

### Critical (Must Pass)
- [ ] Page loads without errors
- [ ] Search returns relevant results
- [ ] Barry chat responds to questions
- [ ] Media displays correctly
- [ ] Model selection affects results

### Important (Should Pass)
- [ ] Document expansion works
- [ ] References link correctly
- [ ] Error states handle gracefully
- [ ] Performance meets expectations
- [ ] Mobile interface functional

### Nice-to-Have (Could Pass)
- [ ] Advanced filtering works perfectly
- [ ] All edge cases handled
- [ ] Optimal loading performance
- [ ] Perfect responsive design

## Environment Requirements

- Supabase database with WIS tables populated
- Valid OpenAI API key for Barry responses
- Storage buckets with sample media files
- Test data including:
  - U1700L procedures and parts
  - Sample media files (PDFs, images)
  - Service bulletins with various severities

## Test Data Suggestions

### Sample Search Queries
1. "alternator replacement" - should find electrical procedures
2. "A000 010 07 20" - sample part number search
3. "brake service" - safety-critical procedure
4. "oil change OM366" - engine-specific maintenance
5. "transmission fluid" - fluid specifications

### Sample Barry Questions
1. "How do I change oil in my U1700L?"
2. "What's the tire pressure for 335/80R20?"
3. "My engine is overheating, what should I check?"
4. "How do I engage the diff locks?"
5. "What oil filter do I need for OM366 engine?"