# Meta Ads Campaign Setup - Unimog Community Hub

## Campaign Objective

**Campaign Name**: Unimog Community Hub - Owner Acquisition
**Objective**: Traffic (drive to website) or Conversions (sign-ups)

---

## 🎯 HYPER-TARGETED AUDIENCE SETTINGS

### 1. **Location Targeting**
Target countries where Unimogs are most common:

**Primary Markets:**
- Germany (largest Unimog market)
- Switzerland
- Austria
- Australia
- United States
- South Africa
- Brazil
- Argentina

**Optional Secondary Markets:**
- Netherlands
- Belgium
- France
- United Kingdom
- Canada
- New Zealand

**Targeting Type**: People living in this location

---

### 2. **Age Range**
- **Minimum**: 25 years
- **Maximum**: 65+ years
- **Why**: Unimog ownership requires financial capacity and practical need

---

### 3. **Gender**
- **All Genders** (slight male skew but don't exclude)

---

### 4. **Detailed Targeting (CRITICAL)**

#### **Interest-Based Targeting (Layer 1)**
Use "AND" logic to narrow. Target people who match ALL of these:

**Primary Interests:**
```
Mercedes-Benz (Brand)
AND
Off-roading OR 4x4 vehicles OR Overlanding
```

**Additional Interest Combinations:**
```
Mercedes-Benz
AND
(Camping OR Adventure travel OR Expedition OR Remote travel)
```

```
Mercedes-Benz
AND
(Farming OR Agriculture OR Rural living)
```

```
Heavy equipment OR Commercial vehicles
AND
Off-road vehicles
```

#### **Behavior-Based Targeting (Layer 2)**
- Vehicle owners
- SUV owners (if available in your market)
- Frequent travelers
- Online shopping behavior (for automotive parts)

#### **Job Titles / Employer Targeting (Layer 3)**
Target these job titles/industries:
- Farmers
- Agricultural business owners
- Tour operators
- Expedition companies
- Film production (vehicle support)
- Emergency services
- Forestry workers
- Mining industry
- Safari operators

---

### 5. **Exclusions (Important!)**
Exclude these to save budget:

**Exclude Interests:**
- Luxury cars (excludes Mercedes sedan/sports car fans)
- Sports cars
- Racing
- Formula 1

**Exclude Ages:**
- Under 25 (unlikely to own Unimog)

---

### 6. **Languages**
- English (primary)
- German (for German-speaking markets)
- Portuguese (for Brazil)
- Spanish (for South America)

---

## 📱 AD PLACEMENTS

### Recommended Placements
**Manual Placement** (turn off Advantage+ for more control):

✅ **Include:**
- Facebook Feed
- Facebook Groups Feed
- Facebook Marketplace
- Instagram Feed
- Instagram Stories
- Instagram Explore

❌ **Exclude:**
- Audience Network (lower quality)
- Messenger (lower intent)
- Facebook Video Feeds (distraction)
- In-stream videos (passive watching)

---

## 💰 BUDGET RECOMMENDATIONS

### Testing Phase (Week 1-2)
- **Daily Budget**: $20-30 USD per market
- **Total**: $140-210/week for all markets
- **Goal**: Gather data, find best-performing audiences

### Scale Phase (Week 3+)
- **Daily Budget**: $50-100 USD per best-performing market
- **Focus**: Double down on markets with lowest cost per sign-up

---

## 🎨 AD CREATIVE SPECIFICATIONS

### Image Ads
- **Size**: 1080 x 1080 px (square) or 1200 x 628 px (landscape)
- **Format**: JPG or PNG
- **Text in Image**: Less than 20% (use Meta's tool to check)

### Video Ads
- **Size**: 1080 x 1080 px (square) or 1920 x 1080 px (landscape)
- **Length**: 15-30 seconds (attention span)
- **Format**: MP4 or MOV
- **Captions**: Required (80% watch without sound)

---

## 📝 AD COPY FRAMEWORK

### Headline Options (40 characters max)
```
"Join 500+ Unimog Owners Worldwide"
"The Ultimate Unimog Community"
"Find Unimog Parts & Expert Advice"
"Connect with Fellow Unimog Owners"
"Unimog Owners Unite Here"
```

### Primary Text (125 characters for best mobile display)
```
Find fellow Unimog owners, share routes, get expert mechanical advice, and buy/sell parts. Join the world's premier Unimog community today - completely free!
```

**Alternative Copy:**
```
Tired of generic 4x4 forums? Join UnimogCommunityHub - built exclusively for Unimog owners. Share trails, find rare parts, and connect with enthusiasts worldwide. Free to join!
```

### Description (30 characters max)
```
"Free forever. Join today."
"Built by owners, for owners."
"Your Unimog journey starts here."
```

---

## 🔗 CONVERSION TRACKING

### Facebook Pixel Events to Track
1. **PageView** - Anyone visits site
2. **ViewContent** - Views specific pages (trip planner, marketplace)
3. **CompleteRegistration** - Signs up (KEY METRIC)
4. **Lead** - Submits feedback or inquiry
5. **Search** - Uses Barry AI or manual search

### Install Facebook Pixel
Add to `/index.html` before `</head>`:
```html
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
<!-- End Meta Pixel Code -->
```

Track registration in sign-up success:
```typescript
// After successful registration
if (window.fbq) {
  window.fbq('track', 'CompleteRegistration', {
    content_name: 'Unimog Community Hub Signup',
    status: true
  });
}
```

---

## 🎯 CUSTOM AUDIENCES (Retargeting)

### 1. Website Custom Audience
- **Name**: "Visited but didn't sign up"
- **Rule**: Visited website in last 30 days BUT didn't complete registration
- **Use**: Retarget with "Still thinking? Join free!" ads

### 2. Engaged Video Viewers
- **Name**: "Watched 50% of video"
- **Rule**: Watched 50%+ of any video ad
- **Use**: High intent, show sign-up focused ads

### 3. Lookalike Audiences
After getting 100+ sign-ups:
- **Name**: "Lookalike - Unimog Owners 1%"
- **Source**: People who completed registration
- **Size**: 1% (most similar)
- **Use**: Find more people like your existing members

---

## 📊 SUCCESS METRICS

### Key Performance Indicators
- **Cost Per Registration**: Target < $5 USD
- **Click-Through Rate (CTR)**: Target > 1.5%
- **Cost Per Click (CPC)**: Target < $0.50 USD
- **Conversion Rate**: Target > 10% (visitors to sign-ups)

### Benchmarks by Market
- **Germany**: Expect higher CPM but better conversion (passionate owners)
- **USA**: Lower CPM but more noise, need tighter targeting
- **Australia**: Small market but highly engaged
- **South Africa**: Lower costs, great ROI potential

---

## 🚀 CAMPAIGN STRUCTURE

### Ad Set 1: Overlanders & Adventure
- **Interest**: Mercedes-Benz + Overlanding + Adventure Travel
- **Countries**: USA, Australia, Germany
- **Budget**: $30/day

### Ad Set 2: Agricultural/Commercial
- **Interest**: Mercedes-Benz + Farming + Heavy Equipment
- **Countries**: Germany, South Africa, Brazil
- **Budget**: $25/day

### Ad Set 3: Expedition Operators
- **Job Titles**: Tour operator, expedition guide
- **Interest**: Mercedes-Benz + Off-road vehicles
- **Countries**: All markets
- **Budget**: $20/day

### Ad Set 4: Unimog Owners Lookalike (After 100 sign-ups)
- **Audience**: 1% Lookalike of registered users
- **Countries**: Best performing markets only
- **Budget**: $40/day

---

## 🎬 AD CREATIVE IDEAS

### Image Ad 1: Community Showcase
**Visual**: Grid of 6-9 different Unimogs (user photos)
**Headline**: "500+ Unimogs. One Community."
**CTA**: "Join Free"

### Image Ad 2: Feature Highlight
**Visual**: Screenshot of Trip Planner with GPX route
**Headline**: "Plan Epic Unimog Adventures"
**CTA**: "Start Planning"

### Video Ad 1: Testimonial (15 seconds)
**Script**:
0:00 - Show Unimog on trail
0:03 - "Finding rare parts used to take weeks"
0:06 - Show marketplace screenshot
0:09 - "Now I just ask the community"
0:12 - Show member count + "Join Free" CTA

### Video Ad 2: Problem/Solution (30 seconds)
**Script**:
0:00 - "Tired of generic 4x4 forums?"
0:05 - Show confused person on Reddit
0:08 - "Meet UnimogCommunityHub"
0:10 - Show clean UI, Barry AI, marketplace
0:20 - Show happy user finding answer
0:25 - "Join 500+ owners worldwide. Free."
0:28 - CTA: "Sign Up Now"

---

## 🔍 NEGATIVE KEYWORD TARGETING (For Search Campaigns)

If running Google Ads alongside:
- -toy (excludes toy Unimog searches)
- -model (excludes model kits)
- -rental (you want owners, not renters)
- -dealership (want owners, not buyers)

---

## 📅 LAUNCH TIMELINE

### Week 1-2: Testing
- Launch all 3 ad sets
- Test 3-5 different creatives per ad set
- Monitor daily, pause poor performers

### Week 3-4: Optimization
- Keep only best-performing 2 creatives per ad set
- Increase budget on winning ad sets by 20%
- Create lookalike audiences from sign-ups

### Week 5+: Scaling
- Double budget on best ad set
- Launch lookalike audience campaigns
- Test video ads if image ads perform well

---

## ⚠️ COMMON MISTAKES TO AVOID

1. **Too Broad Targeting**: Never target just "Mercedes-Benz" alone - too many sedan owners
2. **Ignoring Mobile**: 80% will see ads on mobile - optimize for small screens
3. **Generic Copy**: Speak directly to Unimog owners, use insider language
4. **No Pixel**: Install Facebook Pixel BEFORE launching ads
5. **Short Testing Period**: Give each ad 3-7 days before deciding

---

## 🎯 EXACT META ADS SETUP (Step-by-Step)

### Step 1: Campaign Setup
1. Go to Meta Ads Manager
2. Click "+ Create"
3. Choose Objective: **Traffic** (or **Conversions** if pixel installed)
4. Campaign Name: "Unimog Community Hub - Owner Acquisition"
5. Budget: Campaign budget optimization OFF (control per ad set)

### Step 2: Ad Set 1 - Overlanders
1. Ad Set Name: "Overlanders & Adventure - Global"
2. Conversion Location: **Website**
3. Dynamic Creative: OFF
4. Budget: $30 USD per day
5. Start Date: Immediately
6. End Date: None (continuous)

**Audience:**
- Location: Germany, USA, Australia, Switzerland (Living in)
- Age: 25-65+
- Gender: All
- Languages: English, German
- Detailed Targeting:
  - MUST MATCH: Mercedes-Benz (Interest)
  - AND MUST ALSO MATCH: Overlanding OR Off-roading OR Adventure travel
- Exclude: Sports cars, Racing, Formula 1

**Placements:**
- Manual Placements
- Facebook: Feed, Groups Feed, Marketplace
- Instagram: Feed, Stories, Explore
- Uncheck: Audience Network, Messenger, In-stream videos

**Optimization:**
- Optimization Goal: Landing Page Views
- Bid Strategy: Lowest cost
- Delivery Type: Standard

### Step 3: Create Ad
1. Ad Name: "Community Showcase - Image"
2. Identity: Your Facebook Page
3. Format: Single Image
4. Media:
   - Image: Upload 1080x1080px grid of Unimogs
   - Crop: Square (1:1)
5. Primary Text: "Find fellow Unimog owners, share routes, get expert mechanical advice, and buy/sell parts. Join the world's premier Unimog community today - completely free!"
6. Headline: "Join 500+ Unimog Owners Worldwide"
7. Description: "Free forever. Join today."
8. Call to Action: "Sign Up"
9. Website URL: https://unimogcommunityhub.com
10. Display Link: unimogcommunityhub.com

### Step 4: Repeat for Other Ad Sets
Follow same process for Agricultural and Expedition ad sets with different interest targeting.

---

## 📞 SUPPORT & OPTIMIZATION

After launching, monitor these daily for first week:
1. CTR < 1%? → Improve creative
2. CPC > $1? → Tighten targeting
3. Zero conversions? → Check pixel installation
4. High CTR but no sign-ups? → Improve landing page

**Questions? Check metrics in Meta Ads Manager → Performance tab**

---

**Last Updated**: January 2025
**Campaign Budget**: $75-100 USD/day recommended to start
**Expected Results**: 15-30 sign-ups per day within 2 weeks if properly optimized
