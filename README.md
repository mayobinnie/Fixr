# Fixr - Standalone Repair Management System

A FixFlo-equivalent repair management system built on Next.js and Supabase.
Designed to be deployed standalone, then integrated into Lettly when ready.

## Pages

- `/report` - Public tenant-facing repair submission form (no login required)
- `/agent` - Agent/landlord dashboard for managing jobs (add auth when ready)

## Setup

### 1. Supabase tables
Run `repair_schema.sql` in your Supabase SQL editor.

### 2. Environment variables
Set these in Vercel or `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
RESEND_API_KEY=your_resend_key
```

### 3. Supabase Storage
Create a bucket called `documents` with public access (already exists if using Lettly's Supabase project).

### 4. Deploy
Push to GitHub, connect to Vercel.

## Features

### Tenant portal (/report)
- 5-step guided form: details, category, description, photos, review
- 10 repair categories with subcategories
- Emergency detection and flagging
- Photo upload (camera + file browser, up to 6 photos)
- Auto-generated reference number (RPR-XXXXXX)
- Confirmation email sent on submit via Resend

### Agent dashboard (/agent)
- All jobs listed with status, priority and emergency flags
- Filter by status, search by address/tenant/reference
- Status workflow: new, triaged, assigned, in progress, completed, closed
- Contractor management - add, view and assign to jobs
- Contractor email notification on assignment
- Comms log - every status change and note recorded with timestamp
- Photo viewer

## Integration into Lettly (when ready)
- Import RepairForm component into dashboard maintenance tab
- Import AgentDashboard into its own dashboard tab
- Pass `user_id` from Clerk to filter jobs per landlord
- Link property addresses from portfolio data

## Pricing model for 1,000 property client
- Suggested: £2.50/unit/month = £2,500/month
- Replaces: FixFlo (£700/mo) + rent checker (£25k/yr) + phones person (£25k/yr)
- Client saving: £28,400/year vs current costs
