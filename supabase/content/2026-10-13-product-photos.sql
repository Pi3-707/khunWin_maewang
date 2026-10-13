-- Real product photos from the team's Drive folder "แม่วาง/รูปสินค้า", served from public/products.
-- Products without a photo yet (P005, P011, P014–P016) fall back to the site placeholder.
begin;
update products set cover_image_url = null;
update products p set cover_image_url = '/products/' || p.product_code || '-1.jpg'
where p.product_code in ('P001','P002','P003','P004','P006','P007','P008','P009','P010','P012','P013','P017','P018','P019');
delete from product_images;
insert into product_images (product_id, url, display_order)
select p.id, '/products/' || v.code || '-' || v.n || '.jpg', v.n - 1
from (values ('P003',2),('P006',2),('P008',2),('P010',2),('P013',2),
             ('P017',2),('P017',3),('P018',2),('P018',3),
             ('P019',2),('P019',3),('P019',4),('P019',5),('P019',6),('P019',7)) as v(code, n)
join products p on p.product_code = v.code;
commit;

-- Photos for the home page "From Forest to Handcraft" cycle (first three materials and steps).
update materials set image_url = '/products/P019-1.jpg' where id = '00000000-0000-0000-0000-000000000101';
update materials set image_url = '/products/P008-1.jpg' where id = '00000000-0000-0000-0000-000000000102';
update materials set image_url = '/products/P006-1.jpg' where id = '00000000-0000-0000-0000-000000000103';
update processes set image_url = '/photos/dung-pots.jpg' where id = '00000000-0000-0000-0000-000000000201';
update processes set image_url = '/products/P017-1.jpg' where id = '00000000-0000-0000-0000-000000000202';
update processes set image_url = '/products/P012-1.jpg' where id = '00000000-0000-0000-0000-000000000203';
