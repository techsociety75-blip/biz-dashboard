# Business dashboard

A daily and monthly tracker for 5 businesses: dairy farm, food app, GSM gateway, flash bots, and IT services.

Features:
- Daily entry per business: status, revenue, spent, tasks, issues, notes
- Automatic daily and monthly profit calculation (revenue minus spent)
- Monthly view with a chart comparing all 5 businesses
- Custom reminder dates that show a banner when you open the app
- One-click final report download once a month has 30+ days
- Password-protected, no login account needed
- Works on any device, from any browser, with a permanent URL

---

## Deploy this in about 10 minutes (no coding required)

### Step 1 - Create a GitHub repository
1. Go to https://github.com and sign in (or create a free account).
2. Click "New repository". Name it anything, e.g. `biz-dashboard`. Keep it private if you want. Click "Create repository".
3. On your computer, upload all the files from this folder into that repository. The easiest way:
   - On the new repo's GitHub page, click "uploading an existing file".
   - Drag and drop every file and folder from this project into the upload box.
   - Click "Commit changes".

### Step 2 - Create a free Postgres database
1. Go to https://vercel.com and sign in (you can sign in with your GitHub account).
2. From your Vercel dashboard, click "Storage" in the top menu, then "Create Database".
3. Choose "Postgres" (Vercel's own, or "Neon" - both have a free tier). Follow the prompts and create it.
4. Once created, open the database and find the "Connection string" or "Quickstart" tab. Copy the value that looks like:
   `postgres://user:password@host/dbname?sslmode=require`
   Keep this copied - you will paste it in Step 4.

### Step 3 - Import the project into Vercel
1. Back on your Vercel dashboard, click "Add New" -> "Project".
2. Select the GitHub repository you created in Step 1 and click "Import".
3. Vercel will detect this is a Next.js project automatically. Do not click Deploy yet - go to Step 4 first.

### Step 4 - Set your environment variables
Still on the import screen (or after, in Project Settings -> Environment Variables), add these three:

| Name | Value |
|---|---|
| `POSTGRES_URL` | the connection string you copied in Step 2 |
| `DASHBOARD_PASSWORD` | any password you want to use to unlock the dashboard |
| `AUTH_SECRET` | any long random string, e.g. mash your keyboard for 40 characters |

### Step 5 - Deploy
1. Click "Deploy".
2. Wait about 1-2 minutes. Vercel will give you a URL like `https://biz-dashboard-yourname.vercel.app`.
3. Open that URL on any device - phone, laptop, tablet. Enter the password you set in Step 4. You're in.

That URL is permanent, works from anywhere, and needs no Claude account or login - just the password you chose.

---

## Using the dashboard

- **Daily tab**: click any business card to log today's status, revenue, spent, tasks, issues, and notes. Use the arrows to look at past days.
- **Monthly tab**: see the running total revenue, spend, and profit for the whole month, per business and combined, plus a chart. Once the month has at least 30 days, a "Download final report" button appears - click it to get a CSV file with the full breakdown.
- **Reminders tab**: pick which day(s) of the month you want a reminder banner to appear (e.g. the 1st and 15th) nudging you to log revenue and spend if you haven't yet that day.

## Important notes

- This app only shows reminders when you actively open it on the reminder date - it cannot send push notifications, texts, or emails when closed. If you want real push/SMS reminders later, that needs a notification service added on top (ask and this can be built in).
- Your data is stored permanently in the Postgres database you created in Step 2. It is not tied to Claude or any chat - it belongs to you and stays even if you close this conversation.
- Anyone with your dashboard URL still needs the password to see anything, but treat the URL and password like any other business credential - don't share them publicly.
- To change the password later, update the `DASHBOARD_PASSWORD` environment variable in Vercel's Project Settings and redeploy (Vercel does this automatically a few seconds after you save the change).

## Local development (optional, only if you want to test changes on your own computer first)

1. Install Node.js from https://nodejs.org if you don't have it.
2. Copy `.env.example` to `.env.local` and fill in real values.
3. Run `npm install` then `npm run dev`.
4. Open `http://localhost:3000`.
