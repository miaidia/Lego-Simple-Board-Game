# Deploying to Vercel

This guide explains how to deploy this LEGO Star Wars RPG game to Vercel.

## Prerequisites

1. A [GitHub](https://github.com/) account
2. A [Vercel](https://vercel.com/) account (you can sign up using your GitHub account)

## Deployment Steps

### 1. Push your code to GitHub

If your code is not already on GitHub:

1. Create a new repository on GitHub
2. Initialize your local repository (if not already done):
   ```
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Connect your local repository to GitHub:
   ```
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

### 2. Deploy to Vercel

#### Option 1: Using the Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your repository from GitHub
4. Leave the default settings (the project has a `vercel.json` file that configures everything)
5. Click "Deploy"

#### Option 2: Using the Vercel CLI

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```
2. Navigate to your project directory and run:
   ```
   vercel
   ```
3. Follow the prompts to authenticate and deploy your project

## Configuration

This project includes a `vercel.json` file with the following configuration:

```json
{
  "version": 2,
  "builds": [
    { "src": "**/*", "use": "@vercel/static" }
  ],
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

This configuration:
- Uses the static build preset for all files
- Routes all requests to the appropriate files, falling back to index.html

## Updating Your Deployment

After making changes to your project:

1. Commit your changes and push to GitHub:
   ```
   git add .
   git commit -m "Your commit message"
   git push
   ```

2. Vercel will automatically deploy the updated version if you've set up automatic deployments.

## Troubleshooting

- If you encounter any issues with paths, ensure all resource paths in your code are relative.
- If scripts or styles don't load, check the browser console for errors related to content security policy.
- For more detailed information, check the Vercel deployment logs in your dashboard.

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Static Site Deployment Guide](https://vercel.com/guides/deploying-static-sites) 
- 