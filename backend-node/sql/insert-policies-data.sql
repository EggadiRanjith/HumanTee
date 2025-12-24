-- ============================================
-- POLICIES SETTINGS - Complete Data Insert
-- Run this in pgAdmin after creating settings tables
-- ============================================

-- Delete old policy data if exists
DELETE FROM settings WHERE section IN ('shipping', 'policies');

-- ============================================
-- SHIPPING POLICY
-- ============================================

INSERT INTO settings (key, value, environment) VALUES

-- Shipping: Effective Date
('shipping.effective_date', '"25/09/2025"', 'production'),

-- Shipping: Intro Text
('shipping.intro_text', '"At Humantee, we aim to deliver your orders quickly and safely. Please review our shipping standards and responsibilities below."', 'production'),

-- Shipping: All Policy Sections
('shipping.sections', '[
  {
    "title": "Order Processing",
    "points": [
      "Orders are processed within 1–2 business days after payment confirmation.",
      "Orders placed on weekends or holidays will be processed on the next business day."
    ]
  },
  {
    "title": "Shipping Methods & Timelines",
    "points": [
      "Standard Shipping: Delivered within 5–7 business days.",
      "Express Shipping (if available): Delivered within 2–4 business days.",
      "Delivery times may vary depending on your location and courier service."
    ]
  },
  {
    "title": "Shipping Charges",
    "points": [
      "Free shipping on orders above 500 Rupees.",
      "Orders below the minimum amount will have a flat shipping fee of 50 Rupees.",
      "Express shipping charges (if offered) will be calculated at checkout."
    ]
  },
  {
    "title": "Tracking Your Order",
    "points": [
      "Once shipped, you will receive an email/SMS with tracking details.",
      "You can track your order using the provided tracking number."
    ]
  },
  {
    "title": "Delays & Responsibility",
    "points": [
      "We are not responsible for delays caused by courier partners, natural events, or incorrect shipping details provided by customers.",
      "If your package is delayed, please contact our support team for assistance."
    ]
  },
  {
    "title": "International Shipping (if applicable)",
    "points": [
      "We ship worldwide to selected countries.",
      "International shipping rates and delivery times vary by destination.",
      "Customs duties, taxes, or import fees are the responsibility of the customer."
    ]
  },
  {
    "title": "Incorrect Address / Failed Delivery",
    "points": [
      "Customers are responsible for providing the correct shipping address.",
      "If a package is returned due to an incorrect or incomplete address, reshipping charges will apply."
    ]
  }
]', 'production');

-- ============================================
-- TERMS & PRIVACY
-- ============================================

INSERT INTO settings (key, value, environment) VALUES

-- Policies: Effective Date
('policies.effective_date', '"25/09/2025"', 'production'),

-- Policies: Intro Text
('policies.intro_text', '"At Humantee, we are committed to safeguarding your personal information and maintaining transparency across all interactions. Review our privacy practices and service terms below."', 'production'),

-- Policies: Privacy Policy Sections
('policies.privacy_sections', '[
  {
    "title": "Information We Collect",
    "points": [
      "Personal Information: Name, email address, phone number, billing/shipping address, and payment details (processed securely via our payment partners).",
      "Non-Personal Information: Browser type, device information, IP address, and browsing behavior."
    ]
  },
  {
    "title": "How We Use Your Information",
    "points": [
      "Process and deliver your orders.",
      "Provide customer support and respond to inquiries.",
      "Send order updates, promotions, and newsletters (you can unsubscribe anytime).",
      "Improve our website, services, and shopping experience.",
      "Prevent fraud and ensure secure transactions."
    ]
  },
  {
    "title": "Sharing of Information",
    "points": [
      "We respect your privacy and do not sell or rent your personal data.",
      "We may share your information only with trusted third parties (payment gateways, delivery partners, IT services) who help us run our business.",
      "We may share information with legal authorities if required by law or to protect our rights."
    ]
  },
  {
    "title": "Cookies & Tracking",
    "points": [
      "Our website uses cookies and similar technologies to enhance user experience, remember preferences, and analyze traffic.",
      "You can manage or disable cookies through your browser settings."
    ]
  },
  {
    "title": "Data Security",
    "points": [
      "We use industry-standard measures to protect your personal data from unauthorized access, loss, or misuse.",
      "Payment information is encrypted and processed securely."
    ]
  },
  {
    "title": "Your Rights",
    "points": [
      "Access, update, or correct your personal information.",
      "Request deletion of your account/data (subject to legal or transactional requirements).",
      "Opt out of marketing emails anytime."
    ]
  },
  {
    "title": "Changes to Policy",
    "points": [
      "We may update this Privacy Policy from time to time.",
      "Updates will be posted on this page with a revised effective date."
    ]
  }
]', 'production'),

-- Policies: Terms & Conditions Sections
('policies.terms_sections', '[
  {
    "title": "General",
    "points": [
      "This website is owned and operated by Humantee.",
      "By using our site, you agree to these Terms & Conditions along with our Privacy Policy and Return & Exchange Policy.",
      "We may update these terms at any time. Changes will be effective immediately once posted."
    ]
  },
  {
    "title": "Products & Orders",
    "points": [
      "All products listed are subject to availability.",
      "We reserve the right to refuse or cancel any order if product availability, pricing errors, or payment issues occur.",
      "Images shown are for illustration; colors may slightly vary due to display settings."
    ]
  },
  {
    "title": "Pricing & Payments",
    "points": [
      "Prices are listed in your selected currency and include or exclude applicable taxes as specified at checkout.",
      "We accept payments through secure third-party gateways.",
      "We are not responsible for delays or issues caused by payment providers."
    ]
  },
  {
    "title": "Shipping & Delivery",
    "points": [
      "Delivery timelines are estimates and may vary based on location and courier services.",
      "We are not responsible for delays caused by shipping carriers, customs, or unforeseen circumstances."
    ]
  },
  {
    "title": "Returns & Exchanges",
    "points": [
      "Returns/exchanges are subject to our Return & Exchange Policy.",
      "Products must meet eligibility conditions to qualify for a refund or exchange."
    ]
  },
  {
    "title": "Intellectual Property",
    "points": [
      "All content on this site, including logos, images, designs, and text, is the property of Humantee.",
      "You may not copy, distribute, or use our content without written permission."
    ]
  },
  {
    "title": "Limitation of Liability",
    "points": [
      "We are not liable for any indirect, incidental, or consequential damages arising from use of our website or products.",
      "Our total liability is limited to the amount you paid for the product."
    ]
  },
  {
    "title": "User Responsibilities",
    "points": [
      "You agree not to misuse our website for fraudulent activities, hacking, or spreading harmful content.",
      "You must provide accurate details while placing an order."
    ]
  },
  {
    "title": "Governing Law",
    "points": [
      "These terms are governed by the laws of India.",
      "Any disputes will be subject to the jurisdiction of courts in Bengaluru, Karnataka."
    ]
  }
]', 'production');

-- Verify data inserted
SELECT key, section, LENGTH(value::text) as content_length 
FROM settings 
WHERE section IN ('shipping', 'policies')
ORDER BY section, key;

-- ============================================
-- DONE! All policy content inserted
-- ============================================
