-- Real community content from the team's interview doc (Khunwin Meawang Google Doc), replacing all mock rows.
-- Sources: interviews with Ketsarin Tunkaew, Mae Lamphun Panya and the mahout; the "ข่วงแม่วิน" story; the price + contact list.
begin;

-- Remove mock data
delete from product_purchase_channels;
delete from product_elephants;
delete from product_artisans;
delete from product_processes;
delete from product_materials;
delete from product_images;
update stories set product_id = null;
delete from products;
delete from stories;
delete from processes;
delete from materials;
delete from artisans;
delete from elephants;
delete from purchase_channels;
delete from visit_info;

-- Stories: one per product family
insert into stories (id, category, title, title_en, introduction, introduction_en, origin_story, origin_story_en, value_story, value_story_en) values
('00000000-0000-0000-0000-000000000011', 'ayara',
 'สีของช้างแต่ละเชือก', 'The Colour of Each Elephant',
 'มูลช้างที่ไหลลงลำน้ำเคยเป็นปัญหาของทุกคนในแม่วิน จนธนาคารออมสินเข้ามาเป็นพี่เลี้ยงในช่วงโควิด ควาญช้างช่วยกันเก็บมูลไว้เป็นที่เป็นทาง แล้วชาวบ้านก็นำมาต้มเป็นสีย้อมฝ้ายและผืนผ้า',
 'Elephant dung washing into the streams was once everyone''s problem in Mae Win. During COVID, the Government Savings Bank stepped in as a mentor. The mahouts began collecting the dung properly, and villagers boiled it into dye for cotton and cloth.',
 'สีที่ได้ไม่เหมือนกันสักผืน เพราะช้างแต่ละเชือกให้สีต่างกันตามวัย แม่มะลิผู้อาวุโสให้สีนุ่มจาง แม่นุ้ยวัยกลางคนให้สีละมุน ส่วนน้องฟ้าใสช้างสาวให้สีเข้มลึก',
 'No two cloths share a colour, because each elephant gives a different shade with age. Elder Mae Mali gives a soft, pale tone; middle-aged Mae Nui a gentle one; and young Fah Sai a deep, rich colour.',
 '"ใส่แล้วรู้สึกสดชื่น มั่นใจ เหมือนมีส่วนหนึ่งของช้างอยู่ในตัวเรา" ผ้าย้อมสีมูลช้างที่ตัดเย็บร่วมกับผ้า eco-print มีที่บ้านแม่มูตเพียงแห่งเดียว',
 '"Wearing it feels fresh and confident, as if a part of the elephant is with you." Dung-dyed cloth stitched together with eco-print is made only here in Ban Mae Mut.'),
('00000000-0000-0000-0000-000000000012', 'ecoprint',
 'ลายใบไม้จากป่าชุมชน', 'Leaf Prints from the Community Forest',
 'ใบสัก ใบเพกา และใบกระเจี๊ยบ มาจากป่าชุมชนเกือบ 5,000 ไร่ที่บรรพบุรุษฝากไว้ให้ลูกหลาน พ่อบ้านในชุมชนเป็นคนเก็บใบไม้ แม่บ้านจัดวางลงบนผืนผ้าทีละใบ',
 'Teak, pheka and roselle leaves come from the nearly 5,000-rai community forest our ancestors left to us. Village men gather the leaves, and village women lay them on the cloth one by one.',
 'ผ้าแช่น้ำเบกกิ้งโซดาและสารส้มหนึ่งคืน วางใบไม้แล้วทับด้วยผ้าอีกผืน ม้วน มัด และนึ่งด้วยไฟฟืนหนึ่งชั่วโมง ใบสักให้สีม่วงแดง ใบสักทองให้สีเหลือง สีของใบไม้เปลี่ยนไปตามฤดูกาล',
 'The cloth soaks overnight in baking soda and alum. Leaves are laid on it, covered with a second cloth, rolled, tied and steamed over a wood fire for an hour. Teak gives purple-red, golden teak gives yellow, and the colours shift with the seasons.',
 'ไม่มีผืนไหนลายซ้ำกัน ตั้งแต่คนเก็บใบไม้ คนทำผ้า ไปจนถึงช่างเย็บ ทุกคนในหมู่บ้านมีรายได้จากงานที่ตนเองมีส่วนร่วม',
 'No two pieces share a pattern. From the leaf gatherers to the printers and the tailors, everyone in the village earns from the part they play.'),
('00000000-0000-0000-0000-000000000013', 'natural_dye',
 'ผืนผ้าที่เชื่อมหลายหมู่บ้าน', 'Cloth That Links Many Villages',
 'กลุ่มแม่บ้านวิสาหกิจชุมชนบ้านแม่มูตย้อมฝ้ายด้วยสีจากธรรมชาติ ทั้งฝาง ฮ้อม ขมิ้น ไม้ดู่ และเปลือกเพกา',
 'The women''s group of the Ban Mae Mut community enterprise dyes cotton with natural colours: sappanwood, indigo (hom), turmeric, padauk and pheka bark.',
 'เส้นฝ้ายที่ย้อมแล้วเดินทางต่อไปยังบ้านขุนป๋วย บ้านห้วยข้าวลีบ และบ้านแม่สะป๊อก กลุ่มสตรีและผู้สูงอายุรับไปทอเป็นผืน บางส่วนเป็นฝีมือนักเรียนโรงเรียนแม่วินสามัคคีที่ทอผ้าเพื่อเก็บเป็นค่าเทอมของตนเอง',
 'The dyed yarn travels on to Ban Khun Puai, Ban Huai Khao Lip and Ban Mae Sapok, where women''s and elders'' groups weave it into cloth. Some is woven by students of Mae Win Samakkhi School to pay their own school fees.',
 'บ้านแม่มูตจึงเป็นเหมือนศูนย์กลางที่ร้อยใจคนหลายหมู่บ้านให้มีรายได้ไปด้วยกัน',
 'Ban Mae Mut has become the hub that ties many villages together, so they earn a living side by side.');

-- Materials
insert into materials (id, name, name_en, type, origin, origin_en, description, description_en) values
('00000000-0000-0000-0000-000000000101', 'มูลช้าง', 'Elephant dung', 'natural_material', 'ปางช้างแม่วิน ต.แม่วิน', 'Elephant camp, Mae Win',
 'ควาญช้างเก็บมูลของแม่มะลิ แม่นุ้ย และฟ้าใสไว้ที่โรงเก็บมูลช้าง นำมาล้าง ต้มเป็นสีย้อม และขึ้นรูปเป็นกระถางกับรูปปั้น ไม่ปล่อยให้ไหลลงลำน้ำ',
 'The mahouts collect dung from Mae Mali, Mae Nui and Fah Sai in the dung shed. It is washed, boiled into dye, and shaped into pots and figures instead of washing into the streams.'),
('00000000-0000-0000-0000-000000000102', 'ใบสัก', 'Teak leaf', 'natural_material', 'ป่าชุมชนบ้านแม่มูต', 'Ban Mae Mut community forest',
 'ให้สีม่วงแดง ส่วนใบสักทองจากต้นที่กรมป่าไม้ปลูกไว้ให้สีเหลือง', 'Gives a purple-red print; golden teak planted by the forestry department gives yellow.'),
('00000000-0000-0000-0000-000000000103', 'ใบเพกา', 'Pheka leaf', 'natural_material', 'ป่าชุมชนบ้านแม่มูต', 'Ban Mae Mut community forest',
 'หนึ่งในใบไม้ที่ให้สีชัดที่สุดสำหรับผ้า eco-print', 'One of the leaves that prints most clearly on eco-print cloth.'),
('00000000-0000-0000-0000-000000000104', 'ใบกระเจี๊ยบ', 'Roselle leaf', 'natural_material', 'สวนในหมู่บ้าน', 'Village gardens',
 'ใบไม้จากสวนในหมู่บ้านที่ใช้พิมพ์ลาย eco-print', 'A garden leaf used for eco-print patterns.'),
('00000000-0000-0000-0000-000000000105', 'ผ้าฝ้าย', 'Cotton', 'textile', 'ทอโดยกลุ่มสตรีในตำบลแม่วิน', 'Woven by women''s groups in Mae Win',
 'ย้อมที่บ้านแม่มูต แล้วส่งไปทอที่บ้านขุนป๋วย บ้านห้วยข้าวลีบ บ้านแม่สะป๊อก และโรงเรียนแม่วินสามัคคี', 'Dyed in Ban Mae Mut, then woven in Ban Khun Puai, Ban Huai Khao Lip, Ban Mae Sapok and at Mae Win Samakkhi School.'),
('00000000-0000-0000-0000-000000000106', 'ฝาง', 'Sappanwood', 'natural_material', null, null, 'ไม้ให้สีย้อมธรรมชาติ', 'A wood that gives natural dye.'),
('00000000-0000-0000-0000-000000000107', 'ฮ้อม', 'Indigo (hom)', 'natural_material', null, null, 'พืชให้สีคราม', 'A plant that gives indigo blue.'),
('00000000-0000-0000-0000-000000000108', 'ขมิ้น', 'Turmeric', 'natural_material', null, null, 'ให้สีเหลือง', 'Gives yellow.'),
('00000000-0000-0000-0000-000000000109', 'ไม้ดู่', 'Padauk wood', 'natural_material', null, null, 'ไม้ให้สีย้อมธรรมชาติ', 'A wood that gives natural dye.'),
('00000000-0000-0000-0000-000000000110', 'เปลือกเพกา', 'Pheka bark', 'natural_material', null, null, 'เปลือกไม้ให้สีย้อมธรรมชาติ', 'Bark that gives natural dye.'),
('00000000-0000-0000-0000-000000000111', 'แป้งมัน', 'Tapioca starch', 'natural_material', null, null, 'ต้มผสมกับใยมูลช้างให้เหนียวก่อนขึ้นรูป', 'Boiled and mixed with dung fibre so it holds its shape.');

-- Processes
insert into processes (id, name, name_en, description, description_en) values
('00000000-0000-0000-0000-000000000201', 'เก็บมูลช้าง', 'Collecting the dung', 'ควาญช้างเก็บมูลไว้ที่โรงเก็บมูลช้างทุกวัน ไม่ให้ไหลลงลำน้ำ', 'The mahouts gather the dung in the dung shed every day so it never reaches the streams.'),
('00000000-0000-0000-0000-000000000202', 'ล้างและต้มมูลช้าง', 'Washing and boiling', 'ล้างมูลช้างให้สะอาดแล้วต้ม น้ำที่ได้คือสีย้อม', 'The dung is washed clean and boiled; the water becomes the dye.'),
('00000000-0000-0000-0000-000000000203', 'ย้อมด้วยสีมูลช้าง', 'Dyeing with dung colour', 'ชุบฝ้ายหรือผ้าในน้ำต้มมูลช้าง สีอ่อนเข้มต่างกันตามวัยของช้าง', 'Cotton or cloth is dipped in the boiled dung water; the shade depends on the elephant''s age.'),
('00000000-0000-0000-0000-000000000204', 'ทอผ้า', 'Weaving', 'กลุ่มสตรี ผู้สูงอายุ และนักเรียนในหมู่บ้านใกล้เคียงรับฝ้ายไปทอเป็นผืน', 'Women''s groups, elders and students in neighbouring villages weave the yarn into cloth.'),
('00000000-0000-0000-0000-000000000205', 'แช่ผ้า', 'Soaking the cloth', 'แช่ผ้าในน้ำเบกกิ้งโซดาและสารส้ม 1 คืน เพื่อให้สีจากใบไม้ติดเนื้อผ้า', 'The cloth soaks overnight in baking soda and alum so the leaf colour will hold.'),
('00000000-0000-0000-0000-000000000206', 'จัดวางใบไม้', 'Laying the leaves', 'ปูพลาสติก วางผ้า แล้ววางใบสัก ใบเพกา ใบกระเจี๊ยบตามใจ ก่อนทับด้วยผ้าอีกผืน', 'On a plastic sheet, teak, pheka and roselle leaves are arranged on the cloth by hand, then covered with a second cloth.'),
('00000000-0000-0000-0000-000000000207', 'ม้วน มัด และนึ่ง', 'Rolling, tying and steaming', 'ม้วนผ้าให้แน่น มัด แล้วนึ่งในหม้อไฟฟืน 1 ชั่วโมง แกะออกมาจะเห็นลายใบไม้', 'The cloth is rolled tight, tied and steamed over a wood fire for an hour. Unrolled, it shows the leaf print.'),
('00000000-0000-0000-0000-000000000208', 'ตัดเย็บ', 'Cutting and sewing', 'ช่างเย็บในชุมชนตัดเย็บผ้าเป็นชิ้นงาน บางชิ้นผสมผ้า eco-print กับผ้าทอสีธรรมชาติหรือสีมูลช้าง', 'Village tailors sew the cloth into finished pieces, some combining eco-print with natural-dye or dung-dyed weave.'),
('00000000-0000-0000-0000-000000000209', 'ล้างและตากแห้ง', 'Rinsing and drying', 'หลังต้ม นำมูลช้างมาล้างน้ำอีกครั้งแล้วตากแดดให้แห้ง', 'After boiling, the dung is rinsed again and sun-dried.'),
('00000000-0000-0000-0000-000000000210', 'ผสมแป้งมันและขึ้นรูป', 'Mixing and shaping', 'ต้มแป้งมันผสมกับใยมูลช้างให้เหนียว แล้วปั้นเป็นกระถางหรือรูปช้างด้วยมือ', 'Boiled tapioca starch is mixed into the dung fibre until sticky, then shaped by hand into pots or elephants.'),
('00000000-0000-0000-0000-000000000211', 'ย้อมสีธรรมชาติ', 'Natural dyeing', 'ย้อมฝ้ายด้วยสีจากฝาง ฮ้อม ขมิ้น ไม้ดู่ และเปลือกเพกา', 'Cotton is dyed with sappanwood, indigo, turmeric, padauk and pheka bark.');

-- People
insert into artisans (id, name, name_en, role, role_en, bio, bio_en) values
('00000000-0000-0000-0000-000000000301', 'แม่ลำพูน ปัญญา', 'Mae Lamphun Panya', 'ช่างงานมูลช้างและผ้า eco-print', 'Dung craft and eco-print maker',
 'อายุ 64 ปี ทำงานจากมูลช้างมา 10 ปี ทั้งกระถาง กระดาษสา ผ้าย้อมสีมูลช้าง และผ้า eco-print ถ้าออเดอร์เยอะชาวบ้านจะมาช่วยกัน "มูลช้างไม่น่ารังเกียจเลย ทำสะอาด ไม่มีสารพิษ ใส่สบาย ไม่คันเนื้อคันตัว"',
 'Aged 64, she has worked with elephant dung for 10 years: pots, mulberry-style paper, dung-dyed cloth and eco-print. When orders are big, neighbours join in. "Elephant dung isn''t dirty at all. It''s cleaned, it''s chemical-free, and it''s comfortable to wear."'),
('00000000-0000-0000-0000-000000000302', 'เกศริน ตุ่นแก้ว', 'Ketsarin Tunkaew', 'ประธานวิสาหกิจชุมชนบ้านแม่มูต', 'Chair, Ban Mae Mut Community Enterprise',
 'ผู้นำกลุ่มที่ร่วมกับธนาคารออมสินพัฒนาผลิตภัณฑ์จากมูลช้างและผ้า eco-print และเปิดศูนย์เรียนรู้ให้นักท่องเที่ยวมาทำ workshop "ใส่แล้วรู้สึกสดชื่น มั่นใจ เหมือนมีส่วนหนึ่งของช้างอยู่ในตัวเรา"',
 'She leads the group that developed dung and eco-print products with the Government Savings Bank, and opened the learning centre where visitors join workshops. "Wearing it feels fresh and confident, as if a part of the elephant is with you."'),
('00000000-0000-0000-0000-000000000303', 'ทีมควาญช้าง', 'The Mahouts', 'ผู้ดูแลช้างและเก็บมูลช้าง', 'Elephant keepers and dung collectors',
 'ควาญช้าง 3 คน ดูแลช้างประจำตัวทุกวันมากว่า 6 ปี ให้หญ้า อ้อย และกล้วยทีละน้อย ให้น้ำวันละ 3–4 ครั้ง รวมกว่า 200 ลิตร พาอาบน้ำวันละ 2–3 ครั้ง และเก็บมูลไว้ที่โรงเก็บมูลช้าง',
 'Three mahouts, each with their own elephant, have cared for them daily for over 6 years: grass, sugar cane and bananas in small portions, water 3–4 times a day (over 200 litres), baths 2–3 times a day, and every bit of dung gathered in the dung shed.');

insert into elephants (id, name, name_en, age_years, description, description_en) values
('00000000-0000-0000-0000-000000000401', 'แม่มะลิ', 'Mae Mali', 60,
 'ช้างอาวุโสที่อยู่กับปางมานานที่สุด นิสัยอบอุ่น ใจดี ชอบกินกล้วย ยังไม่เคยมีลูก กระเพาะย่อยได้น้อยลงตามวัย มูลจึงให้สีนุ่มจาง โทนเบจอ่อนแกมเหลือง',
 'The eldest, and the longest at the camp. Warm and kind, she loves bananas and has never had a calf. Her digestion has slowed with age, so her dung gives a soft, pale beige-yellow.'),
('00000000-0000-0000-0000-000000000402', 'แม่นุ้ย', 'Mae Nui', null,
 'ช้างวัยกลางคน มูลให้สีละมุน อยู่ระหว่างสีจางของแม่มะลิกับสีเข้มของฟ้าใส',
 'Middle-aged. Her dung gives a gentle shade between Mae Mali''s pale tone and Fah Sai''s deep one.'),
('00000000-0000-0000-0000-000000000403', 'ฟ้าใส', 'Fah Sai', null,
 'ช้างสาวที่ปางซื้อมาเลี้ยงตั้งแต่เด็ก ขี้เล่น ชอบเล่นไปเรื่อย ๆ มูลเข้มข้นจึงให้สีเข้มลึกที่สุด',
 'A young female raised at the camp since she was little. Playful and easy-going, her rich dung gives the deepest colour.');

insert into purchase_channels (id, name, name_en, type, url, description, description_en) values
('00000000-0000-0000-0000-000000000501', 'ร้านค้าชุมชนข่วงแม่วิน', 'Khuang Mae Win Community Shop', 'community_store',
 'https://maps.app.goo.gl/WQYYQamNYkFEseiCA',
 'ศูนย์วิสาหกิจชุมชนบ้านแม่มูต หมู่ที่ 6 ต.แม่วิน อ.แม่วาง จ.เชียงใหม่ (สนับสนุนพื้นที่โดย อบต.แม่วิน)',
 'Ban Mae Mut Community Enterprise Centre, Moo 6, Mae Win, Mae Wang, Chiang Mai (space supported by Mae Win SAO)');

-- Products (created_at offsets keep the list in this order)
insert into products (id, product_code, qr_code, name, name_en, category, reference_price, availability, cover_image_url, story_id, description, description_en, story_summary, story_summary_en, created_at) values
('00000000-0000-0000-0000-000000001001','P001','KHUNWIN-P001','เสื้อ Eco-print ผสมผ้าทอสีธรรมชาติ แบบที่ 1','Eco-print Shirt with Natural-Dye Weave, Style 1','ecoprint',1200,'ready','/stitch/fabric.jpg','00000000-0000-0000-0000-000000000012',
 'เสื้อตัดเย็บจากผ้าพิมพ์ลายใบไม้ eco-print ผสมกับผ้าทอย้อมสีธรรมชาติจากฝางและฮ้อม ฝีมือกลุ่มแม่บ้านวิสาหกิจชุมชนบ้านแม่มูต','A shirt combining leaf-printed eco-print cloth with woven fabric dyed with sappanwood and indigo, by the women of the Ban Mae Mut community enterprise.',
 'ฝาง + ฮ้อม → ย้อมฝ้าย → ทอ → พิมพ์ลายใบไม้ → ตัดเย็บรวมกัน','Sappanwood + indigo → dyed cotton → woven → leaf print → sewn together', now()),
('00000000-0000-0000-0000-000000001002','P002','KHUNWIN-P002','เสื้อ Eco-print ผสมผ้าทอสีธรรมชาติ แบบที่ 2','Eco-print Shirt with Natural-Dye Weave, Style 2','ecoprint',700,'ready','/stitch/shawl.jpg','00000000-0000-0000-0000-000000000012',
 'เสื้อตัดเย็บจากผ้าพิมพ์ลายใบไม้ eco-print ผสมกับผ้าทอย้อมสีธรรมชาติ ฝีมือกลุ่มแม่บ้านวิสาหกิจชุมชนบ้านแม่มูต','A shirt combining eco-print cloth with naturally dyed woven fabric, by the women of the Ban Mae Mut community enterprise.',
 'ย้อมฝ้าย → ทอ → พิมพ์ลายใบไม้ → ตัดเย็บรวมกัน','Dyed cotton → woven → leaf print → sewn together', now() + interval '1 second'),
('00000000-0000-0000-0000-000000001003','P003','KHUNWIN-P003','เสื้อ Eco-print ผสมผ้าทอสีธรรมชาติ แบบที่ 3','Eco-print Shirt with Natural-Dye Weave, Style 3','ecoprint',1200,'ready','/stitch/fabric.jpg','00000000-0000-0000-0000-000000000012',
 'เสื้อตัดเย็บจากผ้าพิมพ์ลายใบไม้ eco-print ผสมกับผ้าทอย้อมสีธรรมชาติจากขมิ้น ฝาง และฮ้อม ฝีมือกลุ่มแม่บ้านวิสาหกิจชุมชนบ้านแม่มูต','A shirt combining eco-print cloth with woven fabric dyed with turmeric, sappanwood and indigo, by the women of the Ban Mae Mut community enterprise.',
 'ขมิ้น + ฝาง + ฮ้อม → ย้อมฝ้าย → ทอ → พิมพ์ลายใบไม้ → ตัดเย็บรวมกัน','Turmeric + sappanwood + indigo → dyed cotton → woven → leaf print → sewn together', now() + interval '2 seconds'),
('00000000-0000-0000-0000-000000001004','P004','KHUNWIN-P004','เสื้อ Eco-print ผสมผ้าทอสีมูลช้าง','Eco-print Shirt with Elephant-Dung-Dyed Weave','ayara',1200,'ready','/stitch/fabric.jpg','00000000-0000-0000-0000-000000000011',
 'เสื้อตัดเย็บจากผ้าพิมพ์ลายใบไม้ eco-print ผสมกับผ้าทอย้อมสีมูลช้าง ฮ้อม และไม้ดู่ งานที่มีที่บ้านแม่มูตเพียงแห่งเดียว','A shirt combining eco-print cloth with woven fabric dyed with elephant dung, indigo and padauk. Made only in Ban Mae Mut.',
 'มูลช้าง + ฮ้อม + ไม้ดู่ → ย้อมฝ้าย → ทอ → ตัดเย็บร่วมกับผ้า eco-print','Elephant dung + indigo + padauk → dyed cotton → woven → sewn with eco-print', now() + interval '3 seconds'),
('00000000-0000-0000-0000-000000001005','P005','KHUNWIN-P005','เสื้อลายตัดเย็บผสมผ้าทอสีธรรมชาติ','Patterned Shirt with Natural-Dye Weave','natural_dye',null,'ready','/stitch/shawl.jpg','00000000-0000-0000-0000-000000000013',
 'เสื้อตัดเย็บลวดลายพร้อมกับผ้าทอจากสีธรรมชาติ ของกลุ่มแม่บ้านวิสาหกิจชุมชนบ้านแม่มูต','A patterned shirt sewn with naturally dyed woven fabric, by the women of the Ban Mae Mut community enterprise.',
 'ย้อมสีธรรมชาติ → ทอ → ตัดเย็บลวดลาย','Natural dye → woven → patterned and sewn', now() + interval '4 seconds'),
('00000000-0000-0000-0000-000000001006','P006','KHUNWIN-P006','กางเกงผ้าพิมพ์ลายใบไม้ Eco-print','Eco-print Trousers','ecoprint',600,'ready','/stitch/fabric.jpg','00000000-0000-0000-0000-000000000012',
 'กางเกงจากผ้าพิมพ์ลายใบไม้ eco-print ลายไม่ซ้ำกันสักตัว','Trousers in leaf-printed eco-print cloth. No two pairs share a pattern.',
 'ใบไม้จากป่าชุมชน → พิมพ์ลาย → นึ่ง → ตัดเย็บ','Community-forest leaves → printed → steamed → sewn', now() + interval '5 seconds'),
('00000000-0000-0000-0000-000000001007','P007','KHUNWIN-P007','สมุดปกผ้า Eco-print','Eco-print Fabric-Covered Notebook','ecoprint',120,'ready','/stitch/shawl.jpg','00000000-0000-0000-0000-000000000012',
 'สมุดที่หุ้มปกด้วยผ้าพิมพ์ลายใบไม้ eco-print','A notebook covered in leaf-printed eco-print cloth.',
 'ใบไม้จากป่าชุมชน → พิมพ์ลาย → หุ้มปกสมุด','Community-forest leaves → printed → bound as a cover', now() + interval '6 seconds'),
('00000000-0000-0000-0000-000000001008','P008','KHUNWIN-P008','ปลอกหมอนผ้า Eco-print ใบใหญ่','Eco-print Pillowcase, Large','ecoprint',150,'ready','/stitch/fabric.jpg','00000000-0000-0000-0000-000000000012',
 'ปลอกหมอนใบใหญ่จากผ้าพิมพ์ลายใบไม้ eco-print','A large pillowcase in leaf-printed eco-print cloth.',
 'ใบไม้จากป่าชุมชน → พิมพ์ลาย → นึ่ง → ตัดเย็บ','Community-forest leaves → printed → steamed → sewn', now() + interval '7 seconds'),
('00000000-0000-0000-0000-000000001009','P009','KHUNWIN-P009','ปลอกหมอนผ้า Eco-print ใบเล็ก','Eco-print Pillowcase, Small','ecoprint',60,'ready','/stitch/fabric.jpg','00000000-0000-0000-0000-000000000012',
 'ปลอกหมอนใบเล็กจากผ้าพิมพ์ลายใบไม้ eco-print','A small pillowcase in leaf-printed eco-print cloth.',
 'ใบไม้จากป่าชุมชน → พิมพ์ลาย → นึ่ง → ตัดเย็บ','Community-forest leaves → printed → steamed → sewn', now() + interval '8 seconds'),
('00000000-0000-0000-0000-000000001010','P010','KHUNWIN-P010','หมวกผ้า Eco-print','Eco-print Hat','ecoprint',199,'ready','/stitch/shawl.jpg','00000000-0000-0000-0000-000000000012',
 'หมวกจากผ้าพิมพ์ลายใบไม้ eco-print','A hat in leaf-printed eco-print cloth.',
 'ใบไม้จากป่าชุมชน → พิมพ์ลาย → นึ่ง → ตัดเย็บ','Community-forest leaves → printed → steamed → sewn', now() + interval '9 seconds'),
('00000000-0000-0000-0000-000000001011','P011','KHUNWIN-P011','ผ้าปูโต๊ะ Eco-print','Eco-print Tablecloth','ecoprint',null,'ready','/stitch/fabric.jpg','00000000-0000-0000-0000-000000000012',
 'ผ้าปูโต๊ะพิมพ์ลายใบไม้ eco-print','A leaf-printed eco-print tablecloth.',
 'ใบไม้จากป่าชุมชน → พิมพ์ลาย → นึ่ง','Community-forest leaves → printed → steamed', now() + interval '10 seconds'),
('00000000-0000-0000-0000-000000001012','P012','KHUNWIN-P012','กระเป๋าผ้าทอสีมูลช้าง','Elephant-Dung-Dyed Woven Bag','ayara',300,'ready','/stitch/shawl.jpg','00000000-0000-0000-0000-000000000011',
 'กระเป๋าจากผ้าทอที่ย้อมด้วยสีจากมูลช้าง','A bag made from woven cloth dyed with elephant dung.',
 'มูลช้าง → ต้มเป็นสี → ย้อมฝ้าย → ทอ → ตัดเย็บ','Elephant dung → boiled into dye → dyed cotton → woven → sewn', now() + interval '11 seconds'),
('00000000-0000-0000-0000-000000001013','P013','KHUNWIN-P013','กระเป๋าผ้าทอสีธรรมชาติ','Natural-Dye Woven Bag','natural_dye',300,'ready','/stitch/shawl.jpg','00000000-0000-0000-0000-000000000013',
 'กระเป๋าจากผ้าทอย้อมสีธรรมชาติ','A bag made from naturally dyed woven cloth.',
 'ย้อมสีธรรมชาติ → ทอ → ตัดเย็บ','Natural dye → woven → sewn', now() + interval '12 seconds'),
('00000000-0000-0000-0000-000000001014','P014','KHUNWIN-P014','ตุ๊กตาช้างสีมูลช้าง ตัวใหญ่','Elephant Doll, Dung-Dyed, Large','ayara',299,'ready','/stitch/plushie.jpg','00000000-0000-0000-0000-000000000011',
 'ตุ๊กตาช้างตัวใหญ่ ทำจากผ้าย้อมสีมูลช้าง สินค้าหลักของกลุ่ม','A large elephant doll made from dung-dyed cloth, the group''s signature piece.',
 'มูลช้าง → ต้มเป็นสี → ย้อมผ้า → เย็บเป็นตุ๊กตา','Elephant dung → boiled into dye → dyed cloth → sewn into a doll', now() + interval '13 seconds'),
('00000000-0000-0000-0000-000000001015','P015','KHUNWIN-P015','ตุ๊กตาช้างสีมูลช้าง ตัวเล็ก','Elephant Doll, Dung-Dyed, Small','ayara',80,'ready','/stitch/plushie.jpg','00000000-0000-0000-0000-000000000011',
 'ตุ๊กตาช้างตัวเล็ก ทำจากผ้าย้อมสีมูลช้าง','A small elephant doll made from dung-dyed cloth.',
 'มูลช้าง → ต้มเป็นสี → ย้อมผ้า → เย็บเป็นตุ๊กตา','Elephant dung → boiled into dye → dyed cloth → sewn into a doll', now() + interval '14 seconds'),
('00000000-0000-0000-0000-000000001016','P016','KHUNWIN-P016','พวงกุญแจช้าง','Elephant Keychain','ayara',50,'ready','/stitch/plushie.jpg','00000000-0000-0000-0000-000000000011',
 'พวงกุญแจรูปช้างจากผ้าย้อมสีมูลช้าง','An elephant keychain made from dung-dyed cloth.',
 'มูลช้าง → ต้มเป็นสี → ย้อมผ้า → เย็บ','Elephant dung → boiled into dye → dyed cloth → sewn', now() + interval '15 seconds'),
('00000000-0000-0000-0000-000000001017','P017','KHUNWIN-P017','กระถางต้นไม้มูลช้าง ใบเล็ก','Elephant-Dung Plant Pot, Small','dung_pot',50,'ready','/stitch/pots.jpg','00000000-0000-0000-0000-000000000011',
 'กระถางต้นไม้ขนาดเล็ก ปั้นจากใยมูลช้างผสมแป้งมัน','A small plant pot hand-shaped from elephant-dung fibre and tapioca starch.',
 'มูลช้าง → ล้าง ต้ม ตากแห้ง → ผสมแป้งมัน → ปั้นกระถาง','Elephant dung → washed, boiled, dried → mixed with starch → shaped', now() + interval '16 seconds'),
('00000000-0000-0000-0000-000000001018','P018','KHUNWIN-P018','กระถางต้นไม้มูลช้าง ใบใหญ่','Elephant-Dung Plant Pot, Large','dung_pot',100,'ready','/stitch/pots.jpg','00000000-0000-0000-0000-000000000011',
 'กระถางต้นไม้ขนาดใหญ่ ปั้นจากใยมูลช้างผสมแป้งมัน','A large plant pot hand-shaped from elephant-dung fibre and tapioca starch.',
 'มูลช้าง → ล้าง ต้ม ตากแห้ง → ผสมแป้งมัน → ปั้นกระถาง','Elephant dung → washed, boiled, dried → mixed with starch → shaped', now() + interval '17 seconds'),
('00000000-0000-0000-0000-000000001019','P019','KHUNWIN-P019','รูปปั้นช้างจากมูลช้าง','Elephant-Dung Sculpture','dung_sculpture',null,'ready','/stitch/plushie.jpg','00000000-0000-0000-0000-000000000011',
 'รูปปั้นช้างที่ขึ้นรูปด้วยมือจากใยมูลช้าง ตามที่ธนาคารออมสินมาฝึกอบรมให้ชาวบ้าน','An elephant figure hand-shaped from dung fibre, a craft villagers learned in Government Savings Bank training.',
 'มูลช้าง → ล้าง ต้ม ตากแห้ง → ผสมแป้งมัน → ปั้นเป็นรูปช้าง','Elephant dung → washed, boiled, dried → mixed with starch → sculpted', now() + interval '18 seconds');

-- Product ↔ material
insert into product_materials (product_id, material_id)
select p.id, ('00000000-0000-0000-0000-000000000' || m)::uuid
from (values
  ('P001', '102,103,104,105,106,107'),
  ('P002', '102,103,104,105'),
  ('P003', '102,103,104,105,106,107,108'),
  ('P004', '101,102,103,104,105,107,109'),
  ('P005', '105,106,107,108,109,110'), ('P013', '105,106,107,108,109,110'),
  ('P006', '102,103,104,105'), ('P007', '102,103,104,105'), ('P008', '102,103,104,105'),
  ('P009', '102,103,104,105'), ('P010', '102,103,104,105'), ('P011', '102,103,104,105'),
  ('P012', '101,105'), ('P014', '101,105'), ('P015', '101,105'), ('P016', '101,105'),
  ('P017', '101,111'), ('P018', '101,111'), ('P019', '101,111')
) as v(code, ids)
join products p on p.product_code = v.code
cross join unnest(string_to_array(v.ids, ',')) as m;

-- Product ↔ process, in order
insert into product_processes (product_id, process_id, step_order)
select p.id, ('00000000-0000-0000-0000-000000000' || s.id)::uuid, s.n
from (values
  ('P001', '211,204,205,206,207,208'), ('P002', '211,204,205,206,207,208'), ('P003', '211,204,205,206,207,208'),
  ('P004', '201,202,203,204,205,206,207,208'),
  ('P005', '211,204,208'), ('P013', '211,204,208'),
  ('P006', '205,206,207,208'), ('P007', '205,206,207,208'), ('P008', '205,206,207,208'),
  ('P009', '205,206,207,208'), ('P010', '205,206,207,208'), ('P011', '205,206,207'),
  ('P012', '201,202,203,204,208'), ('P014', '201,202,203,208'), ('P015', '201,202,203,208'), ('P016', '201,202,203,208'),
  ('P017', '201,202,209,210'), ('P018', '201,202,209,210'), ('P019', '201,202,209,210')
) as v(code, ids)
join products p on p.product_code = v.code
cross join unnest(string_to_array(v.ids, ',')) with ordinality as s(id, n);

-- Who made what
insert into product_artisans (product_id, artisan_id, role)
select id, '00000000-0000-0000-0000-000000000301',
  case category when 'natural_dye' then 'ย้อมสีธรรมชาติ' when 'ecoprint' then 'ทำผ้า eco-print' else 'แปรรูปมูลช้าง' end
from products;
insert into product_artisans (product_id, artisan_id, role)
select id, '00000000-0000-0000-0000-000000000303', 'เก็บมูลช้าง'
from products where category in ('ayara', 'dung_pot', 'dung_sculpture');

-- Every dung product comes from the camp's three elephants
insert into product_elephants (product_id, elephant_id)
select p.id, e.id from products p cross join elephants e
where p.category in ('ayara', 'dung_pot', 'dung_sculpture');

insert into product_purchase_channels (product_id, channel_id)
select id, '00000000-0000-0000-0000-000000000501' from products;

-- Visit page
insert into visit_info (kind, title, title_en, body, body_en, display_order) values
('map', 'แผนที่', 'Map', '18.6695392,98.6539549', '18.6695392,98.6539549', 1),
('direction', 'ที่อยู่', 'Address', 'วิสาหกิจชุมชนสตรีบ้านแม่มูต หมู่ที่ 6 ต.แม่วิน อ.แม่วาง จ.เชียงใหม่', 'Ban Mae Mut Women''s Community Enterprise, Moo 6, Mae Win, Mae Wang, Chiang Mai', 1),
('direction', 'ร้านค้าชุมชน', 'Community shop', 'ร้านค้าชุมชนข่วงแม่วิน ศูนย์เรียนรู้และร้านผลิตภัณฑ์ OTOP (สนับสนุนพื้นที่โดย อบต.แม่วิน)', 'Khuang Mae Win Community Shop, our learning centre and OTOP store (space supported by Mae Win SAO)', 2),
('activity', 'Workshop ผ้า eco-print', 'Eco-print workshop', 'จัดวางใบไม้และพิมพ์ลายผ้าด้วยมือตัวเอง', 'Arrange the leaves and print your own cloth by hand.', 1),
('activity', 'ย้อมผ้าสีมูลช้าง', 'Elephant-dung dyeing', 'ลองย้อมผ้าด้วยสีที่ต้มจากมูลช้าง', 'Try dyeing cloth with colour boiled from elephant dung.', 2),
('activity', 'แช่เท้าสมุนไพร', 'Herbal foot soak', 'สมุนไพรจากป่าชุมชน ดูแลโดยกลุ่มผู้สูงอายุ ช่วยผ่อนคลายหลังเที่ยว', 'Herbs from the community forest, prepared by our elders, to rest your feet after the day.', 3),
('activity', 'จองคิว Workshop', 'Book a workshop', 'โทร 093-302-9448 หรือทัก LINE: dear_nrt2545', 'Call 093-302-9448 or message LINE: dear_nrt2545', 4);

commit;
