-- Woven cloth dyed with plant colours (ฝาง, ฮ้อม, ขมิ้น) that has no eco-print or elephant dung.
alter table public.products drop constraint if exists products_category_check;
alter table public.products add constraint products_category_check
  check (category in ('ecoprint', 'ayara', 'natural_dye', 'dung_pot', 'dung_sculpture'));
