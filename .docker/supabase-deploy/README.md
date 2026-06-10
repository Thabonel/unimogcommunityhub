# Supabase Edge Function Docker Deployment

This Docker setup allows you to deploy the `process-invoice-ocr` edge function securely without exposing API keys.

## Quick Start

### 1. Set Up Environment Variables

```bash
# Copy the template
cp .env.template .env

# Edit .env with your actual credentials
nano .env
```

### 2. Deploy the Edge Function

```bash
# Build and run the deployment
docker-compose up --build

# Or run in detached mode
docker-compose up --build -d
```

### 3. View Deployment Logs

```bash
# Follow logs in real-time
docker-compose logs -f

# View logs from completed deployment
docker-compose logs supabase-deploy
```

## What This Does

1. **Builds a Docker container** with Supabase CLI
2. **Authenticates** with your Supabase access token
3. **Links to your project** using the project ID
4. **Sets environment variables** for the edge functions
5. **Deploys** the `process-invoice-ocr` function
6. **Tests** the deployment with a health check

## Required Environment Variables

| Variable | Description | Where to Get |
|----------|-------------|-------------|
| `SUPABASE_ACCESS_TOKEN` | Your personal access token | [Supabase Dashboard](https://supabase.com/dashboard/account/tokens) |
| `SUPABASE_PROJECT_ID` | Project reference ID | `ydevatqwkoccxhtejdor` |
| `ANTHROPIC_API_KEY` | Claude API key for OCR | [Anthropic Console](https://console.anthropic.com/settings/keys) |
| `SUPABASE_SERVICE_ROLE_KEY` | Database service key | Supabase Dashboard > Settings > API |

## Troubleshooting

### Function Not Deploying
```bash
# Check if simplified version exists
ls -la ../../supabase/functions/process-invoice-ocr/

# View deployment logs
docker-compose logs supabase-deploy
```

### Authentication Issues
```bash
# Verify your access token works
supabase projects list --token your_token_here
```

### Missing Environment Variables
```bash
# Check your .env file exists and has values
cat .env
```

## Security Notes

- The `.env` file is gitignored - your credentials stay local
- The Docker container only runs during deployment
- API keys are passed as environment variables, not stored in the image
- Service role key is set as a Supabase secret, not exposed in logs

## Advanced Usage

### Deploy Specific Function Version

Edit `deploy.sh` to modify deployment behavior:

```bash
# Deploy with custom flags
supabase functions deploy process-invoice-ocr --debug

# Deploy all functions
supabase functions deploy
```

### Custom Docker Build

```bash
# Build image separately
docker build -f Dockerfile -t supabase-deploy ../../

# Run with custom command
docker run --env-file .env -v ../../supabase:/app/supabase:ro supabase-deploy
```

## Next Steps After Deployment

1. **Test the function**: Use your frontend to upload a fuel receipt
2. **Monitor logs**: Check Supabase Dashboard > Edge Functions > Logs
3. **Add full OCR**: Once basic deployment works, add back complex OCR functionality

## Support

If deployment fails:
1. Check the logs: `docker-compose logs supabase-deploy`
2. Verify your environment variables in `.env`
3. Test your credentials manually with Supabase CLI
4. Check the simplified edge function code exists