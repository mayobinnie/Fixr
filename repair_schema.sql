-- Run in Supabase SQL editor

create table if not exists repair_jobs (
  id uuid default gen_random_uuid() primary key,
  reference text unique not null,
  user_id text,
  property_address text not null,
  tenant_name text not null,
  tenant_email text not null,
  tenant_phone text,
  category text not null,
  subcategory text,
  description text not null,
  priority text default 'normal',
  status text default 'new',
  contractor_id uuid references repair_contractors(id),
  contractor_name text,
  contractor_email text,
  contractor_phone text,
  agent_notes text,
  access_instructions text,
  preferred_time text,
  is_emergency boolean default false,
  tenant_notified_at timestamp with time zone,
  contractor_assigned_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists repair_contractors (
  id uuid default gen_random_uuid() primary key,
  user_id text,
  name text not null,
  trade text not null,
  email text,
  phone text,
  notes text,
  active boolean default true,
  created_at timestamp with time zone default now()
);

create table if not exists repair_photos (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references repair_jobs(id) on delete cascade,
  url text not null,
  uploaded_by text default 'tenant',
  created_at timestamp with time zone default now()
);

create table if not exists repair_updates (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references repair_jobs(id) on delete cascade,
  author text not null,
  author_type text not null,
  message text not null,
  status_change text,
  created_at timestamp with time zone default now()
);

-- Open RLS (service key pattern matching Lettly)
alter table repair_jobs enable row level security;
alter table repair_contractors enable row level security;
alter table repair_photos enable row level security;
alter table repair_updates enable row level security;

create policy "allow all" on repair_jobs for all using (true) with check (true);
create policy "allow all" on repair_contractors for all using (true) with check (true);
create policy "allow all" on repair_photos for all using (true) with check (true);
create policy "allow all" on repair_updates for all using (true) with check (true);
