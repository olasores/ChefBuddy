create table if not exists saved_recipes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  ingredients text[] default array[]::text[],
  steps text[] default array[]::text[],
  source_ingredients text,
  created_at timestamptz not null default now()
);

alter table saved_recipes enable row level security;

drop policy if exists "Users manage their recipes" on saved_recipes;
create policy "Users manage their recipes"
  on saved_recipes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
