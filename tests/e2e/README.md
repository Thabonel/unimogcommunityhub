# Playwright End-to-End Tests

## Setup Instructions

### 1. Create Test User

You have two options to create the test user:

#### Option A: Via Supabase Dashboard (Recommended)

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor
2. Navigate to Authentication → Users
3. Click "Add User" (or "Invite")
4. Create user with:
   - **Email**: `test@unimogcommunityhub.com`
   - **Password**: `TestPassword123!`
   - Check "Auto Confirm Email"

#### Option B: Via Script (Requires Service Role Key)

```bash
# Set your service role key
export SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY>

# Run the creation script
npx tsx scripts/create-test-user.ts
```

### 2. Install Playwright Browsers

```bash
npx playwright install chromium
```

### 3. Run Tests

**Run all tests:**
```bash
npx playwright test
```

**Run specific test file:**
```bash
npx playwright test tests/e2e/auth.spec.ts
```

**Run tests in UI mode (interactive):**
```bash
npx playwright test --ui
```

**Run tests in headed mode (see browser):**
```bash
npx playwright test --headed
```

**Run tests with specific browser:**
```bash
npx playwright test --project=chromium
```

### 4. View Test Results

**Open HTML report:**
```bash
npx playwright show-report
```

## Test Files

- **auth.spec.ts** - Authentication flow tests (sign in, sign out, session)
- **barry-chat.spec.ts** - Barry AI chatbot interaction tests
- **navigation.spec.ts** - Site navigation and page loading tests

## Environment Variables

Create a `.env.test` file (already created) with:

```
TEST_USER_EMAIL=test@unimogcommunityhub.com
TEST_USER_PASSWORD=TestPassword123!
PLAYWRIGHT_BASE_URL=http://localhost:5173
```

## CI/CD Integration

To run tests in CI/CD, ensure these environment variables are set:

- `TEST_USER_EMAIL`
- `TEST_USER_PASSWORD`
- `PLAYWRIGHT_BASE_URL` (or use staging/production URL)
- `CI=true` (for retry configuration)

## Debugging Tests

**Debug mode:**
```bash
npx playwright test --debug
```

**Trace viewer (after test run):**
```bash
npx playwright show-trace trace.zip
```

**Verbose output:**
```bash
npx playwright test --reporter=list --verbose
```

## Common Issues

### Test user doesn't exist
- Create the test user manually via Supabase Dashboard
- Or run `scripts/create-test-user.ts` with service role key

### Tests timeout
- Increase timeout in `playwright.config.ts`
- Check if dev server is running (`npm run dev`)
- Verify PLAYWRIGHT_BASE_URL is correct

### Authentication fails
- Verify test user credentials in `.env.test`
- Check Supabase project URL is correct
- Ensure test user is confirmed (email verified)

### Chat tests fail
- Verify Barry edge function is deployed
- Check Supabase edge function logs
- Test Barry manually in browser first

## Best Practices

1. Always sign in via `beforeEach` for authenticated tests
2. Use data-testid attributes for reliable selectors
3. Add timeouts for async operations (Barry responses)
4. Clean up test data after tests (if creating records)
5. Use `.first()` on locators to avoid multiple element issues
6. Screenshot on failure is automatic (see test-results/)
