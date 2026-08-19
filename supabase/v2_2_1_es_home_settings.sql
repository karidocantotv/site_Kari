-- Optional: Spanish Home section labels. Safe to run once.
insert into public.site_settings (key, value) values
  ('cursos_title_es', 'Cursos de artesanía'),
  ('cursos_description_es', 'Elige una técnica, aprende el proceso y descubre nuevas posibilidades para crear con tus propias manos.'),
  ('blog_title_es', 'Consejos y paso a paso para el hogar'),
  ('blog_description_es', 'Aprende una técnica, elige tus materiales y encuentra inspiración para tu próximo proyecto.')
on conflict (key) do nothing;
