-- Locono Seed Data (Products with images)
-- Prerequisites: Run schema.sql first. Ensure you are logged in and have an auth user.

-- Create or reuse a vendor for seeding
-- Replace PROFILE_ID with an existing profiles.id (auth.users id). If unsure, run in SQL editor after logging in via Auth UI and copy your user id.
-- Example: select * from profiles limit 1;

-- BEGIN: set your profile id here
-- DO THIS FIRST: replace the UUID below with your own profile id
-- select id from profiles where email = 'you@example.com';
-- then paste into the value below before running this file
--
-- UPDATE THIS LINE ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
\set PROFILE_ID '00000000-0000-0000-0000-000000000000'
-- UPDATE THIS LINE ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

-- Create vendor if not exists for this profile
insert into vendors (profile_id, business_name, owner_name, business_type, status, address, rating_average, rating_count, image)
select :'PROFILE_ID', 'Fresh Mart', 'Owner', 'general_store', 'approved',
       '{"city":"Bengaluru","street":"MG Road","pincode":"560001"}'::jsonb,
       4.6, 240,
       'https://images.unsplash.com/photo-1586201375754-1421e0aa2fda?w=1200'
where not exists (
  select 1 from vendors where profile_id = :'PROFILE_ID'
);

-- Fetch vendor id
with v as (
  select id from vendors where profile_id = :'PROFILE_ID' limit 1
)
-- Insert many products with images across categories
insert into products (name, description, category, subcategory, vendor_id, price, unit, stock, featured, is_available, images, tags)
select p.name, p.description, p.category, p.subcategory, v.id, p.price, p.unit, p.stock, p.featured, true,
       jsonb_build_array(jsonb_build_object('url', p.image, 'alt', p.name)), p.tags
from v,
(
  values
  -- Groceries
  ('Toor Dal Premium', 'High-quality arhar dal rich in protein', 'groceries', 'pulses', 139, 'kg', 50, true, 'https://images.unsplash.com/photo-1604908554027-8834e2f5d5f6?w=1200', array['dal','protein']),
  ('Basmati Rice Gold', 'Long-grain aromatic basmati', 'groceries', 'rice', 199, 'kg', 120, true, 'https://images.unsplash.com/photo-1604908176997-4313b5bdce3d?w=1200', array['rice','basmati']),
  ('Groundnut Oil', 'Cold-pressed groundnut oil', 'groceries', 'oils', 189, 'l', 70, false, 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=1200', array['oil']),
  ('Chana Dal', 'Split chickpeas for everyday cooking', 'groceries', 'pulses', 99, 'kg', 90, false, 'https://images.unsplash.com/photo-1546549039-49c0649d7d6c?w=1200', array['dal']),
  ('Masoor Dal', 'Red lentils for quick meals', 'groceries', 'pulses', 109, 'kg', 60, false, 'https://images.unsplash.com/photo-1604908176885-1f8e754e665d?w=1200', array['dal']),
  ('Atta - Whole Wheat', 'Stone-ground whole wheat flour', 'groceries', 'flour', 65, 'kg', 150, true, 'https://images.unsplash.com/photo-1615485737657-3d3a2d379f2a?w=1200', array['atta','flour']),
  ('Sugar', 'Fine refined sugar', 'groceries', 'essentials', 48, 'kg', 200, false, 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?w=1200', array['sugar']),
  ('Himalayan Pink Salt', 'Mineral-rich pink salt', 'groceries', 'essentials', 85, 'kg', 80, false, 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?w=1200', array['salt']),

  -- Bakery
  ('Bread - Whole Wheat', 'Soft whole wheat loaf', 'bakery', 'bread', 45, 'packet', 100, true, 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200', array['bread','wheat']),
  ('Croissant Butter', 'Flaky French butter croissant', 'bakery', 'pastries', 75, 'piece', 60, true, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=1200', array['croissant']),
  ('Chocolate Muffin', 'Rich cocoa muffin', 'bakery', 'pastries', 60, 'piece', 80, false, 'https://images.unsplash.com/photo-1475856034131-0f5755d8f8a1?w=1200', array['muffin']),
  ('Garlic Breadsticks', 'Crispy garlic breadsticks', 'bakery', 'snacks', 79, 'packet', 90, false, 'https://images.unsplash.com/photo-1461009683693-342af2f2d6ce?w=1200', array['bread']),
  ('Blueberry Cheesecake', 'Creamy cheesecake with blueberry compote', 'bakery', 'cakes', 550, 'box', 20, true, 'https://images.unsplash.com/photo-1490914327627-9fe8d52f4d30?w=1200', array['cake']),

  -- Street Food
  ('Pani Puri Kit', 'Ready-to-make pani puri kit', 'street_food', 'snacks', 99, 'box', 60, true, 'https://images.unsplash.com/photo-1625944528190-86e7c8c01636?w=1200', array['street','snacks']),
  ('Samosa', 'Classic potato samosa', 'street_food', 'snacks', 20, 'piece', 120, false, 'https://images.unsplash.com/photo-1625944528202-a98f114468b0?w=1200', array['samosa']),
  ('Veg Roll', 'Crispy veg roll with spicy sauce', 'street_food', 'rolls', 65, 'piece', 80, false, 'https://images.unsplash.com/photo-1631452180519-1fc61bec24d7?w=1200', array['roll']),
  ('Chole Bhature', 'Punjabi chole with fluffy bhature', 'street_food', 'meals', 140, 'box', 40, true, 'https://images.unsplash.com/photo-1631452181053-1d8b1f08d3ef?w=1200', array['meal']),

  -- Sweets
  ('Rasgulla', 'Classic spongy rasgulla', 'sweets', 'milk_sweets', 320, 'box', 30, true, 'https://images.unsplash.com/photo-1633526543405-20b8f359bd18?w=1200', array['rasgulla','sweets']),
  ('Gulab Jamun', 'Soft gulab jamun in syrup', 'sweets', 'milk_sweets', 340, 'box', 35, true, 'https://images.unsplash.com/photo-1633526543525-8b5b1a3e0f55?w=1200', array['jamun','sweets']),
  ('Kaju Katli', 'Premium cashew burfi', 'sweets', 'dry_sweets', 620, 'box', 25, true, 'https://images.unsplash.com/photo-1607305387297-cf3d299c24c5?w=1200', array['kaju','sweets']),
  ('Soan Papdi', 'Flaky soan papdi', 'sweets', 'dry_sweets', 220, 'box', 60, false, 'https://images.unsplash.com/photo-1607305390352-d2b7d84a0c0a?w=1200', array['soan','sweets']),

  -- Beverages & Produce
  ('Fresh Milk 1L', 'Farm fresh toned milk', 'groceries', 'dairy', 62, 'l', 100, true, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200', array['milk']),
  ('Curd 500g', 'Thick curd for daily use', 'groceries', 'dairy', 45, 'packet', 90, false, 'https://images.unsplash.com/photo-1604908051906-4e3a14f7a64d?w=1200', array['curd']),
  ('Eggs (12 pcs)', 'Farm eggs - dozen', 'groceries', 'eggs', 75, 'box', 70, false, 'https://images.unsplash.com/photo-1517959105821-eaf2591984b2?w=1200', array['eggs']),
  ('Banana (Robusta)', 'Fresh bananas', 'groceries', 'fruits', 35, 'kg', 120, false, 'https://images.unsplash.com/photo-1571772805064-207c8435df79?w=1200', array['banana']),
  ('Apple (Shimla)', 'Crisp red apples', 'groceries', 'fruits', 180, 'kg', 80, false, 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=1200', array['apple']),
  ('Tomato Hybrid', 'Juicy hybrid tomatoes', 'groceries', 'vegetables', 28, 'kg', 140, false, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=1200', array['tomato']),
  ('Potato New Crop', 'New crop potatoes', 'groceries', 'vegetables', 25, 'kg', 160, false, 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200', array['potato']),
  ('Onion Red', 'Fresh red onions', 'groceries', 'vegetables', 26, 'kg', 150, false, 'https://images.unsplash.com/photo-1580910051074-3eb694886ad5?w=1200', array['onion']),
  ('Green Tea', 'Antioxidant-rich green tea', 'groceries', 'beverages', 180, 'box', 60, false, 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=1200', array['tea']),
  ('Filter Coffee', 'Aromatic South Indian filter coffee', 'groceries', 'beverages', 220, 'box', 50, false, 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=1200', array['coffee']),

  -- Bakery Cakes & Cookies
  ('Chocolate Truffle Cake', 'Moist chocolate truffle cake', 'bakery', 'cakes', 699, 'box', 15, true, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=1200', array['cake','chocolate']),
  ('Red Velvet Cake', 'Classic red velvet with cream cheese', 'bakery', 'cakes', 749, 'box', 12, false, 'https://images.unsplash.com/photo-1606313563964-3bfbc3750084?w=1200', array['cake']),
  ('Oatmeal Cookies', 'Crunchy oatmeal cookies', 'bakery', 'biscuits', 120, 'box', 40, false, 'https://images.unsplash.com/photo-1549400956-3d8f1d218f52?w=1200', array['cookie'])
) as p(name, description, category, subcategory, price, unit, stock, featured, image, tags);

-- Verify
-- select count(*) from products;

