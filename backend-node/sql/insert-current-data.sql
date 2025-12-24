-- ============================================
-- INSERT YOUR ACTUAL HEADER & FOOTER DATA
-- Run this AFTER creating tables
-- ============================================

-- Delete old sample data first (if any)
DELETE FROM settings WHERE environment = 'production';

-- Insert your actual header & footer settings
INSERT INTO settings (key, value, environment) VALUES

-- BRAND NAME
('header-footer.brand_name', '"HUMANTEE"', 'production'),

-- TAGLINE FOR FOOTER
('header-footer.tagline', '"A luxury shopping experience crafted with minimalist precision."', 'production'),

-- SOCIAL LINKS
('header-footer.social_links', '{
  "instagram": "https://www.instagram.com/humanteeofficial/",
  "maps": "https://maps.google.com"
}', 'production'),

-- CONTACT INFORMATION
('header-footer.contact', '{
  "email": "humanteeofficial@gmail.com",
  "phone": "+91 7780-661493"
}', 'production'),

-- SCROLLING TEXT (Footer)
('header-footer.scrolling_text', '"WEAR HUMANTEE · WEAR CONFIDENCE"', 'production');

-- Verify data inserted
SELECT * FROM settings WHERE section = 'header-footer';

-- ============================================
-- DONE! Your actual data is now in the database
-- ============================================
