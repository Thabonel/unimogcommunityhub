# Free Tier Access System - Implementation Plan

**Status**: 📋 Planned (Not Yet Implemented)
**Priority**: Medium
**Estimated Effort**: 4-6 hours
**Target Release**: Post-Launch Enhancement

---

## Overview

Implement a "freemium" model where users whose 30-day trial expires can continue accessing social/community features but cannot access Barry AI or other premium features without subscribing.

### Business Rationale
- **Retain users** after trial expires instead of losing them
- **Build community engagement** with free social features
- **Create upgrade funnel** from engaged free users → paying customers
- **Reduce churn** by keeping users in the platform ecosystem

---

## Current System

### Trial System (Existing)
- Location: `src/hooks/use-trial.ts`
- Table: `user_trials`
- States: `loading`, `active`, `expired`, `not_started`
- Duration: 30 days from signup

### Access Control (Missing)
- ❌ No feature-level access control
- ❌ Expired trial users have no path forward
- ❌ No differentiation between free vs premium features

---

## Proposed Access Tiers

### 1. Trial User (0-30 days)
**Status**: `trial_active`
**Access**: Full platform access
- ✅ Barry AI Assistant
- ✅ WIS-EPC (limited sessions)
- ✅ Community features
- ✅ Profile management
- ✅ All navigation

### 2. Free User (Post-Trial, No Subscription)
**Status**: `free`
**Access**: Community-only access
- ❌ Barry AI Assistant (blocked)
- ❌ WIS-EPC (blocked)
- ✅ Community page (posts, comments, likes)
- ✅ Profile page (view/edit own profile)
- ✅ Member directory (view other profiles)
- ✅ Marketplace (browse/post listings)
- ✅ Basic navigation

### 3. Premium User (Paid Subscription)
**Status**: `premium` or `lifetime`
**Access**: Full platform access (same as trial)
- ✅ Everything unlocked

---

## Implementation Details

### Phase 1: Access Control Hook

**File**: `src/hooks/use-feature-access.ts` (CREATE NEW)

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { useTrial } from '@/hooks/use-trial';

export type AccessTier = 'free' | 'trial' | 'premium' | 'lifetime';

export interface FeatureAccess {
  tier: AccessTier;
  canAccessBarry: boolean;
  canAccessWIS: boolean;
  canAccessCommunity: boolean;
  canAccessProfile: boolean;
  canAccessMarketplace: boolean;
  isPremium: boolean;
}

export function useFeatureAccess(): FeatureAccess {
  const { user, profile } = useAuth();
  const { trialStatus } = useTrial();

  // Determine access tier
  const tier: AccessTier = determineTier(profile, trialStatus);

  // Calculate feature access
  const isPremium = tier === 'premium' || tier === 'lifetime' || tier === 'trial';

  return {
    tier,
    canAccessBarry: isPremium,
    canAccessWIS: isPremium,
    canAccessCommunity: true, // Always accessible
    canAccessProfile: true,   // Always accessible
    canAccessMarketplace: true, // Always accessible
    isPremium
  };
}

function determineTier(profile: any, trialStatus: string): AccessTier {
  // Check for paid subscription
  if (profile?.subscription_tier === 'lifetime') return 'lifetime';
  if (profile?.subscription_tier === 'premium') return 'premium';

  // Check trial status
  if (trialStatus === 'active') return 'trial';

  // Default to free tier
  return 'free';
}
```

---

### Phase 2: Premium Feature Gate Component

**File**: `src/components/premium/PremiumFeatureGate.tsx` (CREATE NEW)

```typescript
import React from 'react';
import { Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface PremiumFeatureGateProps {
  featureName: string;
  description: string;
  icon?: React.ReactNode;
}

export function PremiumFeatureGate({
  featureName,
  description,
  icon
}: PremiumFeatureGateProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mb-4 flex justify-center">
          {icon || <Lock className="h-16 w-16 text-gray-400" />}
        </div>

        <h2 className="text-2xl font-bold mb-2">
          {featureName} is a Premium Feature
        </h2>

        <p className="text-gray-600 mb-6">
          {description}
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => navigate('/pricing')}
            className="w-full bg-military-green hover:bg-military-green/90"
          >
            <Zap className="mr-2 h-4 w-4" />
            Upgrade to Premium
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/community')}
            className="w-full"
          >
            Continue with Free Features
          </Button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Free users can still access:</p>
          <ul className="mt-2 space-y-1">
            <li>• Community discussions</li>
            <li>• Member profiles</li>
            <li>• Marketplace</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
```

---

### Phase 3: Protect Barry AI Access

**File**: `src/pages/BarryAssistant.tsx` (MODIFY)

```typescript
import React from 'react';
import { SimplifiedBarryChat } from '@/components/barry/SimplifiedBarryChat';
import { useAuth } from '@/contexts/AuthContext';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { PremiumFeatureGate } from '@/components/premium/PremiumFeatureGate';
import { Card } from '@/components/ui/card';
import { Bot, Wrench } from 'lucide-react';

export default function BarryAssistant() {
  const { user, profile } = useAuth();
  const { canAccessBarry } = useFeatureAccess();
  const userModel = profile?.unimog_model;

  // Block access for free users
  if (!canAccessBarry) {
    return (
      <PremiumFeatureGate
        featureName="Barry AI Assistant"
        description="Get expert technical advice from Barry, our AI mechanic with access to 67 Unimog manuals. Upgrade to premium to unlock unlimited conversations."
        icon={<Bot className="h-16 w-16 text-military-green" />}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ... existing Barry UI ... */}
    </div>
  );
}
```

---

### Phase 4: Navigation & UI Updates

**File**: `src/components/header/MobileMenu.tsx` (MODIFY)

Add visual indicators for premium features:

```typescript
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { Lock } from 'lucide-react';

export function MobileMenu() {
  const { canAccessBarry } = useFeatureAccess();

  return (
    <nav>
      <Link to="/barry-assistant">
        <Bot />
        Barry AI
        {!canAccessBarry && <Lock className="h-3 w-3 text-gray-400" />}
      </Link>
    </nav>
  );
}
```

**File**: `src/components/barry/FloatingBarryButton.tsx` (MODIFY IF EXISTS)

Hide or disable button for free users:

```typescript
import { useFeatureAccess } from '@/hooks/use-feature-access';

export function FloatingBarryButton() {
  const { canAccessBarry, tier } = useFeatureAccess();

  if (!canAccessBarry) {
    return (
      <Button className="relative" disabled>
        <Bot />
        <span className="absolute -top-1 -right-1 bg-yellow-500 text-xs px-1 rounded">
          Premium
        </span>
      </Button>
    );
  }

  // ... normal button
}
```

---

### Phase 5: Upgrade Prompts

**File**: `src/components/premium/UpgradePrompt.tsx` (CREATE NEW)

```typescript
import React from 'react';
import { X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function UpgradePrompt() {
  const [dismissed, setDismissed] = React.useState(false);
  const navigate = useNavigate();

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-military-green to-camo-brown text-white p-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5" />
          <span className="font-medium">
            Missing Barry? Upgrade to premium for unlimited AI assistance.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/pricing')}
          >
            View Plans
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissed(true)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**Usage**: Add to Community page layout for free users

---

### Phase 6: Database Schema (Optional Enhancement)

**Migration**: `supabase/migrations/add_access_tier_to_profiles.sql`

```sql
-- Add access_tier column to profiles for easier queries
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS access_tier TEXT
CHECK (access_tier IN ('free', 'trial', 'premium', 'lifetime'))
DEFAULT 'free';

-- Create function to compute access tier
CREATE OR REPLACE FUNCTION compute_access_tier(profile_id UUID)
RETURNS TEXT AS $$
DECLARE
  tier TEXT;
  subscription_tier TEXT;
  trial_status TEXT;
BEGIN
  -- Get subscription tier
  SELECT p.subscription_tier INTO subscription_tier
  FROM profiles p
  WHERE p.id = profile_id;

  -- Check for paid subscription
  IF subscription_tier = 'lifetime' THEN
    RETURN 'lifetime';
  ELSIF subscription_tier = 'premium' THEN
    RETURN 'premium';
  END IF;

  -- Check trial status
  SELECT
    CASE
      WHEN ut.expires_at > NOW() THEN 'trial'
      ELSE 'free'
    END INTO trial_status
  FROM user_trials ut
  WHERE ut.user_id = profile_id;

  RETURN COALESCE(trial_status, 'free');
END;
$$ LANGUAGE plpgsql;

-- Create index for faster tier lookups
CREATE INDEX IF NOT EXISTS idx_profiles_access_tier
ON profiles(access_tier)
WHERE access_tier IS NOT NULL;
```

---

## User Experience Flow

### Scenario 1: Trial Expires
```
Day 0: User signs up → 30-day trial starts → Full access
Day 30: Trial expires → Access tier changes to 'free'
Day 30+: User visits Barry → Sees upgrade gate
         User visits Community → Full access continues
         User sees upgrade prompts → Click "Upgrade" → Pricing page
```

### Scenario 2: Free User Trying Premium Feature
```
1. User clicks "Barry AI" in navigation
2. Route loads → useFeatureAccess() checks tier
3. tier === 'free' → canAccessBarry === false
4. PremiumFeatureGate component renders
5. User sees:
   - "Barry AI is a Premium Feature"
   - Description of what they're missing
   - "Upgrade to Premium" button (primary CTA)
   - "Continue with Free Features" button (secondary)
6. User clicks Upgrade → Navigate to /pricing
```

### Scenario 3: Free User Browsing Community
```
1. User navigates to /community → Full access
2. User sees UpgradePrompt banner at top:
   - "Missing Barry? Upgrade to premium..."
   - Can dismiss or click "View Plans"
3. User can post, comment, like → No restrictions
4. Barry floating button shows "Premium" badge (disabled)
```

---

## Analytics Tracking

### Events to Track

```typescript
// Track blocked feature attempts
trackEvent('premium_feature_blocked', {
  feature: 'barry_ai',
  user_tier: 'free',
  trial_expired_days_ago: 5
});

// Track upgrade prompt views
trackEvent('upgrade_prompt_shown', {
  location: 'barry_gate',
  user_tier: 'free'
});

// Track upgrade CTA clicks
trackEvent('upgrade_cta_clicked', {
  source: 'barry_gate',
  destination: 'pricing_page',
  user_tier: 'free'
});

// Track conversions
trackEvent('trial_to_premium_conversion', {
  days_after_trial_end: 3,
  prompt_source: 'barry_gate'
});
```

---

## Implementation Checklist

### Phase 1: Core Access Control (2 hours)
- [ ] Create `use-feature-access.ts` hook
- [ ] Add tier determination logic
- [ ] Add feature access calculations
- [ ] Test with different user states

### Phase 2: UI Components (1 hour)
- [ ] Create `PremiumFeatureGate.tsx`
- [ ] Create `UpgradePrompt.tsx`
- [ ] Test component rendering

### Phase 3: Protect Routes (1 hour)
- [ ] Modify `BarryAssistant.tsx` page
- [ ] Add access check to route
- [ ] Test navigation blocking

### Phase 4: Navigation Updates (1 hour)
- [ ] Update header/mobile menu
- [ ] Add premium badges to nav items
- [ ] Hide/disable Barry floating button
- [ ] Test visual indicators

### Phase 5: Testing (1-2 hours)
- [ ] Test trial active → full access
- [ ] Test trial expired → limited access
- [ ] Test premium user → full access
- [ ] Test free user upgrade flow
- [ ] Test community access for all tiers
- [ ] Test analytics events firing

### Phase 6: Optional Database Enhancement (30 min)
- [ ] Create migration for `access_tier` column
- [ ] Create `compute_access_tier()` function
- [ ] Test tier computation

---

## Testing Scenarios

### Test Case 1: Active Trial User
```
Given: User with active trial (day 15/30)
When: User navigates to /barry-assistant
Then: Full Barry access granted
And: No upgrade prompts shown
```

### Test Case 2: Expired Trial User (Free Tier)
```
Given: User with expired trial (35 days ago)
When: User navigates to /barry-assistant
Then: PremiumFeatureGate shown
And: Barry is blocked
When: User navigates to /community
Then: Full community access granted
```

### Test Case 3: Premium User
```
Given: User with active premium subscription
When: User navigates to /barry-assistant
Then: Full Barry access granted
When: User navigates anywhere
Then: No upgrade prompts shown
```

### Test Case 4: Free User Conversion Flow
```
Given: User on free tier
When: User clicks "Barry AI" in menu
Then: Sees PremiumFeatureGate
When: User clicks "Upgrade to Premium"
Then: Navigates to /pricing page
When: User completes purchase
Then: Tier updates to 'premium'
And: User can access Barry immediately
```

---

## Migration Strategy

### Existing Users
1. Users currently on active trial → No change
2. Users with expired trial and no subscription → Tier becomes 'free'
3. Users with premium subscription → Tier remains 'premium'

### New Users (After Implementation)
1. Signup → 30-day trial starts (tier: 'trial')
2. Day 30 expires → Tier changes to 'free'
3. User subscribes → Tier changes to 'premium'

---

## Success Metrics

### Key Performance Indicators
- **Trial Conversion Rate**: % of trial users who subscribe
- **Free User Retention**: % of free users who stay active 30+ days post-trial
- **Upgrade Click-Through Rate**: % of free users who click upgrade CTAs
- **Feature Blocking Events**: # of times Barry access is blocked per day
- **Community Engagement (Free Users)**: Posts/comments from free tier users

### Goals
- Trial conversion rate: 10-15%
- Free user 90-day retention: 40%+
- Upgrade CTA click-through: 5%+
- Free users remain engaged in community (3+ posts/month)

---

## Future Enhancements

### Phase 2 Features (After Initial Release)
1. **Limited Barry Access**: 5 questions/month for free users
2. **Freemium WIS Access**: View-only access to selected manuals
3. **Time-Limited Promotions**: "Weekend Barry Access" for free users
4. **Referral Program**: Free users get 1 week premium for each referral
5. **Annual Plan Discount**: Offer 2 months free for annual subscription

### Advanced Features
1. **Dynamic Pricing**: Adjust prices based on user behavior
2. **Win-Back Campaigns**: Email campaigns to expired trial users
3. **Usage-Based Limits**: Soft limits with graceful upgrades
4. **Team Plans**: Multi-user subscriptions for clubs
5. **Partner Integration**: Special access for Unimog dealers/clubs

---

## Technical Considerations

### Performance
- Access checks should be client-side (no extra API calls)
- Cache tier status in AuthContext
- Revalidate on subscription change events

### Security
- Server-side validation in Edge Functions (Barry AI endpoint)
- RLS policies should respect tier status
- Prevent API bypass attempts

### UX Principles
- Never be punishing - free tier should feel valuable
- Make upgrade path clear and obvious
- Celebrate premium features without shaming free users
- Community features should be genuinely useful (not crippled)

---

## Questions to Answer Before Implementation

1. **Pricing Strategy**: What should premium cost per month?
2. **Trial Duration**: Keep 30 days or adjust (45? 60?)?
3. **Free Tier Value**: Is community access alone compelling enough?
4. **Upgrade Incentives**: Any launch promotions (first month free, etc.)?
5. **Grandfather Clause**: Should early adopters get lifetime free access?
6. **Communication**: How to announce this to existing users?

---

## Related Documentation

- `src/hooks/use-trial.ts` - Current trial system
- `CLAUDE.md` - Project context (section: Premium Features)
- `docs/PRICING.md` - Pricing strategy (TODO: create this)
- `docs/SUBSCRIPTION_MANAGEMENT.md` - Subscription admin (TODO: create this)

---

**Last Updated**: 2025-09-30
**Status**: Ready for implementation when approved
**Estimated Timeline**: 1-2 days development + 1 day testing