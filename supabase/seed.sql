-- ============================================================
-- Arro Seed Data v2.0
-- Run AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- JOURNEY STAGES (8 stages)
-- ============================================================
INSERT INTO journey_stages (id, stage_code, name, description, sort_order) VALUES
  ('11111111-0001-0001-0001-000000000001', 'STAGE-01', 'Planning Arrival',   'Tasks to complete before you land in Canada', 1),
  ('11111111-0001-0001-0001-000000000002', 'STAGE-02', 'First Week',          'Essential setup in your first 7 days', 2),
  ('11111111-0001-0001-0001-000000000003', 'STAGE-03', 'First Month',         'Getting established in your first 30 days', 3),
  ('11111111-0001-0001-0001-000000000004', 'STAGE-04', 'Settling In',         'Building routines and community connections', 4),
  ('11111111-0001-0001-0001-000000000005', 'STAGE-05', 'Thriving In School',  'Academic success and campus life', 5),
  ('11111111-0001-0001-0001-000000000006', 'STAGE-06', 'Employment Prep',     'Preparing for Canadian work experience', 6),
  ('11111111-0001-0001-0001-000000000007', 'STAGE-07', 'Graduation Planning', 'Preparing for life after graduation', 7),
  ('11111111-0001-0001-0001-000000000008', 'STAGE-08', 'Future Planning',     'Post-graduation pathways and long-term goals', 8)
ON CONFLICT (stage_code) DO NOTHING;

-- ============================================================
-- SCHOOLS (10 schools — 3 Phase 1, 7 Phase 2)
-- ============================================================
INSERT INTO schools (id, name, city, website, active, launch_phase) VALUES
  ('22222222-0001-0001-0001-000000000001', 'York University',         'Toronto',    'https://yorku.ca',          true, 1),
  ('22222222-0001-0001-0001-000000000002', 'Seneca Polytechnic',      'Toronto',    'https://senecapolytechnic.ca', true, 1),
  ('22222222-0001-0001-0001-000000000003', 'George Brown College',    'Toronto',    'https://georgebrown.ca',    true, 1),
  ('22222222-0001-0001-0001-000000000004', 'University of Toronto',   'Toronto',    'https://utoronto.ca',       true, 2),
  ('22222222-0001-0001-0001-000000000005', 'Ryerson University',      'Toronto',    'https://torontomu.ca',      true, 2),
  ('22222222-0001-0001-0001-000000000006', 'Humber College',          'Etobicoke',  'https://humber.ca',         true, 2),
  ('22222222-0001-0001-0001-000000000007', 'Centennial College',      'Toronto',    'https://centennialcollege.ca', true, 2),
  ('22222222-0001-0001-0001-000000000008', 'Sheridan College',        'Oakville',   'https://sheridancollege.ca', true, 2),
  ('22222222-0001-0001-0001-000000000009', 'Durham College',          'Oshawa',     'https://durhamcollege.ca',  true, 2),
  ('22222222-0001-0001-0001-000000000010', 'Algonquin College',       'Ottawa',     'https://algonquincollege.com', true, 2)
ON CONFLICT DO NOTHING;

-- ============================================================
-- TASKS — STAGE-01: Planning Arrival (pre-arrival)
-- ============================================================
INSERT INTO tasks (task_code, title, description, why_it_matters, category, stage_id, priority, estimated_minutes) VALUES
  ('ARR-001', 'Confirm your study permit is approved',
   'Verify your study permit approval letter (Port of Entry letter or visa sticker) is ready and valid. Check all details including program, institution, and expiry date.',
   'You cannot legally study in Canada without a valid study permit. Errors on your permit can cause serious immigration issues on arrival.',
   'Immigration', '11111111-0001-0001-0001-000000000001', 'P1', 15),

  ('ARR-002', 'Book your flight and plan your arrival date',
   'Book flights arriving before your program start date. Aim to arrive 1–2 weeks early to settle in. Save your itinerary and have it accessible offline.',
   'Arriving early gives you time to find housing, open a bank account, and get your SIN before classes start.',
   'Travel', '11111111-0001-0001-0001-000000000001', 'P1', 30),

  ('ARR-003', 'Arrange temporary accommodation for arrival',
   'Book at least 2 weeks of temporary housing (hotel, Airbnb, school residence) before securing permanent housing. Many schools offer short-term stays.',
   'You will need a Canadian address to open a bank account, get a SIN, and receive mail. Having housing secured removes major arrival stress.',
   'Housing', '11111111-0001-0001-0001-000000000001', 'P1', 45),

  ('ARR-004', 'Research your school''s international student orientation',
   'Find your school''s international student orientation dates. Register if required. Note what documents to bring and what services will be available.',
   'Orientation provides your student ID, introduction to campus services, and connects you with fellow international students.',
   'School', '11111111-0001-0001-0001-000000000001', 'P2', 20),

  ('ARR-005', 'Get travel health insurance',
   'Purchase travel/health insurance valid from your departure date until your provincial health card coverage begins (typically 3 months after arrival in Ontario).',
   'OHIP (Ontario Health Insurance Plan) has a 3-month waiting period. Without coverage, a single emergency room visit can cost $3,000–$10,000.',
   'Healthcare', '11111111-0001-0001-0001-000000000001', 'P1', 30),

  ('ARR-006', 'Prepare your document checklist for border crossing',
   'Gather: passport, study permit approval letter, Letter of Acceptance, proof of funds, return ticket (optional), any previous Canadian visas. Make digital copies.',
   'Border agents can ask for any of these documents. Being unprepared can cause delays or secondary inspection.',
   'Immigration', '11111111-0001-0001-0001-000000000001', 'P1', 20),

  ('ARR-007', 'Research cost of living in your city',
   'Research average rent, grocery costs, transit fares, and other living expenses in your school''s city. Create a monthly budget estimate.',
   'Understanding costs before you arrive prevents financial shock and helps you plan how much money to bring.',
   'Finance', '11111111-0001-0001-0001-000000000001', 'P2', 40),

  ('ARR-008', 'Set up Canadian phone plan research',
   'Research prepaid and postpaid Canadian phone plans. Providers include Rogers, Bell, Telus, Koodo, Fido, and Public Mobile. Compare prices for your needs.',
   'You will need a Canadian phone number almost immediately for banking, apps, and staying connected.',
   'Setup', '11111111-0001-0001-0001-000000000001', 'P2', 20),

  ('ARR-009', 'Notify your home country bank of travel',
   'Inform your home bank you are moving to Canada so they do not freeze your card. Ask about international transaction fees and ATM withdrawal limits.',
   'Without notifying your bank, your cards may be blocked as suspicious foreign transactions on day one.',
   'Finance', '11111111-0001-0001-0001-000000000001', 'P2', 15),

  ('ARR-010', 'Download Arro and key Canada apps',
   'Download: Arro (this app), Google Maps, Transit app, Canada Post, your bank''s app (once set up), and your school''s student app if available.',
   'Having the right apps installed before arrival helps you navigate immediately without burning expensive data.',
   'Setup', '11111111-0001-0001-0001-000000000001', 'P3', 15)
ON CONFLICT (task_code) DO NOTHING;

-- ============================================================
-- TASKS — STAGE-02: First Week
-- ============================================================
INSERT INTO tasks (task_code, title, description, why_it_matters, category, stage_id, priority, estimated_minutes) VALUES
  ('FW-001', 'Complete port of entry — get study permit stamped',
   'At the Canadian border or airport, present your documents to a CBSA officer. They will stamp your passport or issue a Visitor Record. Ensure the conditions on your permit are correct.',
   'This is when your study permit officially activates. Any errors must be caught immediately — changes later are much harder.',
   'Immigration', '11111111-0001-0001-0001-000000000002', 'P1', 60),

  ('FW-002', 'Get a Canadian SIM card and phone number',
   'Purchase a SIM card from a Canadian carrier. Major options: Rogers, Bell, Telus, Koodo, Fido, Public Mobile. Prepaid plans start around $25/month.',
   'A Canadian phone number is required for banking (two-factor authentication), job applications, and most Canadian services.',
   'Setup', '11111111-0001-0001-0001-000000000002', 'P1', 60),

  ('FW-003', 'Attend your school''s international student orientation',
   'Attend all mandatory and recommended orientation sessions. Bring your passport, acceptance letter, and study permit. Get your student ID card.',
   'Orientation gives you your student card, campus tour, and connections to essential services. Missing it means weeks of catch-up.',
   'School', '11111111-0001-0001-0001-000000000002', 'P1', 240),

  ('FW-004', 'Open a Canadian bank account',
   'Open a no-fee chequing account. Top banks for students: TD, RBC, Scotiabank, BMO, CIBC. Bring your passport, study permit, and proof of address. Student accounts are usually free.',
   'You cannot receive scholarships, bursaries, part-time pay, or e-transfers without a Canadian bank account. Most landlords require Canadian banking.',
   'Banking', '11111111-0001-0001-0001-000000000002', 'P1', 90),

  ('FW-005', 'Apply for your Social Insurance Number (SIN)',
   'Apply online at canada.ca/en/employment-social-development/services/sin or in person at a Service Canada office. Bring your study permit. Processing is usually same-day in person.',
   'You need a SIN for any paid employment in Canada, including on-campus jobs. Without it, employers cannot legally pay you.',
   'Immigration', '11111111-0001-0001-0001-000000000002', 'P1', 60),

  ('FW-006', 'Set up your school email and student portal',
   'Activate your school email address and log in to your student portal (MyYorku, My Seneca, STU-VIEW, etc.). Set up two-factor authentication.',
   'All course registrations, grades, financial aid notices, and school communications come through your school email. Missing these can have serious consequences.',
   'School', '11111111-0001-0001-0001-000000000002', 'P1', 30),

  ('FW-007', 'Buy a transit pass or card',
   'Get a PRESTO card (Ontario''s transit payment card) loaded with funds, or set up a monthly transit pass through your school or transit provider.',
   'Public transit is essential for getting around Ontario cities. A PRESTO card gives you discounted fares versus cash and works across multiple transit systems.',
   'Transport', '11111111-0001-0001-0001-000000000002', 'P1', 45),

  ('FW-008', 'Locate the nearest grocery store, pharmacy, and hospital',
   'Walk or transit to identify your nearest Walmart, No Frills, or FreshCo (budget groceries); a pharmacy; and the nearest hospital emergency room.',
   'Knowing where basics are before you need them urgently prevents panic. No Frills and FreshCo are significantly cheaper than Loblaws or Metro.',
   'Setup', '11111111-0001-0001-0001-000000000002', 'P2', 60),

  ('FW-009', 'Join your school''s international student Facebook/WhatsApp group',
   'Search for your school''s international student community group on Facebook, WhatsApp, or Discord. Many are run by student unions or ISA (International Student Association).',
   'Fellow international students are your fastest source of housing tips, cheap furniture, part-time job leads, and social connection.',
   'Community', '11111111-0001-0001-0001-000000000002', 'P2', 20),

  ('FW-010', 'Register with your home country''s consulate in Canada',
   'Register your presence in Canada with your home country''s embassy or consulate (e.g., through the ROCA system for Indian nationals, or equivalent).',
   'Registration means your government can contact you in emergencies, elections, or consular issues. It is free and quick.',
   'Immigration', '11111111-0001-0001-0001-000000000002', 'P3', 30)
ON CONFLICT (task_code) DO NOTHING;

-- ============================================================
-- TASKS — STAGE-03: First Month
-- ============================================================
INSERT INTO tasks (task_code, title, description, why_it_matters, category, stage_id, priority, estimated_minutes) VALUES
  ('FM-001', 'Secure permanent housing',
   'Find and sign a lease for permanent accommodation. Options: school residence, private rental, home-stay, or basement apartment. Budget $900–$1,800/month in Toronto. Read your lease carefully before signing.',
   'Stable housing is the foundation of academic success. Uncertainty about where you live creates constant stress that affects your grades.',
   'Housing', '11111111-0001-0001-0001-000000000003', 'P1', 480),

  ('FM-002', 'Apply for OHIP (Ontario Health Insurance Plan)',
   'Apply for OHIP at a ServiceOntario location with your study permit, passport, and proof of Ontario address. Coverage begins after a 3-month waiting period.',
   'After OHIP activates, most doctor and hospital visits are free. Before it activates, you need private insurance — costly without OHIP.',
   'Healthcare', '11111111-0001-0001-0001-000000000003', 'P1', 60),

  ('FM-003', 'Find a family doctor or register with a walk-in clinic',
   'Register with Health Care Connect (ontario.ca/page/find-family-doctor) to be matched with a family doctor, or find your nearest walk-in clinic for non-emergency care.',
   'Walk-in clinics and ERs are for urgent care. A family doctor provides preventive care, mental health referrals, and prescription management.',
   'Healthcare', '11111111-0001-0001-0001-000000000003', 'P2', 30),

  ('FM-004', 'Understand your school''s health and dental insurance',
   'Check if your school''s student union provides supplemental health and dental insurance (most Ontario colleges and universities do). Understand what is covered and how to make claims.',
   'Student union health plans often cover prescription drugs, dental checkups, glasses, and mental health sessions not covered by OHIP.',
   'Healthcare', '11111111-0001-0001-0001-000000000003', 'P2', 30),

  ('FM-005', 'Set up a monthly budget',
   'Track your income (savings, family support, part-time work) and expenses (rent, groceries, transit, tuition, phone). Use a spreadsheet or app like YNAB or Mint.',
   'Running out of money mid-semester is a leading cause of academic withdrawal among international students.',
   'Finance', '11111111-0001-0001-0001-000000000003', 'P1', 60),

  ('FM-006', 'Learn about on-campus and off-campus work rights',
   'International students with a valid study permit can work up to 24 hours per week off-campus during semesters (as of 2024 rules). On-campus work has no hour limit.',
   'Knowing your work rights prevents accidentally violating your study permit conditions, which can result in deportation.',
   'Jobs', '11111111-0001-0001-0001-000000000003', 'P1', 20),

  ('FM-007', 'Explore on-campus food options and meal planning',
   'Visit your school''s cafeteria, food courts, and free food programs. Many campuses have food banks. Plan your grocery strategy (Walmart, No Frills, Superstore are cheapest).',
   'Food is often the biggest variable expense. Smart grocery shopping can save $200–$400/month versus convenience eating.',
   'Finance', '11111111-0001-0001-0001-000000000003', 'P2', 45),

  ('FM-008', 'Connect with an academic advisor',
   'Book an appointment with your faculty''s academic advisor. Confirm your course selection is correct for your program requirements and graduation timeline.',
   'Wrong course selections can delay graduation by a full semester. Advisors catch these errors early.',
   'School', '11111111-0001-0001-0001-000000000003', 'P2', 60),

  ('FM-009', 'Locate your school''s writing and tutoring centre',
   'Find your school''s writing centre, math tutoring, and learning support services. These are usually free with your student fees and dramatically improve academic performance.',
   'These services are paid for through your tuition. Using them maximizes the return on your education investment.',
   'School', '11111111-0001-0001-0001-000000000003', 'P2', 20),

  ('FM-010', 'Explore your neighbourhood and city transit routes',
   'Take exploratory transit trips on weekends. Learn your city''s major districts, markets, parks, and landmarks. Download local city maps.',
   'Feeling at home in your city reduces isolation and homesickness, which are top contributors to academic struggles.',
   'Community', '11111111-0001-0001-0001-000000000003', 'P3', 120),

  ('FM-011', 'Apply for a Canadian credit card (starter)',
   'Apply for a student credit card or a secured credit card to start building Canadian credit history. Options: Scotia Momentum Visa, TD Student Visa, Koho (prepaid).',
   'Canadian credit history is needed for apartment rentals, phone plans, future loans, and eventually immigration applications. Starting now means 1–2 years of history by graduation.',
   'Credit', '11111111-0001-0001-0001-000000000003', 'P2', 45),

  ('FM-012', 'File a change of address with Canada Post (if applicable)',
   'If you moved from temporary housing to permanent housing, set up a mail forward or update your address with all institutions.',
   'Missing government mail (OHIP card, SIN documents, tax notices) causes significant downstream problems.',
   'Setup', '11111111-0001-0001-0001-000000000003', 'P3', 15)
ON CONFLICT (task_code) DO NOTHING;

-- ============================================================
-- TASKS — STAGE-04: Settling In
-- ============================================================
INSERT INTO tasks (task_code, title, description, why_it_matters, category, stage_id, priority, estimated_minutes) VALUES
  ('SET-001', 'Build your Canadian credit history actively',
   'Use your credit card for small purchases and pay the full balance monthly. Aim for under 30% utilization. Sign up for free credit monitoring (Borrowell or Credit Karma Canada).',
   'Credit history is a long-term game. Every month of on-time payment builds toward housing, car loans, and immigration applications.',
   'Credit', '11111111-0001-0001-0001-000000000004', 'P2', 20),

  ('SET-002', 'Join a club, sport, or student society',
   'Join at least one on-campus club, intramural sport, or cultural student association. Your school''s student union website lists all clubs.',
   'Studies consistently show that students with campus connections have higher retention rates and GPAs. Social isolation is a major dropout risk.',
   'Community', '11111111-0001-0001-0001-000000000004', 'P2', 60),

  ('SET-003', 'Visit your school''s counselling services',
   'Book an appointment with your school''s counselling centre, even for a check-in. Know where it is and how to access urgent mental health support.',
   'Homesickness, culture shock, and academic pressure often peak around month 2–4. Knowing support exists before crisis prevents escalation.',
   'Healthcare', '11111111-0001-0001-0001-000000000004', 'P2', 60),

  ('SET-004', 'Set up online banking and automatic bill payments',
   'Set up e-transfers for rent payment, automatic credit card minimum payment, and mobile banking alerts. Explore your bank''s student offers and perks.',
   'Late rent or missed credit card payments cause credit score damage and can trigger lease violations.',
   'Banking', '11111111-0001-0001-0001-000000000004', 'P2', 30),

  ('SET-005', 'Understand your tenant rights in Ontario',
   'Read the Ontario Residential Tenancies Act summary. Know: landlords cannot raise rent more than the annual guideline, must give 24 hours notice for entry, and cannot discriminate.',
   'International students are frequently targeted by predatory landlords who count on tenants not knowing their rights.',
   'Housing', '11111111-0001-0001-0001-000000000004', 'P2', 30),

  ('SET-006', 'Start saving — even $25/month',
   'Open a Tax-Free Savings Account (TFSA) or a high-interest savings account (EQ Bank, Simplii, Wealthsimple Save offer 4–5% interest). Set up an automatic weekly transfer.',
   'An emergency fund prevents financial crises from becoming academic crises. Even a $500 cushion is transformative.',
   'Finance', '11111111-0001-0001-0001-000000000004', 'P2', 30),

  ('SET-007', 'Get your OHIP card when it arrives',
   'Your OHIP card arrives by mail about 3 months after you applied. Confirm your address is correct. Once received, carry it with you.',
   'Without your OHIP card, you will be charged for medical services even though you are covered.',
   'Healthcare', '11111111-0001-0001-0001-000000000004', 'P1', 10),

  ('SET-008', 'Explore free and cheap activities in your city',
   'Research free Toronto/Ontario activities: free museum days, parks, public libraries, festivals, community centres. Library card is free with Ontario address.',
   'Social wellbeing on a student budget is entirely possible but requires knowing what is available. Libraries alone offer free internet, books, DVDs, and events.',
   'Community', '11111111-0001-0001-0001-000000000004', 'P3', 30),

  ('SET-009', 'Consider renters insurance',
   'Tenant insurance costs $15–$25/month and covers theft, fire, and liability. Ask your landlord if they require it. Intact, TD, and PC Financial offer affordable plans.',
   'A laptop theft or apartment fire can cost thousands. Insurance transforms a financial disaster into a minor inconvenience.',
   'Housing', '11111111-0001-0001-0001-000000000004', 'P3', 30),

  ('SET-010', 'Learn about the Ontario 211 helpline',
   'Save 211 in your phone (or visit 211ontario.ca). It connects you to free local services: food banks, mental health support, legal aid, settlement services.',
   '211 is one of the most underused resources for newcomers. It can connect you to services worth hundreds or thousands of dollars in support.',
   'Community', '11111111-0001-0001-0001-000000000004', 'P3', 10)
ON CONFLICT (task_code) DO NOTHING;

-- ============================================================
-- TASKS — STAGE-05: Thriving In School
-- ============================================================
INSERT INTO tasks (task_code, title, description, why_it_matters, category, stage_id, priority, estimated_minutes) VALUES
  ('SCH-001', 'Meet with your academic advisor each semester',
   'Schedule a semesterly check-in with your academic advisor to review your transcript, confirm your graduation requirements, and discuss any challenges.',
   'Advisors catch problems (missing prerequisites, wrong course loads) before they become graduation delays.',
   'School', '11111111-0001-0001-0001-000000000005', 'P1', 60),

  ('SCH-002', 'Use your school''s career centre',
   'Visit your school''s career centre. They offer: resume reviews, mock interviews, LinkedIn optimization, job fair prep, and employer connections. Most services are free with student card.',
   'Students who use career centres are significantly more likely to find employment within 6 months of graduation.',
   'Jobs', '11111111-0001-0001-0001-000000000005', 'P2', 60),

  ('SCH-003', 'Apply for bursaries and awards each year',
   'Search your school''s awards database and external awards (Aga Khan, Trudeau, Loran, etc.). Many go unclaimed because students do not apply. Your school''s financial aid office has a full list.',
   'Thousands of dollars in bursaries and awards go unclaimed each year at Canadian universities and colleges.',
   'Finance', '11111111-0001-0001-0001-000000000005', 'P2', 120),

  ('SCH-004', 'Build relationships with 2–3 professors',
   'Attend office hours, ask thoughtful questions, and follow up on feedback. Build genuine relationships with 2–3 professors who can write you reference letters.',
   'Reference letters from professors are required for graduate school, many scholarships, and increasingly for competitive jobs.',
   'School', '11111111-0001-0001-0001-000000000005', 'P2', 0),

  ('SCH-005', 'Get involved in a research project or co-op (if available)',
   'Ask professors about research assistantships or apply for your program''s co-op or internship stream. On-campus research also counts as Canadian work experience.',
   'Canadian work experience dramatically improves both employment outcomes and immigration eligibility (Express Entry points).',
   'Jobs', '11111111-0001-0001-0001-000000000005', 'P2', 120),

  ('SCH-006', 'Learn your academic integrity policies',
   'Read your institution''s academic integrity policy carefully. Understand what constitutes plagiarism, AI use policies, and consequences of violations.',
   'Academic integrity violations can result in expulsion, which may trigger study permit cancellation. The rules differ significantly from many home countries.',
   'School', '11111111-0001-0001-0001-000000000005', 'P1', 30),

  ('SCH-007', 'Register with accessibility services (if needed)',
   'If you have a learning disability, mental health condition, or physical disability, register with your school''s Accessibility Services office to receive accommodations.',
   'Accommodations like extra exam time or note-taking support are only available to students who register. They can be the difference between passing and failing.',
   'School', '11111111-0001-0001-0001-000000000005', 'P2', 60),

  ('SCH-008', 'File your Canadian income tax return',
   'File a T1 tax return with the CRA (Canada Revenue Agency) each spring, even if you had no income. Students can claim tuition credits worth hundreds of dollars.',
   'Unclaimed tuition tax credits carry forward and can be transferred. Failing to file prevents you from receiving GST/HST credit payments.',
   'Taxes', '11111111-0001-0001-0001-000000000005', 'P1', 90),

  ('SCH-009', 'Understand the GST/HST credit',
   'Apply for the GST/HST credit when filing your taxes. International students on study permits often qualify. It pays $300–$500 per year in quarterly instalments.',
   'This is free government money. Many international students do not know they are eligible.',
   'Taxes', '11111111-0001-0001-0001-000000000005', 'P2', 30),

  ('SCH-010', 'Set study permit renewal reminder',
   'Add a calendar reminder 6 months before your study permit expires. Renewal applications should be submitted at least 3 months before expiry.',
   'If your study permit expires, you lose the right to study and work in Canada until it is renewed. Processing takes 6–16 weeks.',
   'Immigration', '11111111-0001-0001-0001-000000000005', 'P1', 10)
ON CONFLICT (task_code) DO NOTHING;

-- ============================================================
-- TASKS — STAGE-06: Employment Prep (triggered by Jobs goal)
-- ============================================================
INSERT INTO tasks (task_code, title, description, why_it_matters, category, stage_id, priority, estimated_minutes) VALUES
  ('EMP-001', 'Create or update a Canadian-style resume',
   'Canadian resumes are typically 1–2 pages, no photo, no age/marital status. Use a clean template (check your school''s career centre). Focus on achievements and quantifiable results.',
   'A resume that follows home-country norms (photo, personal details, 3+ pages) is often immediately screened out by Canadian recruiters.',
   'Jobs', '11111111-0001-0001-0001-000000000006', 'P1', 120),

  ('EMP-002', 'Optimize your LinkedIn profile',
   'Set up a complete LinkedIn profile: professional photo, compelling headline, detailed experience with impact bullets, skills section, and custom URL. Reach 500+ connections.',
   '87% of Canadian recruiters use LinkedIn. A strong profile multiplies your visibility beyond job boards.',
   'Jobs', '11111111-0001-0001-0001-000000000006', 'P1', 90),

  ('EMP-003', 'Research your work permit eligibility',
   'Understand your off-campus work rights (up to 24 hours/week during semesters, full-time during scheduled breaks). Research PGWP eligibility after graduation.',
   'Working more hours than your permit allows is a criminal offence in Canada that can result in deportation and future immigration bans.',
   'Jobs', '11111111-0001-0001-0001-000000000006', 'P1', 30),

  ('EMP-004', 'Attend your school''s job fair',
   'Register for your school''s on-campus job fair(s). Research attending employers beforehand. Prepare your elevator pitch. Bring printed resumes.',
   'Job fairs give you direct access to hiring managers and recruiters. One conversation at a job fair can bypass the online application bottleneck.',
   'Jobs', '11111111-0001-0001-0001-000000000006', 'P2', 180),

  ('EMP-005', 'Apply for an on-campus part-time job',
   'Search your school''s job board for on-campus positions (library, tutoring, research assistant, admin). On-campus jobs have no hour restrictions and are more flexible with class schedules.',
   'On-campus jobs count as Canadian work experience, pay well, and are explicitly designed for students. They are your easiest entry to Canadian work experience.',
   'Jobs', '11111111-0001-0001-0001-000000000006', 'P1', 60),

  ('EMP-006', 'Practice job interviews in Canadian style',
   'Canadian interviews heavily use the STAR method (Situation, Task, Action, Result). Book a mock interview at your career centre. Practice 10 common behavioural questions.',
   'Behavioural interviews are uncommon in many countries. Being unprepared for "Tell me about a time when..." questions is a top interview failure point for international students.',
   'Jobs', '11111111-0001-0001-0001-000000000006', 'P2', 120),

  ('EMP-007', 'Build a professional reference list',
   'Identify 3 professional references: professors, previous employers, volunteer supervisors. Ask their permission to be listed. Prepare a reference sheet with their details.',
   'Canadian employers typically request references before final hiring decisions. Having them ready accelerates your hiring timeline.',
   'Jobs', '11111111-0001-0001-0001-000000000006', 'P2', 45),

  ('EMP-008', 'Research Express Entry and CRS points',
   'Learn about Express Entry (Canada''s main skilled worker immigration pathway). Calculate your Comprehensive Ranking System (CRS) score at canada.ca. Canadian work experience is the biggest points booster.',
   'Every semester of Canadian work experience can be worth 50–100 CRS points. Understanding this early motivates strategic career decisions.',
   'Immigration', '11111111-0001-0001-0001-000000000006', 'P2', 60),

  ('EMP-009', 'Join a professional association or industry group',
   'Join a professional association in your field (e.g., Engineers Canada, CPA Canada, HRPA, CAMSC). Many offer student memberships at reduced rates.',
   'Professional networks in Canada are tight. Association membership gives you access to networking events, job boards, and mentors that are not publicly available.',
   'Jobs', '11111111-0001-0001-0001-000000000006', 'P3', 30),

  ('EMP-010', 'Explore government employment programs for newcomers',
   'Research federal and Ontario programs: Canada Summer Jobs, Youth Employment and Skills Strategy, Ontario Immigrant Nominee Program (OINP). Check eligibility.',
   'Government employment programs have lower competition than private sector jobs and often provide valuable Canadian work experience.',
   'Jobs', '11111111-0001-0001-0001-000000000006', 'P3', 45)
ON CONFLICT (task_code) DO NOTHING;

-- ============================================================
-- TASKS — STAGE-07: Graduation Planning
-- ============================================================
INSERT INTO tasks (task_code, title, description, why_it_matters, category, stage_id, priority, estimated_minutes) VALUES
  ('GRAD-001', 'Apply for your Post-Graduation Work Permit (PGWP)',
   'Apply for your PGWP online within 180 days of receiving your final grades or official notice of completion. You can apply from inside Canada. Gather: transcripts, study permit, passport.',
   'The PGWP is your most important document post-graduation. It lets you work full-time for any employer in Canada for up to 3 years. Missing the 180-day window forfeits this right.',
   'Immigration', '11111111-0001-0001-0001-000000000007', 'P1', 120),

  ('GRAD-002', 'Audit your graduation requirements',
   'Book an appointment with your academic advisor to confirm all credits are complete. Request a degree audit or program completion checklist. Apply for graduation through your student portal.',
   'Graduation is not automatic. Failing to apply for graduation on time can delay convocation and transcript issuance, which delays your PGWP application.',
   'School', '11111111-0001-0001-0001-000000000007', 'P1', 60),

  ('GRAD-003', 'Request official transcripts',
   'Order official sealed transcripts from your registrar''s office. Order multiple copies — you will need them for PGWP, immigration, graduate school, and employers.',
   'Official transcripts are required for most post-graduation steps. Rush processing can take weeks. Order early.',
   'School', '11111111-0001-0001-0001-000000000007', 'P1', 30),

  ('GRAD-004', 'Intensify your job search',
   'Expand your applications: industry-specific job boards (Workopolis, Indeed, LinkedIn Jobs, your school alumni network, sector-specific boards). Target 10–15 applications per week.',
   'Average Canadian job search takes 3–6 months. Starting at graduation is 3 months too late. Start 6 months before convocation.',
   'Jobs', '11111111-0001-0001-0001-000000000007', 'P1', 0),

  ('GRAD-005', 'Get your credential evaluated (if required)',
   'If your degree requires a foreign credential assessment for your profession (teaching, engineering, nursing, etc.), initiate the WES (World Education Services) or ICAS evaluation.',
   'Many regulated professions in Canada require foreign credential recognition before you can practice. These processes take 3–6 months.',
   'Immigration', '11111111-0001-0001-0001-000000000007', 'P2', 60),

  ('GRAD-006', 'Explore graduate school options in Canada',
   'Research masters programs in Canada if applicable. Understand that Canadian graduate degrees further increase Express Entry CRS points and earn you additional PGWP time.',
   'A Canadian graduate degree adds 30 CRS points and can qualify you for a 3-year PGWP, substantially improving permanent residency prospects.',
   'School', '11111111-0001-0001-0001-000000000007', 'P3', 90),

  ('GRAD-007', 'Update your immigration status plan',
   'Book a free consultation with your school''s immigration advising office. Map out your pathway from PGWP to permanent residency. Explore Express Entry, PNP (Ontario Immigrant Nominee Program), and other streams.',
   'The period between graduation and PR application is the most critical in your immigration journey. A plan prevents costly mistakes.',
   'Immigration', '11111111-0001-0001-0001-000000000007', 'P1', 90)
ON CONFLICT (task_code) DO NOTHING;

-- ============================================================
-- TASKS — STAGE-08: Future Planning
-- ============================================================
INSERT INTO tasks (task_code, title, description, why_it_matters, category, stage_id, priority, estimated_minutes) VALUES
  ('FUT-001', 'Apply for Permanent Residency',
   'Create or update your Express Entry profile. Calculate your CRS score. Research Provincial Nominee Programs (PNPs). Apply when you receive an Invitation to Apply (ITA).',
   'Permanent Residency is the key to full rights in Canada: higher pay, any job, social programs, and eventually citizenship. Every step since arrival has been building toward this.',
   'Immigration', '11111111-0001-0001-0001-000000000008', 'P1', 240),

  ('FUT-002', 'File Canadian taxes as a permanent resident',
   'As a PR, file taxes claiming all available deductions and credits. Consider working with a CPA familiar with newcomer tax situations for your first year.',
   'PR status changes your tax obligations and available credits. Getting this right in year one prevents future CRA complications.',
   'Taxes', '11111111-0001-0001-0001-000000000008', 'P1', 90),

  ('FUT-003', 'Apply for a Canadian passport (if eligible)',
   'After 3 years of physical presence as a PR (must have lived in Canada 1,095 of the last 5 years), apply for Canadian citizenship and subsequently a Canadian passport.',
   'A Canadian passport provides visa-free or visa-on-arrival access to 185+ countries — often far more than your home country passport.',
   'Immigration', '11111111-0001-0001-0001-000000000008', 'P3', 0),

  ('FUT-004', 'Review your RRSP and TFSA contribution room',
   'As a Canadian resident, you accumulate RRSP and TFSA contribution room. Understand the limits and start contributing to reduce your tax burden and save for long-term goals.',
   'Tax-sheltered savings are one of the most powerful wealth-building tools available in Canada. Starting early compounds dramatically.',
   'Finance', '11111111-0001-0001-0001-000000000008', 'P2', 60),

  ('FUT-005', 'Establish a long-term financial plan',
   'Consider working with a fee-only financial advisor to create a financial plan covering: emergency fund, debt elimination, home ownership goals, retirement planning.',
   'International students who arrive with a long-term financial plan accumulate wealth significantly faster than those who plan reactively.',
   'Finance', '11111111-0001-0001-0001-000000000008', 'P3', 120)
ON CONFLICT (task_code) DO NOTHING;

-- ============================================================
-- SCHOOL-SPECIFIC TASKS — York University
-- ============================================================
INSERT INTO tasks (task_code, title, description, why_it_matters, category, stage_id, priority, estimated_minutes, school_id) VALUES
  ('YORK-001', 'Activate your Passport York account',
   'Log in to passport.yorku.ca to activate your single sign-on account. This gives access to MyYorku, course registration, email, and the Student Financial Profile.',
   'Passport York is required for everything at York University. Without it, you cannot register in courses or access services.',
   'School', '11111111-0001-0001-0001-000000000002', 'P1', 20, '22222222-0001-0001-0001-000000000001'),

  ('YORK-002', 'Register with York''s Centre for International Experience (CIE)',
   'Visit cie.yorku.ca to register with the CIE and access immigration advising, cultural programming, and international student peer mentoring.',
   'The CIE is York''s primary support hub for international students. Registered students get priority access to immigration advising and settlement support.',
   'School', '11111111-0001-0001-0001-000000000002', 'P1', 30, '22222222-0001-0001-0001-000000000001'),

  ('YORK-003', 'Apply for the York Student Financial Profile',
   'Complete the Student Financial Profile at yorku.ca/sfp to be considered for all available York bursaries, awards, and emergency funding.',
   'York distributes millions in bursary funding annually. The SFP is the single application that makes you eligible for multiple awards.',
   'Finance', '11111111-0001-0001-0001-000000000003', 'P1', 45, '22222222-0001-0001-0001-000000000001'),

  ('YORK-004', 'Get your YU-card',
   'Pick up your YU-card (student ID) at the YU-card office. This is your campus access card, transit card (for York Lanes TTC station), library card, and printing card.',
   'The YU-card is required for exams, library access, on-campus services, and printing. Get it on your first week.',
   'School', '11111111-0001-0001-0001-000000000002', 'P1', 20, '22222222-0001-0001-0001-000000000001'),

  ('YORK-005', 'Explore York''s off-campus housing board',
   'Visit yorku.ca/housing/off-campus to search verified off-campus housing listings. York vets these listings to reduce scam risk.',
   'York''s official housing board is significantly safer than Facebook Marketplace or Kijiji for finding off-campus housing.',
   'Housing', '11111111-0001-0001-0001-000000000002', 'P2', 30, '22222222-0001-0001-0001-000000000001')
ON CONFLICT (task_code) DO NOTHING;

-- ============================================================
-- SCHOOL-SPECIFIC TASKS — Seneca Polytechnic
-- ============================================================
INSERT INTO tasks (task_code, title, description, why_it_matters, category, stage_id, priority, estimated_minutes, school_id) VALUES
  ('SEN-001', 'Activate your Seneca student portal (MySeneca)',
   'Log in to my.senecapolytechnic.ca to access your student portal. Set up your Seneca email and enable Multi-Factor Authentication (MFA).',
   'MySeneca is your gateway to timetables, grades, financial aid, and all Seneca services. MFA protects your academic record.',
   'School', '11111111-0001-0001-0001-000000000002', 'P1', 20, '22222222-0001-0001-0001-000000000002'),

  ('SEN-002', 'Register with Seneca''s International Centre',
   'Visit senecapolytechnic.ca/international and register with the International Student Centre for immigration advising, peer mentoring, and settlement support.',
   'Seneca''s International Centre provides free immigration consultations, settlement services, and connects you to bursaries not available through other channels.',
   'School', '11111111-0001-0001-0001-000000000002', 'P1', 30, '22222222-0001-0001-0001-000000000002'),

  ('SEN-003', 'Apply for Seneca bursaries and awards',
   'Apply for Seneca''s international student bursaries through the Seneca Student Awards portal. Deadlines are typically September and January.',
   'Seneca distributes significant financial support to international students. Many bursaries go unclaimed due to low awareness.',
   'Finance', '11111111-0001-0001-0001-000000000003', 'P2', 60, '22222222-0001-0001-0001-000000000002'),

  ('SEN-004', 'Understand Seneca''s co-op program (if applicable)',
   'Check if your Seneca program includes a co-op or field placement component. If so, register with the Co-op and Career Centre in your first semester.',
   'Seneca co-op placements are one of the most direct routes to Canadian work experience and post-graduation employment.',
   'Jobs', '11111111-0001-0001-0001-000000000005', 'P2', 45, '22222222-0001-0001-0001-000000000002'),

  ('SEN-005', 'Get your Seneca student ID card',
   'Get your student ID from any Seneca campus admissions office. Bring your acceptance letter and photo ID.',
   'Your student ID is required for exams, library access, transit discounts, and campus services.',
   'School', '11111111-0001-0001-0001-000000000002', 'P1', 20, '22222222-0001-0001-0001-000000000002'),

  ('SEN-006', 'Use Seneca''s Academic Learning Support',
   'Access free tutoring, writing support, and math help through Seneca''s Academic Learning Support (ALS) service. Available at all campuses and online.',
   'Seneca''s ALS is free with your student fees. Students who use it average a full letter grade higher than those who do not.',
   'School', '11111111-0001-0001-0001-000000000003', 'P2', 30, '22222222-0001-0001-0001-000000000002'),

  ('SEN-007', 'Research Seneca''s pathway to university programs',
   'Explore Seneca''s transfer pathways and partnerships with universities like York, Ryerson, and others for students who want to continue to a degree.',
   'Seneca has formal transfer agreements with multiple universities. Completing a Seneca diploma can be credited toward a university degree.',
   'School', '11111111-0001-0001-0001-000000000004', 'P3', 45, '22222222-0001-0001-0001-000000000002'),

  ('SEN-008', 'Explore Seneca''s entrepreneurship programs',
   'Visit Seneca''s HELIX incubator and entrepreneurship programs if you are interested in starting a business while studying.',
   'Seneca''s HELIX is one of Ontario''s leading college incubators. Starting your entrepreneurship journey here provides mentorship, funding access, and networking.',
   'Jobs', '11111111-0001-0001-0001-000000000005', 'P3', 30, '22222222-0001-0001-0001-000000000002'),

  ('SEN-009', 'Apply for the Seneca Emergency Fund',
   'If you face unexpected financial hardship, apply to Seneca''s Emergency Bursary Fund. Available year-round through the Financial Aid office.',
   'Financial emergencies (medical, family, theft) do not align with academic calendars. Seneca''s emergency fund can prevent academic withdrawal.',
   'Finance', '11111111-0001-0001-0001-000000000004', 'P2', 30, '22222222-0001-0001-0001-000000000002'),

  ('SEN-010', 'Join the Seneca Student Federation (SSF)',
   'Learn about the Seneca Student Federation''s services: student card benefits, legal protection plan, health/dental coverage, and student discounts.',
   'The SSF administers significant student benefits that are paid for through your fees. Knowing what is covered saves real money.',
   'School', '11111111-0001-0001-0001-000000000002', 'P2', 20, '22222222-0001-0001-0001-000000000002')
ON CONFLICT (task_code) DO NOTHING;

-- ============================================================
-- SCHOOL-SPECIFIC TASKS — George Brown College
-- ============================================================
INSERT INTO tasks (task_code, title, description, why_it_matters, category, stage_id, priority, estimated_minutes, school_id) VALUES
  ('GBC-001', 'Activate your George Brown student portal (STU-VIEW)',
   'Log in to stuview.georgebrown.ca to activate your student account, access your timetable, grades, and financial information.',
   'STU-VIEW is the hub for all George Brown administrative functions including course registration, fees, and academic records.',
   'School', '11111111-0001-0001-0001-000000000002', 'P1', 20, '22222222-0001-0001-0001-000000000003'),

  ('GBC-002', 'Register with GBC''s International Centre',
   'Visit georgebrown.ca/international-students and register with the International Centre for immigration support, settlement advising, and peer connections.',
   'GBC''s International Centre is the primary support hub for the college''s large international student population.',
   'School', '11111111-0001-0001-0001-000000000002', 'P1', 30, '22222222-0001-0001-0001-000000000003'),

  ('GBC-003', 'Get your GBC student ID card',
   'Get your George Brown student ID at the Registrar''s office. Bring your acceptance letter and government-issued photo ID.',
   'Your student ID is required for exams, library access, transit discounts, and services. It also activates your Student Association benefits.',
   'School', '11111111-0001-0001-0001-000000000002', 'P1', 20, '22222222-0001-0001-0001-000000000003'),

  ('GBC-004', 'Explore GBC''s unique downtown Toronto location advantages',
   'George Brown is located in St. James Town/Distillery District and waterfront areas. Explore networking opportunities with Toronto''s financial, culinary, and tech hubs nearby.',
   'GBC''s location in the heart of Toronto provides unparalleled access to industry networks, especially in hospitality, culinary arts, business, and health sciences.',
   'Jobs', '11111111-0001-0001-0001-000000000003', 'P3', 60, '22222222-0001-0001-0001-000000000003'),

  ('GBC-005', 'Apply for GBC financial assistance',
   'Apply for George Brown''s bursaries and financial assistance through the Financial Aid office. Bring your financial documents and SIN.',
   'GBC has specific bursary funds for international students facing financial hardship. Applications are reviewed multiple times per year.',
   'Finance', '11111111-0001-0001-0001-000000000003', 'P2', 45, '22222222-0001-0001-0001-000000000003'),

  ('GBC-006', 'Connect with GBC''s industry partnerships',
   'Ask your program coordinator about GBC''s industry partners and field placement opportunities. GBC has deep connections in healthcare, hospitality, technology, and business.',
   'GBC''s field placement model gives you hands-on Canadian work experience that counts toward immigration points.',
   'Jobs', '11111111-0001-0001-0001-000000000005', 'P2', 45, '22222222-0001-0001-0001-000000000003'),

  ('GBC-007', 'Visit the GBC Casa Loma Campus Student Life Office',
   'If enrolled at Casa Loma campus, visit the Student Life office for club registration, events, and campus resources.',
   'GBC has multiple campuses and each has its own Student Life team. Connecting early improves your campus experience and support network.',
   'Community', '11111111-0001-0001-0001-000000000002', 'P3', 20, '22222222-0001-0001-0001-000000000003'),

  ('GBC-008', 'Check GBC''s residence and housing options',
   'If you need housing, check georgebrown.ca/housing for GBC Waterfront Residence availability and the off-campus housing board.',
   'GBC Waterfront Residence fills up quickly. Apply early in your acceptance cycle if you are interested in on-campus living.',
   'Housing', '11111111-0001-0001-0001-000000000001', 'P2', 30, '22222222-0001-0001-0001-000000000003'),

  ('GBC-009', 'Access GBC''s Counselling and Student Wellbeing',
   'Book an appointment with GBC''s counselling team for academic, personal, or career counselling. Services are free with your student card.',
   'GBC counsellors are experienced with the specific challenges international students face including culture shock, financial stress, and academic adjustment.',
   'Healthcare', '11111111-0001-0001-0001-000000000003', 'P2', 60, '22222222-0001-0001-0001-000000000003'),

  ('GBC-010', 'Join the George Brown Student Association (GBCSA)',
   'Connect with the GBCSA for student governance, clubs, events, and advocacy. The GBCSA also administers your health and dental plan.',
   'The GBCSA administers significant student benefits. Knowing your coverage prevents unexpected out-of-pocket expenses.',
   'School', '11111111-0001-0001-0001-000000000002', 'P2', 20, '22222222-0001-0001-0001-000000000003'),

  ('GBC-011', 'Research GBC''s continuing education pathways',
   'Explore how GBC continuing education certificates can complement your diploma and improve employment outcomes.',
   'Additional GBC credentials are often discounted for current students and can make you significantly more competitive in your field.',
   'School', '11111111-0001-0001-0001-000000000005', 'P3', 30, '22222222-0001-0001-0001-000000000003'),

  ('GBC-012', 'Use GBC''s Career Services',
   'Register with GBC''s Career Services for resume workshops, interview prep, job fairs, and connections to GBC''s employer network.',
   'GBC Career Services connects students with employers specifically looking for GBC graduates in their program areas.',
   'Jobs', '11111111-0001-0001-0001-000000000004', 'P2', 60, '22222222-0001-0001-0001-000000000003'),

  ('GBC-013', 'Learn about GBC''s culinary and hospitality programs (if applicable)',
   'If enrolled in culinary or hospitality, connect with the Chef School restaurant and placement teams for real-world experience opportunities.',
   'GBC''s Chef School is world-class. Students who participate in placement programs earn strong references and work experience for immigration.',
   'Jobs', '11111111-0001-0001-0001-000000000005', 'P2', 30, '22222222-0001-0001-0001-000000000003'),

  ('GBC-014', 'Set up emergency contact and safe arrival protocol',
   'Register your emergency contact details with GBC. Note the campus safety number and after-hours security contact.',
   'In medical or personal emergencies, having your contacts and safety protocols registered with GBC allows staff to act quickly.',
   'Setup', '11111111-0001-0001-0001-000000000002', 'P2', 15, '22222222-0001-0001-0001-000000000003'),

  ('GBC-015', 'Explore GBC scholarship opportunities',
   'Visit georgebrown.ca/financialaid for international student scholarships, entrance awards, and renewable scholarships.',
   'GBC has specific entrance scholarships for high-performing international students. Renewable scholarships require maintaining a minimum GPA.',
   'Finance', '11111111-0001-0001-0001-000000000002', 'P2', 30, '22222222-0001-0001-0001-000000000003'),

  ('GBC-016', 'Connect with GBC''s peer mentoring program',
   'Apply for or connect with GBC''s peer mentoring program, which pairs new international students with experienced international student mentors.',
   'Peer mentors navigate culture shock, academic expectations, and city life from lived experience. This connection is often transformative in the first semester.',
   'Community', '11111111-0001-0001-0001-000000000002', 'P1', 30, '22222222-0001-0001-0001-000000000003'),

  ('GBC-017', 'Register for GBC''s English language support (if needed)',
   'If English is not your first language, access GBC''s English for Academic Purposes (EAP) support programs to strengthen your academic writing and communication.',
   'Academic writing in Canadian English follows specific conventions. EAP support has been shown to significantly improve grades for international students.',
   'School', '11111111-0001-0001-0001-000000000002', 'P2', 30, '22222222-0001-0001-0001-000000000003'),

  ('GBC-018', 'Get a Presto card for Toronto transit',
   'Purchase a PRESTO card at any TTC station or online. Load it with funds and consider the monthly pass if you commute to GBC campuses daily.',
   'GBC has three campuses across downtown Toronto. A monthly PRESTO pass is significantly cheaper than paying per trip.',
   'Transport', '11111111-0001-0001-0001-000000000002', 'P1', 30, '22222222-0001-0001-0001-000000000003'),

  ('GBC-019', 'Visit the GBC library and learning commons',
   'Tour GBC''s library and learning commons at your campus. Get your library card activated and explore digital databases available free with your student account.',
   'GBC provides access to academic databases worth thousands of dollars annually. These are essential for assignments and research.',
   'School', '11111111-0001-0001-0001-000000000002', 'P2', 30, '22222222-0001-0001-0001-000000000003'),

  ('GBC-020', 'Understand GBC''s attendance and academic policies',
   'Read GBC''s academic policies on attendance, deferrals, and academic standing. College policies differ from university policies in some important ways.',
   'GBC programs often have mandatory attendance requirements tied to field placement eligibility. Missing classes can disqualify you from placements.',
   'School', '11111111-0001-0001-0001-000000000002', 'P1', 20, '22222222-0001-0001-0001-000000000003'),

  ('GBC-021', 'Apply for OSAP (if eligible)',
   'If you are a Permanent Resident or Protected Person, you may be eligible for OSAP (Ontario Student Assistance Program). Apply at ontario.ca/osap at the start of each academic year.',
   'OSAP provides grants and loans worth thousands of dollars to eligible Ontario students. PR and Protected Person students are often unaware they qualify.',
   'Finance', '11111111-0001-0001-0001-000000000003', 'P1', 60, '22222222-0001-0001-0001-000000000003'),

  ('GBC-022', 'Explore GBC''s technology and maker spaces',
   'Visit GBC''s tech labs, maker spaces, and Innovation Exchange. Access 3D printers, recording studios, and industry-grade equipment free with your student card.',
   'GBC''s labs and maker spaces provide access to professional equipment that would cost thousands to access privately.',
   'School', '11111111-0001-0001-0001-000000000003', 'P3', 30, '22222222-0001-0001-0001-000000000003'),

  ('GBC-023', 'Join GBC cultural and international student clubs',
   'Browse GBC''s club directory for cultural associations, international student clubs, and professional development clubs.',
   'Cultural clubs are often the fastest way to find community, friendship, and support from people who understand your background.',
   'Community', '11111111-0001-0001-0001-000000000002', 'P2', 20, '22222222-0001-0001-0001-000000000003'),

  ('GBC-024', 'Register for GBC''s Work Integrated Learning (WIL) portal',
   'Register on GBC''s WIL portal to access field placement postings, work-integrated learning opportunities, and employer connections.',
   'Field placements at GBC are often directly tied to permanent employment. The WIL portal is your gateway to these opportunities.',
   'Jobs', '11111111-0001-0001-0001-000000000004', 'P1', 30, '22222222-0001-0001-0001-000000000003'),

  ('GBC-025', 'Explore GBC''s social services and advocacy resources',
   'GBC has partnerships with settlement agencies, legal aid clinics, and social services. Ask the International Centre for referrals.',
   'Settlement agencies can help with translation, legal questions, housing disputes, and social support — all free for eligible newcomers.',
   'Community', '11111111-0001-0001-0001-000000000003', 'P3', 20, '22222222-0001-0001-0001-000000000003'),

  ('GBC-026', 'Activate your GBC Microsoft 365 account',
   'Activate your GBC Microsoft 365 license for free access to Word, Excel, PowerPoint, Teams, and 1TB OneDrive storage.',
   'This saves you the cost of a Microsoft 365 subscription ($150+/year) and ensures you have professional software for all assignments.',
   'Setup', '11111111-0001-0001-0001-000000000002', 'P1', 15, '22222222-0001-0001-0001-000000000003'),

  ('GBC-027', 'Check GBC''s academic calendar for key dates',
   'Download or bookmark GBC''s academic calendar showing: add/drop deadlines, withdrawal deadlines, final exam schedules, and holiday closures.',
   'Missing add/drop deadlines means you are stuck in courses. Missing withdrawal deadlines means failing grades. These dates are critical.',
   'School', '11111111-0001-0001-0001-000000000002', 'P1', 15, '22222222-0001-0001-0001-000000000003'),

  ('GBC-028', 'Use GBC''s food pantry and free meal programs',
   'GBC''s student association operates food programs for students facing food insecurity. Ask the Student Association office for details.',
   'Food insecurity is more common among international students than universities often acknowledge. These programs exist specifically for this and are confidential.',
   'Finance', '11111111-0001-0001-0001-000000000003', 'P3', 10, '22222222-0001-0001-0001-000000000003')
ON CONFLICT (task_code) DO NOTHING;

-- ============================================================
-- TASK RULES
-- ============================================================
-- FIN-016: OSAP — only for PR or Protected Person
INSERT INTO task_rules (task_code, rule_type, conditions, match_all) VALUES
  ('GBC-021', 'INCLUDE', '[{"field": "immigration_status", "operator": "in", "value": ["Permanent Resident", "Protected Person"]}]', true)
ON CONFLICT DO NOTHING;

-- Employment tasks — include when Jobs goal is selected
INSERT INTO task_rules (task_code, rule_type, conditions, match_all) VALUES
  ('EMP-001', 'BOOST', '[{"field": "goals", "operator": "contains", "value": "Jobs"}]', true),
  ('EMP-002', 'BOOST', '[{"field": "goals", "operator": "contains", "value": "Jobs"}]', true),
  ('EMP-003', 'BOOST', '[{"field": "goals", "operator": "contains", "value": "Jobs"}]', true),
  ('EMP-004', 'BOOST', '[{"field": "goals", "operator": "contains", "value": "Jobs"}]', true),
  ('EMP-005', 'BOOST', '[{"field": "goals", "operator": "contains", "value": "Jobs"}]', true),
  ('EMP-006', 'BOOST', '[{"field": "goals", "operator": "contains", "value": "Jobs"}]', true),
  ('EMP-007', 'BOOST', '[{"field": "goals", "operator": "contains", "value": "Jobs"}]', true),
  ('EMP-008', 'BOOST', '[{"field": "goals", "operator": "contains", "value": "Jobs"}]', true)
ON CONFLICT DO NOTHING;

-- Credit tasks — include when Credit goal is selected
INSERT INTO task_rules (task_code, rule_type, conditions, match_all) VALUES
  ('FM-011', 'BOOST', '[{"field": "goals", "operator": "contains", "value": "Credit"}]', true),
  ('SET-001', 'BOOST', '[{"field": "goals", "operator": "contains", "value": "Credit"}]', true)
ON CONFLICT DO NOTHING;

-- Tax tasks — include when Taxes goal is selected
INSERT INTO task_rules (task_code, rule_type, conditions, match_all) VALUES
  ('SCH-008', 'BOOST', '[{"field": "goals", "operator": "contains", "value": "Taxes"}]', true),
  ('SCH-009', 'BOOST', '[{"field": "goals", "operator": "contains", "value": "Taxes"}]', true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- TASK DEPENDENCIES (critical chains)
-- ============================================================
INSERT INTO task_dependencies (task_code, depends_on_task_code, dependency_type) VALUES
  -- SIN requires Study Permit
  ('FW-005', 'FW-001', 'HARD'),
  -- Bank account requires Phone
  ('FW-004', 'FW-002', 'SOFT'),
  -- OHIP requires Ontario address (permanent housing)
  ('FM-002', 'FM-001', 'SOFT'),
  -- Credit card requires Bank account
  ('FM-011', 'FW-004', 'HARD'),
  -- Employment work rights require SIN
  ('EMP-005', 'FW-005', 'HARD'),
  -- PGWP requires graduation confirmation
  ('GRAD-001', 'GRAD-002', 'HARD'),
  -- PR application after PGWP
  ('FUT-001', 'GRAD-001', 'SOFT'),
  -- Tax filing enables GST credit
  ('SCH-009', 'SCH-008', 'HARD')
ON CONFLICT DO NOTHING;

-- ============================================================
-- RESOURCE CATEGORIES
-- ============================================================
INSERT INTO resource_categories (id, name, icon, sort_order) VALUES
  ('33333333-0001-0001-0001-000000000001', 'Immigration & Status',   '🛂', 1),
  ('33333333-0001-0001-0001-000000000002', 'Banking & Finance',      '🏦', 2),
  ('33333333-0001-0001-0001-000000000003', 'Housing',                '🏠', 3),
  ('33333333-0001-0001-0001-000000000004', 'Healthcare',             '🏥', 4),
  ('33333333-0001-0001-0001-000000000005', 'Jobs & Employment',      '💼', 5),
  ('33333333-0001-0001-0001-000000000006', 'Taxes',                  '📋', 6),
  ('33333333-0001-0001-0001-000000000007', 'Transit & Transport',    '🚌', 7),
  ('33333333-0001-0001-0001-000000000008', 'Community & Support',    '🤝', 8)
ON CONFLICT DO NOTHING;

-- ============================================================
-- UNIVERSAL RESOURCES (available to all schools)
-- ============================================================
INSERT INTO resources (id, title, description, url, category_id, resource_type, is_free, tags) VALUES
  ('44444444-0001-0001-0001-000000000001',
   'IRCC — Study Permit Information',
   'Official Government of Canada information on study permits, conditions, and renewals.',
   'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html',
   '33333333-0001-0001-0001-000000000001', 'Government', true, ARRAY['immigration', 'study permit', 'IRCC']),

  ('44444444-0001-0001-0001-000000000002',
   'Service Canada — Apply for SIN Online',
   'Official portal to apply for your Social Insurance Number online.',
   'https://www.canada.ca/en/employment-social-development/services/sin/apply.html',
   '33333333-0001-0001-0001-000000000001', 'Government', true, ARRAY['SIN', 'social insurance', 'work']),

  ('44444444-0001-0001-0001-000000000003',
   'OHIP — Apply for Ontario Health Insurance',
   'ServiceOntario information on applying for OHIP coverage including eligibility and required documents.',
   'https://www.ontario.ca/page/apply-ohip-and-get-health-card',
   '33333333-0001-0001-0001-000000000004', 'Government', true, ARRAY['OHIP', 'health insurance', 'healthcare']),

  ('44444444-0001-0001-0001-000000000004',
   'Health Care Connect — Find a Doctor',
   'Ontario program to connect unattached patients with a family physician or nurse practitioner.',
   'https://www.ontario.ca/page/find-family-doctor-or-nurse-practitioner',
   '33333333-0001-0001-0001-000000000004', 'Government', true, ARRAY['doctor', 'family physician', 'healthcare']),

  ('44444444-0001-0001-0001-000000000005',
   'CRA — Filing Your First Tax Return',
   'Canada Revenue Agency guide for newcomers filing taxes in Canada for the first time.',
   'https://www.canada.ca/en/revenue-agency/services/tax/international-non-residents/individuals-leaving-entering-canada-non-residents/newcomers-canada-immigrants.html',
   '33333333-0001-0001-0001-000000000006', 'Government', true, ARRAY['taxes', 'CRA', 'T1', 'newcomer']),

  ('44444444-0001-0001-0001-000000000006',
   'PRESTO Card — Ontario Transit Payment',
   'Official PRESTO site to get your transit card, load funds, and set up auto-load.',
   'https://www.prestocard.ca',
   '33333333-0001-0001-0001-000000000007', 'Official', true, ARRAY['PRESTO', 'transit', 'TTC', 'Metrolinx']),

  ('44444444-0001-0001-0001-000000000007',
   '211 Ontario — Find Local Services',
   'Free, confidential service connecting Ontarians to community, social, and government services.',
   'https://211ontario.ca',
   '33333333-0001-0001-0001-000000000008', 'Community', true, ARRAY['support', 'community', 'settlement', 'services']),

  ('44444444-0001-0001-0001-000000000008',
   'Borrowell — Free Canadian Credit Score',
   'Free credit monitoring service for Canadians. Check your score weekly and get personalized financial product recommendations.',
   'https://borrowell.com',
   '33333333-0001-0001-0001-000000000002', 'Tool', true, ARRAY['credit score', 'credit history', 'banking']),

  ('44444444-0001-0001-0001-000000000009',
   'Ontario Residential Tenancies Act — Tenant Rights',
   'Plain-language guide to tenant rights in Ontario covering rent, repairs, eviction, and lease terms.',
   'https://www.ontario.ca/laws/statute/06r17',
   '33333333-0001-0001-0001-000000000003', 'Government', true, ARRAY['housing', 'tenant rights', 'rental', 'lease'])
ON CONFLICT DO NOTHING;

-- ============================================================
-- YORK UNIVERSITY SPECIFIC RESOURCES
-- ============================================================
INSERT INTO resources (id, title, description, url, category_id, resource_type, is_free, tags, school_id) VALUES
  ('44444444-0002-0001-0001-000000000001',
   'York CIE — International Student Support',
   'York''s Centre for International Experience provides immigration advising, cultural programs, and peer mentorship.',
   'https://cie.yorku.ca',
   '33333333-0001-0001-0001-000000000008', 'School', true, ARRAY['York', 'CIE', 'international', 'immigration'], '22222222-0001-0001-0001-000000000001'),

  ('44444444-0002-0001-0001-000000000002',
   'MyYorku — Student Portal',
   'York''s student portal for course registration, grades, financial account, and campus services.',
   'https://my.yorku.ca',
   '33333333-0001-0001-0001-000000000008', 'School', true, ARRAY['York', 'portal', 'registration', 'student'], '22222222-0001-0001-0001-000000000001'),

  ('44444444-0002-0001-0001-000000000003',
   'York Student Financial Profile — Bursaries',
   'Single application for all York bursaries, awards, and emergency funding.',
   'https://sfs.yorku.ca/bursaries/sfp',
   '33333333-0001-0001-0001-000000000002', 'School', true, ARRAY['York', 'bursary', 'financial aid', 'awards'], '22222222-0001-0001-0001-000000000001'),

  ('44444444-0002-0001-0001-000000000004',
   'York Counselling Services',
   'Free confidential counselling for York students. Supports mental health, academic, and personal concerns.',
   'https://counselling.students.yorku.ca',
   '33333333-0001-0001-0001-000000000004', 'School', true, ARRAY['York', 'mental health', 'counselling', 'wellbeing'], '22222222-0001-0001-0001-000000000001'),

  ('44444444-0002-0001-0001-000000000005',
   'York Career Centre',
   'Resume support, mock interviews, job fairs, and employer connections for York students.',
   'https://careers.yorku.ca',
   '33333333-0001-0001-0001-000000000005', 'School', true, ARRAY['York', 'career', 'jobs', 'resume'], '22222222-0001-0001-0001-000000000001'),

  ('44444444-0002-0001-0001-000000000006',
   'York Off-Campus Housing Board',
   'Verified off-campus housing listings curated for York students.',
   'https://www.yorku.ca/housing/off-campus/',
   '33333333-0001-0001-0001-000000000003', 'School', true, ARRAY['York', 'housing', 'off-campus', 'rental'], '22222222-0001-0001-0001-000000000001'),

  ('44444444-0002-0001-0001-000000000007',
   'York Writing Centre',
   'Free writing support for all York students: one-on-one appointments and drop-in sessions.',
   'https://www.yorku.ca/laps/writing-centre/',
   '33333333-0001-0001-0001-000000000008', 'School', true, ARRAY['York', 'writing', 'academic support', 'tutoring'], '22222222-0001-0001-0001-000000000001'),

  ('44444444-0002-0001-0001-000000000008',
   'York Student Accessibility Services',
   'Academic accommodations and disability support for York students.',
   'https://accessibility.students.yorku.ca',
   '33333333-0001-0001-0001-000000000008', 'School', true, ARRAY['York', 'accessibility', 'accommodations', 'disability'], '22222222-0001-0001-0001-000000000001')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SENECA POLYTECHNIC SPECIFIC RESOURCES
-- ============================================================
INSERT INTO resources (id, title, description, url, category_id, resource_type, is_free, tags, school_id) VALUES
  ('44444444-0003-0001-0001-000000000001',
   'Seneca International Student Centre',
   'Immigration advising, settlement support, and cultural programming for Seneca international students.',
   'https://www.senecapolytechnic.ca/students/international-student-services.html',
   '33333333-0001-0001-0001-000000000008', 'School', true, ARRAY['Seneca', 'international', 'immigration', 'settlement'], '22222222-0001-0001-0001-000000000002'),

  ('44444444-0003-0001-0001-000000000002',
   'MySeneca — Student Portal',
   'Seneca''s student portal for timetables, grades, financial aid, and academic services.',
   'https://my.senecapolytechnic.ca',
   '33333333-0001-0001-0001-000000000008', 'School', true, ARRAY['Seneca', 'portal', 'student', 'registration'], '22222222-0001-0001-0001-000000000002'),

  ('44444444-0003-0001-0001-000000000003',
   'Seneca Financial Aid and Awards',
   'Seneca bursaries, scholarships, and emergency funding for international students.',
   'https://www.senecapolytechnic.ca/about/departments/financial-aid.html',
   '33333333-0001-0001-0001-000000000002', 'School', true, ARRAY['Seneca', 'bursary', 'financial aid', 'awards'], '22222222-0001-0001-0001-000000000002'),

  ('44444444-0003-0001-0001-000000000004',
   'Seneca Co-op and Career Centre',
   'Co-op placements, career counselling, employer connections, and job search support.',
   'https://www.senecapolytechnic.ca/students/co-op-career-centre.html',
   '33333333-0001-0001-0001-000000000005', 'School', true, ARRAY['Seneca', 'co-op', 'career', 'jobs', 'placement'], '22222222-0001-0001-0001-000000000002'),

  ('44444444-0003-0001-0001-000000000005',
   'Seneca Academic Learning Services',
   'Free tutoring, writing help, and math support for all Seneca students.',
   'https://www.senecapolytechnic.ca/students/academic-learning-services.html',
   '33333333-0001-0001-0001-000000000008', 'School', true, ARRAY['Seneca', 'tutoring', 'writing', 'academic support'], '22222222-0001-0001-0001-000000000002'),

  ('44444444-0003-0001-0001-000000000006',
   'Seneca Counselling Services',
   'Mental health and personal counselling for Seneca students, available in-person and online.',
   'https://www.senecapolytechnic.ca/students/counselling.html',
   '33333333-0001-0001-0001-000000000004', 'School', true, ARRAY['Seneca', 'mental health', 'counselling', 'wellbeing'], '22222222-0001-0001-0001-000000000002'),

  ('44444444-0003-0001-0001-000000000007',
   'Seneca HELIX Entrepreneurship Hub',
   'Seneca''s innovation and entrepreneurship incubator for student ventures.',
   'https://www.senecapolytechnic.ca/helix',
   '33333333-0001-0001-0001-000000000005', 'School', true, ARRAY['Seneca', 'entrepreneurship', 'startup', 'HELIX', 'innovation'], '22222222-0001-0001-0001-000000000002')
ON CONFLICT DO NOTHING;

-- ============================================================
-- GEORGE BROWN COLLEGE SPECIFIC RESOURCES
-- ============================================================
INSERT INTO resources (id, title, description, url, category_id, resource_type, is_free, tags, school_id) VALUES
  ('44444444-0004-0001-0001-000000000001',
   'GBC International Student Support',
   'George Brown''s international student centre for immigration advising, settlement, and peer support.',
   'https://www.georgebrown.ca/international-students',
   '33333333-0001-0001-0001-000000000008', 'School', true, ARRAY['GBC', 'international', 'immigration', 'settlement'], '22222222-0001-0001-0001-000000000003'),

  ('44444444-0004-0001-0001-000000000002',
   'STU-VIEW — GBC Student Portal',
   'George Brown''s student portal for course registration, grades, and student account management.',
   'https://stuview.georgebrown.ca',
   '33333333-0001-0001-0001-000000000008', 'School', true, ARRAY['GBC', 'portal', 'STU-VIEW', 'registration'], '22222222-0001-0001-0001-000000000003'),

  ('44444444-0004-0001-0001-000000000003',
   'GBC Financial Aid Office',
   'Bursaries, scholarships, emergency funding, and financial assistance for GBC students.',
   'https://www.georgebrown.ca/current-students/services/financial-assistance',
   '33333333-0001-0001-0001-000000000002', 'School', true, ARRAY['GBC', 'bursary', 'financial aid', 'OSAP', 'awards'], '22222222-0001-0001-0001-000000000003'),

  ('44444444-0004-0001-0001-000000000004',
   'GBC Career Services',
   'Resume workshops, mock interviews, job fairs, and employer network access for GBC students.',
   'https://www.georgebrown.ca/current-students/services/career-centre',
   '33333333-0001-0001-0001-000000000005', 'School', true, ARRAY['GBC', 'career', 'jobs', 'resume', 'interview'], '22222222-0001-0001-0001-000000000003'),

  ('44444444-0004-0001-0001-000000000005',
   'GBC Counselling and Student Wellbeing',
   'Free confidential counselling for GBC students including mental health and personal support.',
   'https://www.georgebrown.ca/current-students/services/counselling-centre',
   '33333333-0001-0001-0001-000000000004', 'School', true, ARRAY['GBC', 'mental health', 'counselling', 'wellbeing'], '22222222-0001-0001-0001-000000000003'),

  ('44444444-0004-0001-0001-000000000006',
   'GBC Work Integrated Learning Portal',
   'Field placement and work-integrated learning opportunities and employer connections.',
   'https://www.georgebrown.ca/programs/work-integrated-learning',
   '33333333-0001-0001-0001-000000000005', 'School', true, ARRAY['GBC', 'field placement', 'WIL', 'work experience'], '22222222-0001-0001-0001-000000000003')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SCHOOL RESOURCE COLLECTIONS
-- ============================================================
INSERT INTO school_resource_collections (id, school_id, title, description, sort_order) VALUES
  ('55555555-0001-0001-0001-000000000001', '22222222-0001-0001-0001-000000000001', 'York University Resources', 'Essential links for York international students', 1),
  ('55555555-0001-0001-0001-000000000002', '22222222-0001-0001-0001-000000000002', 'Seneca Polytechnic Resources', 'Essential links for Seneca international students', 1),
  ('55555555-0001-0001-0001-000000000003', '22222222-0001-0001-0001-000000000003', 'George Brown College Resources', 'Essential links for GBC international students', 1)
ON CONFLICT DO NOTHING;

-- Link York resources to York collection
INSERT INTO school_resource_collection_items (collection_id, resource_id, sort_order) VALUES
  ('55555555-0001-0001-0001-000000000001', '44444444-0002-0001-0001-000000000001', 1),
  ('55555555-0001-0001-0001-000000000001', '44444444-0002-0001-0001-000000000002', 2),
  ('55555555-0001-0001-0001-000000000001', '44444444-0002-0001-0001-000000000003', 3),
  ('55555555-0001-0001-0001-000000000001', '44444444-0002-0001-0001-000000000004', 4),
  ('55555555-0001-0001-0001-000000000001', '44444444-0002-0001-0001-000000000005', 5)
ON CONFLICT DO NOTHING;

-- Link Seneca resources to Seneca collection
INSERT INTO school_resource_collection_items (collection_id, resource_id, sort_order) VALUES
  ('55555555-0001-0001-0001-000000000002', '44444444-0003-0001-0001-000000000001', 1),
  ('55555555-0001-0001-0001-000000000002', '44444444-0003-0001-0001-000000000002', 2),
  ('55555555-0001-0001-0001-000000000002', '44444444-0003-0001-0001-000000000003', 3),
  ('55555555-0001-0001-0001-000000000002', '44444444-0003-0001-0001-000000000004', 4),
  ('55555555-0001-0001-0001-000000000002', '44444444-0003-0001-0001-000000000005', 5)
ON CONFLICT DO NOTHING;

-- Link GBC resources to GBC collection
INSERT INTO school_resource_collection_items (collection_id, resource_id, sort_order) VALUES
  ('55555555-0001-0001-0001-000000000003', '44444444-0004-0001-0001-000000000001', 1),
  ('55555555-0001-0001-0001-000000000003', '44444444-0004-0001-0001-000000000002', 2),
  ('55555555-0001-0001-0001-000000000003', '44444444-0004-0001-0001-000000000003', 3),
  ('55555555-0001-0001-0001-000000000003', '44444444-0004-0001-0001-000000000004', 4),
  ('55555555-0001-0001-0001-000000000003', '44444444-0004-0001-0001-000000000005', 5)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SAMPLE DEADLINES (template — user-specific deadlines are
-- generated by the roadmap API based on user profile dates)
-- ============================================================
-- These are reference deadline templates
INSERT INTO deadline_templates (task_code, deadline_type, days_before_trigger, title, description) VALUES
  ('SCH-010', 'STUDY_PERMIT_EXPIRY', 180, 'Start study permit renewal',
   'Apply 3–6 months before your permit expires to avoid gaps in status.'),
  ('FW-002', 'ARRIVAL_DATE', 0, 'Get phone SIM card',
   'Do this on or within 24 hours of arriving in Canada.'),
  ('FW-004', 'ARRIVAL_DATE', 3, 'Open Canadian bank account',
   'Aim to open your account within your first week.'),
  ('FM-002', 'ARRIVAL_DATE', 7, 'Apply for OHIP',
   'Apply as soon as you have your Ontario address. Coverage starts 3 months after application.'),
  ('GRAD-001', 'GRADUATION_DATE', -30, 'Apply for PGWP',
   'Apply within 180 days of your official program completion notice.')
ON CONFLICT DO NOTHING;
