create table if not exists public.flashcard_folders (
    id uuid primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    type text not null check (type in ('kanji', 'sentence', 'vocabulary')),
    name text not null,
    created_at timestamptz not null default now()
);

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    displayable_name text not null default '',
    updated_at timestamptz not null default now()
);

create table if not exists public.flashcards (
    id uuid primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    folder_id uuid not null references public.flashcard_folders(id) on delete cascade,
    type text not null check (type in ('kanji', 'sentence', 'vocabulary')),
    front text not null,
    pronunciation text not null,
    meaning text not null,
    created_at timestamptz not null default now()
);

alter table public.flashcard_folders enable row level security;
alter table public.flashcards enable row level security;
alter table public.profiles enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (id, displayable_name)
    values (
        new.id,
        coalesce(new.raw_user_meta_data ->> 'displayable_name', split_part(new.email, '@', 1), '')
    )
    on conflict (id) do nothing;

    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create policy "Users can read their profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users can create their profile"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "Users can update their profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can read their folders"
on public.flashcard_folders
for select
using (auth.uid() = user_id);

create policy "Users can create their folders"
on public.flashcard_folders
for insert
with check (auth.uid() = user_id);

create policy "Users can update their folders"
on public.flashcard_folders
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their folders"
on public.flashcard_folders
for delete
using (auth.uid() = user_id);

create policy "Users can read their flashcards"
on public.flashcards
for select
using (auth.uid() = user_id);

create policy "Users can create their flashcards"
on public.flashcards
for insert
with check (
    auth.uid() = user_id
    and exists (
        select 1
        from public.flashcard_folders
        where flashcard_folders.id = folder_id
        and flashcard_folders.user_id = auth.uid()
    )
);

create policy "Users can update their flashcards"
on public.flashcards
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their flashcards"
on public.flashcards
for delete
using (auth.uid() = user_id);

create index if not exists flashcard_folders_user_id_idx
on public.flashcard_folders(user_id);

create index if not exists flashcards_user_id_idx
on public.flashcards(user_id);

create index if not exists flashcards_folder_id_idx
on public.flashcards(folder_id);
