-- Schema + seed for clothing store. Paste into Supabase SQL Editor and run (safe to re-run).
drop table if exists products cascade;
drop table if exists categories cascade;

create table categories (
  id serial primary key,
  slug text unique not null,
  name text not null,
  "group" text not null, -- men | women | accessories (top-level nav)
  image text
);

create table products (
  id serial primary key,
  title text not null,
  description text,
  price numeric(10,2) not null,
  discount_percentage numeric(5,2) default 0,
  rating numeric(3,2),
  stock int not null default 0,
  brand text,
  thumbnail text,
  images text[] not null default '{}',
  category_id int not null references categories(id)
);

alter table categories enable row level security;
alter table products enable row level security;
create policy "public read categories" on categories for select using (true);
create policy "public read products" on products for select using (true);
grant select on categories, products to anon, authenticated;

insert into categories (slug, name, "group", image) values
('sunglasses', 'Sunglasses', 'accessories', 'https://cdn.dummyjson.com/product-images/sunglasses/black-sun-glasses/thumbnail.webp'),
('mens-watches', 'Men''s Watches', 'accessories', 'https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/thumbnail.webp'),
('womens-jewellery', 'Jewellery', 'women', 'https://cdn.dummyjson.com/product-images/womens-jewellery/green-crystal-earring/thumbnail.webp'),
('womens-bags', 'Bags', 'women', 'https://cdn.dummyjson.com/product-images/womens-bags/blue-women''s-handbag/thumbnail.webp'),
('mens-shoes', 'Men''s Shoes', 'men', 'https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/thumbnail.webp'),
('womens-shoes', 'Women''s Shoes', 'women', 'https://cdn.dummyjson.com/product-images/womens-shoes/black-&-brown-slipper/thumbnail.webp'),
('womens-dresses', 'Dresses', 'women', 'https://cdn.dummyjson.com/product-images/womens-dresses/black-women''s-gown/thumbnail.webp'),
('tops', 'Tops & Tees', 'women', 'https://cdn.dummyjson.com/product-images/tops/blue-frock/thumbnail.webp'),
('jackets', 'Jackets & Coats', 'women', 'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png'),
('mens-shirts', 'Men''s Clothing', 'men', 'https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/thumbnail.webp');

insert into products (title, description, price, discount_percentage, rating, stock, brand, thumbnail, images, category_id) values
('Black Sun Glasses', 'The Black Sun Glasses are a classic and stylish choice, featuring a sleek black frame and tinted lenses. They provide both UV protection and a fashionable look.', 29.99, 4.94, 4.41, 60, 'Fashion Shades', 'https://cdn.dummyjson.com/product-images/sunglasses/black-sun-glasses/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/sunglasses/black-sun-glasses/1.webp','https://cdn.dummyjson.com/product-images/sunglasses/black-sun-glasses/2.webp','https://cdn.dummyjson.com/product-images/sunglasses/black-sun-glasses/3.webp']::text[], (select id from categories where slug = 'sunglasses')),
('Classic Sun Glasses', 'The Classic Sun Glasses offer a timeless design with a neutral frame and UV-protected lenses. These sunglasses are versatile and suitable for various occasions.', 24.99, 4.94, 3.86, 1, 'Fashion Shades', 'https://cdn.dummyjson.com/product-images/sunglasses/classic-sun-glasses/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/sunglasses/classic-sun-glasses/1.webp','https://cdn.dummyjson.com/product-images/sunglasses/classic-sun-glasses/2.webp','https://cdn.dummyjson.com/product-images/sunglasses/classic-sun-glasses/3.webp']::text[], (select id from categories where slug = 'sunglasses')),
('Green and Black Glasses', 'The Green and Black Glasses feature a bold combination of green and black colors, adding a touch of vibrancy to your eyewear collection. They are both stylish and eye-catching.', 34.99, 1.01, 4.55, 24, 'Fashion Shades', 'https://cdn.dummyjson.com/product-images/sunglasses/green-and-black-glasses/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/sunglasses/green-and-black-glasses/1.webp','https://cdn.dummyjson.com/product-images/sunglasses/green-and-black-glasses/2.webp','https://cdn.dummyjson.com/product-images/sunglasses/green-and-black-glasses/3.webp']::text[], (select id from categories where slug = 'sunglasses')),
('Party Glasses', 'The Party Glasses are designed to add flair to your party outfit. With unique shapes or colorful frames, they''re perfect for adding a playful touch to your look during celebrations.', 19.99, 11.22, 2.79, 86, 'Fashion Fun', 'https://cdn.dummyjson.com/product-images/sunglasses/party-glasses/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/sunglasses/party-glasses/1.webp','https://cdn.dummyjson.com/product-images/sunglasses/party-glasses/2.webp','https://cdn.dummyjson.com/product-images/sunglasses/party-glasses/3.webp']::text[], (select id from categories where slug = 'sunglasses')),
('Sunglasses', 'The Sunglasses offer a classic and simple design with a focus on functionality. These sunglasses provide essential UV protection while maintaining a timeless look.', 22.99, 1.51, 3.02, 27, 'Fashion Shades', 'https://cdn.dummyjson.com/product-images/sunglasses/sunglasses/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/sunglasses/sunglasses/1.webp','https://cdn.dummyjson.com/product-images/sunglasses/sunglasses/2.webp','https://cdn.dummyjson.com/product-images/sunglasses/sunglasses/3.webp']::text[], (select id from categories where slug = 'sunglasses')),
('Brown Leather Belt Watch', 'The Brown Leather Belt Watch is a stylish timepiece with a classic design. Featuring a genuine leather strap and a sleek dial, it adds a touch of sophistication to your look.', 89.99, 5.99, 4.19, 32, 'Fashion Timepieces', 'https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/1.webp','https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/2.webp','https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/3.webp']::text[], (select id from categories where slug = 'mens-watches')),
('Longines Master Collection', 'The Longines Master Collection is an elegant and refined watch known for its precision and craftsmanship. With a timeless design, it''s a symbol of luxury and sophistication.', 1499.99, 17.24, 3.87, 100, 'Longines', 'https://cdn.dummyjson.com/product-images/mens-watches/longines-master-collection/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/mens-watches/longines-master-collection/1.webp','https://cdn.dummyjson.com/product-images/mens-watches/longines-master-collection/2.webp','https://cdn.dummyjson.com/product-images/mens-watches/longines-master-collection/3.webp']::text[], (select id from categories where slug = 'mens-watches')),
('Rolex Cellini Date Black Dial', 'The Rolex Cellini Date with Black Dial is a classic and prestigious watch. With a black dial and date complication, it exudes sophistication and is a symbol of Rolex''s heritage.', 8999.99, 8.88, 4.97, 40, 'Rolex', 'https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-date-black-dial/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-date-black-dial/1.webp','https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-date-black-dial/2.webp','https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-date-black-dial/3.webp']::text[], (select id from categories where slug = 'mens-watches')),
('Rolex Cellini Moonphase', 'The Rolex Cellini Moonphase is a masterpiece of horology, featuring a moon phase complication and exquisite design. It reflects Rolex''s commitment to precision and elegance.', 12999.99, 17.52, 2.58, 36, 'Rolex', 'https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-moonphase/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-moonphase/1.webp','https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-moonphase/2.webp','https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-moonphase/3.webp']::text[], (select id from categories where slug = 'mens-watches')),
('Rolex Datejust', 'The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliability, it''s a symbol of Rolex''s watchmaking excellence.', 10999.99, 3.73, 3.66, 86, 'Rolex', 'https://cdn.dummyjson.com/product-images/mens-watches/rolex-datejust/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/mens-watches/rolex-datejust/1.webp','https://cdn.dummyjson.com/product-images/mens-watches/rolex-datejust/2.webp','https://cdn.dummyjson.com/product-images/mens-watches/rolex-datejust/3.webp']::text[], (select id from categories where slug = 'mens-watches')),
('Rolex Submariner Watch', 'The Rolex Submariner is a legendary dive watch with a rich history. Known for its durability and water resistance, it''s a symbol of adventure and exploration.', 13999.99, 5.05, 2.69, 55, 'Rolex', 'https://cdn.dummyjson.com/product-images/mens-watches/rolex-submariner-watch/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/mens-watches/rolex-submariner-watch/1.webp','https://cdn.dummyjson.com/product-images/mens-watches/rolex-submariner-watch/2.webp','https://cdn.dummyjson.com/product-images/mens-watches/rolex-submariner-watch/3.webp']::text[], (select id from categories where slug = 'mens-watches')),
('Green Crystal Earring', 'The Green Crystal Earring is a dazzling accessory that features a vibrant green crystal. With a classic design, it adds a touch of elegance to your ensemble, perfect for formal or special occasions.', 29.99, 15.24, 3.96, 54, null, 'https://cdn.dummyjson.com/product-images/womens-jewellery/green-crystal-earring/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/womens-jewellery/green-crystal-earring/1.webp','https://cdn.dummyjson.com/product-images/womens-jewellery/green-crystal-earring/2.webp','https://cdn.dummyjson.com/product-images/womens-jewellery/green-crystal-earring/3.webp']::text[], (select id from categories where slug = 'womens-jewellery')),
('Green Oval Earring', 'The Green Oval Earring is a stylish and versatile accessory with a unique oval shape. Whether for casual or dressy occasions, its green hue and contemporary design make it a standout piece.', 24.99, 15.18, 3.57, 73, null, 'https://cdn.dummyjson.com/product-images/womens-jewellery/green-oval-earring/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/womens-jewellery/green-oval-earring/1.webp','https://cdn.dummyjson.com/product-images/womens-jewellery/green-oval-earring/2.webp','https://cdn.dummyjson.com/product-images/womens-jewellery/green-oval-earring/3.webp']::text[], (select id from categories where slug = 'womens-jewellery')),
('Tropical Earring', 'The Tropical Earring is a fun and playful accessory inspired by tropical elements. Featuring vibrant colors and a lively design, it''s perfect for adding a touch of summer to your look.', 19.99, 0.76, 4.4, 1, null, 'https://cdn.dummyjson.com/product-images/womens-jewellery/tropical-earring/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/womens-jewellery/tropical-earring/1.webp','https://cdn.dummyjson.com/product-images/womens-jewellery/tropical-earring/2.webp','https://cdn.dummyjson.com/product-images/womens-jewellery/tropical-earring/3.webp']::text[], (select id from categories where slug = 'womens-jewellery')),
('Blue Women''s Handbag', 'The Blue Women''s Handbag is a stylish and spacious accessory for everyday use. With a vibrant blue color and multiple compartments, it combines fashion and functionality.', 49.99, 17.88, 2.92, 76, 'Fashionista', 'https://cdn.dummyjson.com/product-images/womens-bags/blue-women''s-handbag/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/womens-bags/blue-women''s-handbag/1.webp','https://cdn.dummyjson.com/product-images/womens-bags/blue-women''s-handbag/2.webp','https://cdn.dummyjson.com/product-images/womens-bags/blue-women''s-handbag/3.webp']::text[], (select id from categories where slug = 'womens-bags')),
('Heshe Women''s Leather Bag', 'The Heshe Women''s Leather Bag is a luxurious and high-quality leather bag for the sophisticated woman. With a timeless design and durable craftsmanship, it''s a versatile accessory.', 129.99, 3.87, 4.92, 99, 'Heshe', 'https://cdn.dummyjson.com/product-images/womens-bags/heshe-women''s-leather-bag/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/womens-bags/heshe-women''s-leather-bag/1.webp','https://cdn.dummyjson.com/product-images/womens-bags/heshe-women''s-leather-bag/2.webp','https://cdn.dummyjson.com/product-images/womens-bags/heshe-women''s-leather-bag/3.webp']::text[], (select id from categories where slug = 'womens-bags')),
('Prada Women Bag', 'The Prada Women Bag is an iconic designer bag that exudes elegance and luxury. Crafted with precision and featuring the Prada logo, it''s a statement piece for fashion enthusiasts.', 599.99, 14.09, 2.71, 75, 'Prada', 'https://cdn.dummyjson.com/product-images/womens-bags/prada-women-bag/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/womens-bags/prada-women-bag/1.webp','https://cdn.dummyjson.com/product-images/womens-bags/prada-women-bag/2.webp','https://cdn.dummyjson.com/product-images/womens-bags/prada-women-bag/3.webp']::text[], (select id from categories where slug = 'womens-bags')),
('White Faux Leather Backpack', 'The White Faux Leather Backpack is a trendy and practical backpack for the modern woman. With a sleek white design and ample storage space, it''s perfect for both casual and on-the-go styles.', 39.99, 15.2, 3.36, 39, 'Urban Chic', 'https://cdn.dummyjson.com/product-images/womens-bags/white-faux-leather-backpack/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/womens-bags/white-faux-leather-backpack/1.webp','https://cdn.dummyjson.com/product-images/womens-bags/white-faux-leather-backpack/2.webp','https://cdn.dummyjson.com/product-images/womens-bags/white-faux-leather-backpack/3.webp']::text[], (select id from categories where slug = 'womens-bags')),
('Women Handbag Black', 'The Women Handbag in Black is a classic and versatile accessory that complements various outfits. With a timeless black color and functional design, it''s a must-have in every woman''s wardrobe.', 59.99, 11.63, 2.89, 11, 'Elegance Collection', 'https://cdn.dummyjson.com/product-images/womens-bags/women-handbag-black/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/womens-bags/women-handbag-black/1.webp','https://cdn.dummyjson.com/product-images/womens-bags/women-handbag-black/2.webp','https://cdn.dummyjson.com/product-images/womens-bags/women-handbag-black/3.webp']::text[], (select id from categories where slug = 'womens-bags')),
('Nike Air Jordan 1 Red And Black', 'The Nike Air Jordan 1 in Red and Black is an iconic basketball sneaker known for its stylish design and high-performance features, making it a favorite among sneaker enthusiasts and athletes.', 149.99, 4.12, 4.77, 7, 'Nike', 'https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/1.webp','https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/2.webp','https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/3.webp','https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/4.webp']::text[], (select id from categories where slug = 'mens-shoes')),
('Nike Baseball Cleats', 'Nike Baseball Cleats are designed for maximum traction and performance on the baseball field. They provide stability and support for players during games and practices.', 79.99, 18.04, 3.88, 12, 'Nike', 'https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/1.webp','https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/2.webp','https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/3.webp','https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/4.webp']::text[], (select id from categories where slug = 'mens-shoes')),
('Puma Future Rider Trainers', 'The Puma Future Rider Trainers offer a blend of retro style and modern comfort. Perfect for casual wear, these trainers provide a fashionable and comfortable option for everyday use.', 89.99, 4.2, 4.9, 90, 'Puma', 'https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/1.webp','https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/2.webp','https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/3.webp','https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/4.webp']::text[], (select id from categories where slug = 'mens-shoes')),
('Sports Sneakers Off White & Red', 'The Sports Sneakers in Off White and Red combine style and functionality, making them a fashionable choice for sports enthusiasts. The red and off-white color combination adds a bold and energetic touch.', 119.99, 4.97, 4.77, 17, 'Off White', 'https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-&-red/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-&-red/1.webp','https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-&-red/2.webp','https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-&-red/3.webp','https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-&-red/4.webp']::text[], (select id from categories where slug = 'mens-shoes')),
('Sports Sneakers Off White Red', 'Another variant of the Sports Sneakers in Off White Red, featuring a unique design. These sneakers offer style and comfort for casual occasions.', 109.99, 0.04, 4.69, 62, 'Off White', 'https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-red/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-red/1.webp','https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-red/2.webp','https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-red/3.webp','https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-red/4.webp']::text[], (select id from categories where slug = 'mens-shoes')),
('Black & Brown Slipper', 'The Black & Brown Slipper is a comfortable and stylish choice for casual wear. Featuring a blend of black and brown colors, it adds a touch of sophistication to your relaxation.', 19.99, 3.33, 2.53, 3, 'Comfort Trends', 'https://cdn.dummyjson.com/product-images/womens-shoes/black-&-brown-slipper/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/womens-shoes/black-&-brown-slipper/1.webp','https://cdn.dummyjson.com/product-images/womens-shoes/black-&-brown-slipper/2.webp','https://cdn.dummyjson.com/product-images/womens-shoes/black-&-brown-slipper/3.webp','https://cdn.dummyjson.com/product-images/womens-shoes/black-&-brown-slipper/4.webp']::text[], (select id from categories where slug = 'womens-shoes')),
('Calvin Klein Heel Shoes', 'Calvin Klein Heel Shoes are elegant and sophisticated, designed for formal occasions. With a classic design and high-quality materials, they complement your stylish ensemble.', 79.99, 3.19, 4.92, 93, 'Calvin Klein', 'https://cdn.dummyjson.com/product-images/womens-shoes/calvin-klein-heel-shoes/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/womens-shoes/calvin-klein-heel-shoes/1.webp','https://cdn.dummyjson.com/product-images/womens-shoes/calvin-klein-heel-shoes/2.webp','https://cdn.dummyjson.com/product-images/womens-shoes/calvin-klein-heel-shoes/3.webp','https://cdn.dummyjson.com/product-images/womens-shoes/calvin-klein-heel-shoes/4.webp']::text[], (select id from categories where slug = 'womens-shoes')),
('Golden Shoes Woman', 'The Golden Shoes for Women are a glamorous choice for special occasions. Featuring a golden hue and stylish design, they add a touch of luxury to your outfit.', 49.99, 13.93, 3.26, 88, 'Fashion Diva', 'https://cdn.dummyjson.com/product-images/womens-shoes/golden-shoes-woman/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/womens-shoes/golden-shoes-woman/1.webp','https://cdn.dummyjson.com/product-images/womens-shoes/golden-shoes-woman/2.webp','https://cdn.dummyjson.com/product-images/womens-shoes/golden-shoes-woman/3.webp','https://cdn.dummyjson.com/product-images/womens-shoes/golden-shoes-woman/4.webp']::text[], (select id from categories where slug = 'womens-shoes')),
('Pampi Shoes', 'Pampi Shoes offer a blend of comfort and style for everyday use. With a versatile design, they are suitable for various casual occasions, providing a trendy and relaxed look.', 29.99, 14.14, 3.05, 49, 'Pampi', 'https://cdn.dummyjson.com/product-images/womens-shoes/pampi-shoes/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/womens-shoes/pampi-shoes/1.webp','https://cdn.dummyjson.com/product-images/womens-shoes/pampi-shoes/2.webp','https://cdn.dummyjson.com/product-images/womens-shoes/pampi-shoes/3.webp','https://cdn.dummyjson.com/product-images/womens-shoes/pampi-shoes/4.webp']::text[], (select id from categories where slug = 'womens-shoes')),
('Red Shoes', 'The Red Shoes make a bold statement with their vibrant red color. Whether for a party or a casual outing, these shoes add a pop of color and style to your wardrobe.', 34.99, 17.69, 3.25, 7, 'Fashion Express', 'https://cdn.dummyjson.com/product-images/womens-shoes/red-shoes/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/womens-shoes/red-shoes/1.webp','https://cdn.dummyjson.com/product-images/womens-shoes/red-shoes/2.webp','https://cdn.dummyjson.com/product-images/womens-shoes/red-shoes/3.webp','https://cdn.dummyjson.com/product-images/womens-shoes/red-shoes/4.webp']::text[], (select id from categories where slug = 'womens-shoes')),
('Black Women''s Gown', 'The Black Women''s Gown is an elegant and timeless evening gown. With a sleek black design, it''s perfect for formal events and special occasions, exuding sophistication and style.', 129.99, 10.48, 3.64, 25, null, 'https://cdn.dummyjson.com/product-images/womens-dresses/black-women''s-gown/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/womens-dresses/black-women''s-gown/1.webp','https://cdn.dummyjson.com/product-images/womens-dresses/black-women''s-gown/2.webp','https://cdn.dummyjson.com/product-images/womens-dresses/black-women''s-gown/3.webp','https://cdn.dummyjson.com/product-images/womens-dresses/black-women''s-gown/4.webp']::text[], (select id from categories where slug = 'womens-dresses')),
('Corset Leather With Skirt', 'The Corset Leather With Skirt is a bold and edgy ensemble that combines a stylish corset with a matching skirt. Ideal for fashion-forward individuals, it makes a statement at any event.', 89.99, 16.26, 3.05, 30, null, 'https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/1.webp','https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/2.webp','https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/3.webp','https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/4.webp']::text[], (select id from categories where slug = 'womens-dresses')),
('Corset With Black Skirt', 'The Corset With Black Skirt is a chic and versatile outfit that pairs a fashionable corset with a classic black skirt. It offers a trendy and coordinated look for various occasions.', 79.99, 15.06, 4.52, 33, null, 'https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/1.webp','https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/2.webp','https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/3.webp','https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/4.webp']::text[], (select id from categories where slug = 'womens-dresses')),
('Dress Pea', 'The Dress Pea is a stylish and comfortable dress with a pea pattern. Perfect for casual outings, it adds a playful and fun element to your wardrobe, making it a great choice for day-to-day wear.', 49.99, 17.68, 4.88, 6, null, 'https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/1.webp','https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/2.webp','https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/3.webp','https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/4.webp']::text[], (select id from categories where slug = 'womens-dresses')),
('Marni Red & Black Suit', 'The Marni Red & Black Suit is a sophisticated and fashion-forward suit ensemble. With a combination of red and black tones, it showcases a modern design for a bold and confident look.', 179.99, 19.02, 4.48, 62, null, 'https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/1.webp','https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/2.webp','https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/3.webp','https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/4.webp']::text[], (select id from categories where slug = 'womens-dresses')),
('Blue Frock', 'The Blue Frock is a charming and stylish dress for various occasions. With a vibrant blue color and a comfortable design, it adds a touch of elegance to your wardrobe.', 29.99, 12.13, 4.17, 52, null, 'https://cdn.dummyjson.com/product-images/tops/blue-frock/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/tops/blue-frock/1.webp','https://cdn.dummyjson.com/product-images/tops/blue-frock/2.webp','https://cdn.dummyjson.com/product-images/tops/blue-frock/3.webp','https://cdn.dummyjson.com/product-images/tops/blue-frock/4.webp']::text[], (select id from categories where slug = 'tops')),
('Girl Summer Dress', 'The Girl Summer Dress is a cute and breezy dress designed for warm weather. With playful patterns and lightweight fabric, it''s perfect for keeping cool and stylish during the summer.', 19.99, 19.2, 4.77, 43, null, 'https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/1.webp','https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/2.webp','https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/3.webp','https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/4.webp']::text[], (select id from categories where slug = 'tops')),
('Gray Dress', 'The Gray Dress is a versatile and chic option for various occasions. With a neutral gray color, it can be dressed up or down, making it a wardrobe staple for any fashion-forward individual.', 34.99, 14.28, 2.72, 55, null, 'https://cdn.dummyjson.com/product-images/tops/gray-dress/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/tops/gray-dress/1.webp','https://cdn.dummyjson.com/product-images/tops/gray-dress/2.webp','https://cdn.dummyjson.com/product-images/tops/gray-dress/3.webp','https://cdn.dummyjson.com/product-images/tops/gray-dress/4.webp']::text[], (select id from categories where slug = 'tops')),
('Short Frock', 'The Short Frock is a playful and trendy dress with a shorter length. Ideal for casual outings or special occasions, it combines style and comfort for a fashionable look.', 24.99, 13.45, 3.23, 22, null, 'https://cdn.dummyjson.com/product-images/tops/short-frock/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/tops/short-frock/1.webp','https://cdn.dummyjson.com/product-images/tops/short-frock/2.webp','https://cdn.dummyjson.com/product-images/tops/short-frock/3.webp','https://cdn.dummyjson.com/product-images/tops/short-frock/4.webp']::text[], (select id from categories where slug = 'tops')),
('Tartan Dress', 'The Tartan Dress features a classic tartan pattern, bringing a timeless and sophisticated touch to your wardrobe. Perfect for fall and winter, it adds a hint of traditional charm.', 39.99, 12.95, 4.05, 73, null, 'https://cdn.dummyjson.com/product-images/tops/tartan-dress/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/tops/tartan-dress/1.webp','https://cdn.dummyjson.com/product-images/tops/tartan-dress/2.webp','https://cdn.dummyjson.com/product-images/tops/tartan-dress/3.webp','https://cdn.dummyjson.com/product-images/tops/tartan-dress/4.webp']::text[], (select id from categories where slug = 'tops')),
('MBJ Women''s Solid Short Sleeve Boat Neck V', '95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch for comfort, Ribbed on sleeves and neckline / Double stitching on bottom hem', 9.85, 0, 4.7, 38, null, 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png', array['https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png']::text[], (select id from categories where slug = 'tops')),
('Opna Women''s Short Sleeve Moisture', '100% Polyester, Machine wash, 100% cationic polyester interlock, Machine Wash & Pre Shrunk for a Great Fit, Lightweight, roomy and highly breathable with moisture wicking fabric which helps to keep moisture away, Soft Lightweight Fabric with comfortable V-neck collar and a slimmer fit, delivers a sleek, more feminine silhouette and Added Comfort', 7.95, 0, 4.5, 39, null, 'https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_t.png', array['https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_t.png']::text[], (select id from categories where slug = 'tops')),
('DANVOUY Womens T Shirt Casual Cotton Short', '95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.', 12.99, 0, 3.6, 40, null, 'https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_t.png', array['https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_t.png']::text[], (select id from categories where slug = 'tops')),
('BIYLACLESEN Women''s 3-in-1 Snowboard Jacket Winter Coats', 'Note:The Jackets is US standard size, Please choose size as your usual wear Material: 100% Polyester; Detachable Liner Fabric: Warm Fleece. Detachable Functional Liner: Skin Friendly, Lightweigt and Warm.Stand Collar Liner jacket, keep you warm in cold weather. Zippered Pockets: 2 Zippered Hand Pockets, 2 Zippered Pockets on Chest (enough to keep cards or keys)and 1 Hidden Pocket Inside.Zippered Hand Pockets and Hidden Pocket keep your things secure. Humanized Design: Adjustable and Detachable Hood and Adjustable cuff to prevent the wind and water,for a comfortable fit. 3 in 1 Detachable Design provide more convenience, you can separate the coat and inner as needed, or wear it together. It is suitable for different season and help you adapt to different climates', 56.99, 0, 2.6, 35, null, 'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png', array['https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png']::text[], (select id from categories where slug = 'jackets')),
('Lock and Love Women''s Removable Hooded Faux Leather Moto Biker Jacket', '100% POLYURETHANE(shell) 100% POLYESTER(lining) 75% POLYESTER 25% COTTON (SWEATER), Faux leather material for style and comfort / 2 pockets of front, 2-For-One Hooded denim style faux leather jacket, Button detail on waist / Detail stitching at sides, HAND WASH ONLY / DO NOT BLEACH / LINE DRY / DO NOT IRON', 29.95, 0, 2.9, 36, null, 'https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_t.png', array['https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_t.png']::text[], (select id from categories where slug = 'jackets')),
('Rain Jacket Women Windbreaker Striped Climbing Raincoats', 'Lightweight perfet for trip or casual wear---Long sleeve with hooded, adjustable drawstring waist design. Button and zipper front closure raincoat, fully stripes Lined and The Raincoat has 2 side pockets are a good size to hold all kinds of things, it covers the hips, and the hood is generous but doesn''t overdo it.Attached Cotton Lined Hood with Adjustable Drawstrings give it a real styled look.', 39.99, 0, 3.8, 37, null, 'https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2t.png', array['https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2t.png']::text[], (select id from categories where slug = 'jackets')),
('Blue & Black Check Shirt', 'The Blue & Black Check Shirt is a stylish and comfortable men''s shirt featuring a classic check pattern. Made from high-quality fabric, it''s suitable for both casual and semi-formal occasions.', 29.99, 15.35, 3.64, 38, 'Fashion Trends', 'https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/1.webp','https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/2.webp','https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/3.webp','https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/4.webp']::text[], (select id from categories where slug = 'mens-shirts')),
('Gigabyte Aorus Men Tshirt', 'The Gigabyte Aorus Men Tshirt is a cool and casual shirt for gaming enthusiasts. With the Aorus logo and sleek design, it''s perfect for expressing your gaming style.', 24.99, 0.94, 3.18, 90, 'Gigabyte', 'https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/1.webp','https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/2.webp','https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/3.webp','https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/4.webp']::text[], (select id from categories where slug = 'mens-shirts')),
('Man Plaid Shirt', 'The Man Plaid Shirt is a timeless and versatile men''s shirt with a classic plaid pattern. Its comfortable fit and casual style make it a wardrobe essential for various occasions.', 34.99, 19.5, 3.46, 82, 'Classic Wear', 'https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/1.webp','https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/2.webp','https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/3.webp','https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/4.webp']::text[], (select id from categories where slug = 'mens-shirts')),
('Man Short Sleeve Shirt', 'The Man Short Sleeve Shirt is a breezy and stylish option for warm days. With a comfortable fit and short sleeves, it''s perfect for a laid-back yet polished look.', 19.99, 6.83, 2.9, 2, 'Casual Comfort', 'https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/1.webp','https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/2.webp','https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/3.webp','https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/4.webp']::text[], (select id from categories where slug = 'mens-shirts')),
('Men Check Shirt', 'The Men Check Shirt is a classic and versatile shirt featuring a stylish check pattern. Suitable for various occasions, it adds a smart and polished touch to your wardrobe.', 27.99, 11.38, 2.72, 95, 'Urban Chic', 'https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/thumbnail.webp', array['https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/1.webp','https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/2.webp','https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/3.webp','https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/4.webp']::text[], (select id from categories where slug = 'mens-shirts')),
('Mens Casual Premium Slim Fit T-Shirts', 'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.', 22.3, 0, 4.1, 22, null, 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png', array['https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png']::text[], (select id from categories where slug = 'mens-shirts')),
('Mens Cotton Jacket', 'great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.', 55.99, 0, 4.7, 23, null, 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png', array['https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png']::text[], (select id from categories where slug = 'mens-shirts')),
('Mens Casual Slim Fit', 'The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.', 15.99, 0, 2.1, 24, null, 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png', array['https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png']::text[], (select id from categories where slug = 'mens-shirts'));


-- Orders (added for checkout feature) --------------------------------------
drop table if exists order_items cascade;
drop table if exists orders cascade;

create table orders (
  id serial primary key,
  user_id uuid not null references auth.users(id),
  total numeric(10,2) not null,
  status text not null default 'pending',
  payment_method text not null default 'cod', -- 'cod' | 'card'
  payment_ref text unique, -- Stripe checkout session id; unique = idempotent order recording
  created_at timestamptz not null default now()
);

create table order_items (
  id serial primary key,
  order_id int not null references orders(id) on delete cascade,
  product_id int not null references products(id),
  quantity int not null check (quantity > 0),
  unit_price numeric(10,2) not null
);

alter table orders enable row level security;
alter table order_items enable row level security;

create policy "own orders" on orders
  for select using (auth.uid() = user_id);
create policy "insert own orders" on orders
  for insert with check (auth.uid() = user_id);
create policy "own order items" on order_items
  for select using (exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "insert own order items" on order_items
  for insert with check (exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid()));

grant select, insert on orders, order_items to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- Role-based access -----------------------------------------------------
-- Every auth user gets a profiles row (role 'customer') via trigger.
-- Admins are appointed by updating profiles.role — from the Admin → Users
-- page or SQL — never chosen at signup. The initial admin is promoted below.

drop table if exists profiles cascade;
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

-- security definer: reads profiles regardless of RLS, so policies can call it
create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin')
$$;

alter table profiles enable row level security;
create policy "read own profile" on profiles
  for select using (auth.uid() = id);
create policy "admin read all profiles" on profiles
  for select using (is_admin());
create policy "admin update profiles" on profiles
  for update using (is_admin()) with check (is_admin());
grant select, update on profiles to authenticated;

-- auto-create a profile for every new signup
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- backfill profiles for users that existed before the trigger
insert into profiles (id, email)
  select id, email from auth.users
  on conflict (id) do nothing;

-- bootstrap: promote the initial administrator (operator step, change as needed)
update profiles set role = 'admin' where email = 'kingkiller000999@gmail.com';

-- admin policies on shop tables
create policy "admin write products" on products
  for all using (is_admin()) with check (is_admin());
create policy "admin write categories" on categories
  for all using (is_admin()) with check (is_admin());
create policy "admin read all orders" on orders
  for select using (is_admin());
create policy "admin update orders" on orders
  for update using (is_admin()) with check (is_admin());
create policy "admin read all order items" on order_items
  for select using (is_admin());

grant insert, update, delete on products, categories to authenticated;
grant update on orders to authenticated;

-- Employees (HR / payroll records, admin-only) ------------------------------
drop table if exists employees cascade;

create table employees (
  id serial primary key,
  name text not null,
  position text not null,
  email text,
  phone text,
  salary numeric(10,2) not null default 0, -- monthly, same currency as the shop ($)
  hired_at date not null default current_date,
  created_at timestamptz not null default now()
);

alter table employees enable row level security;
create policy "admin all employees" on employees
  for all using (is_admin()) with check (is_admin());

grant select, insert, update, delete on employees to authenticated;
grant usage, select on all sequences in schema public to authenticated;

insert into employees (name, position, email, phone, salary, hired_at) values
  ('Nimal Perera',    'Store Manager',    'nimal@lukin.example',    '077-1234567', 1400, '2024-03-01'),
  ('Sanduni Silva',   'Sales Assistant',  'sanduni@lukin.example',  '071-2345678',  650, '2024-06-15'),
  ('Kasun Fernando',  'Sales Assistant',  'kasun@lukin.example',    '076-3456789',  650, '2024-09-01'),
  ('Ishara Jayasinghe', 'Inventory Clerk','ishara@lukin.example',   '070-4567890',  700, '2025-01-10'),
  ('Tharindu Wickramasinghe', 'Delivery Coordinator', 'tharindu@lukin.example', '075-5678901', 800, '2025-04-01');
