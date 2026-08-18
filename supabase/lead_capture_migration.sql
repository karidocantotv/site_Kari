-- Execute this once in Supabase SQL Editor after the main schema.
-- Adds the course slug captured before the purchase area.
alter table public.leads
add column if not exists course_slug text;

create index if not exists leads_course_slug_idx
on public.leads(course_slug);

-- Lead events are generated server-side by a database trigger.
-- This keeps the public browser from reading or inserting arbitrary event records.
drop policy if exists "Public can create lead events"
on public.lead_events;

create or replace function public.record_lead_capture_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.lead_events (lead_id, event_type, page_url, metadata)
  values (
    new.id,
    case when new.course_slug is null then 'lead_capture' else 'course_interest' end,
    new.source_page,
    jsonb_build_object(
      'source', new.source,
      'course_slug', new.course_slug,
      'utm_source', new.utm_source,
      'utm_medium', new.utm_medium,
      'utm_campaign', new.utm_campaign,
      'utm_term', new.utm_term,
      'utm_content', new.utm_content
    )
  );
  return new;
end;
$$;

drop trigger if exists lead_capture_event on public.leads;

create trigger lead_capture_event
after insert on public.leads
for each row
execute function public.record_lead_capture_event();
