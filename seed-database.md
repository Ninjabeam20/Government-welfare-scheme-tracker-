# Seed Script — welfare_system

> **Instructions:** Run the following SQL in MySQL Workbench or terminal **after** you have already created the database using `DB_SCHEMA.md`. This script clears existing data and repopulates all tables with realistic sample data.

```sql
USE welfare_system;

-- ============================================================
-- CLEAR EXISTING DATA (order matters due to foreign keys)
-- ============================================================
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE auditlogs;
TRUNCATE TABLE currentapplications;
TRUNCATE TABLE welfareschemes;
TRUNCATE TABLE individualbeneficiaries;
TRUNCATE TABLE officers;
TRUNCATE TABLE admins;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 1. ADMINS
-- ============================================================
INSERT INTO admins (Name, Email, Password) VALUES
  ('System Admin',     'admin@govt.in',                   'password123'),
  ('Rajesh Kumar',     'rajesh.admin@govt.in',            'password123'),
  ('Priya Verma',      'priya.admin@govt.in',             'password123'),
  ('Sanskar Tarte',    'sanskartarte080307@gmail.com',     'password123');

-- ============================================================
-- 2. OFFICERS (across various departments)
-- ============================================================
INSERT INTO officers (Name, Email, Department, Status) VALUES
  ('Aarti Sharma',       'aarti@govt.in',                   'Healthcare',       'Active'),
  ('Vikram Singh',       'vikram@govt.in',                  'Education',        'Active'),
  ('Deepa Nair',         'deepa@govt.in',                   'Agriculture',      'Active'),
  ('Suresh Patil',       'suresh@govt.in',                  'Housing',          'Suspended'),
  ('Meena Kumari',       'meena@govt.in',                   'Social Welfare',   'Active'),
  ('Arjun Reddy',        'arjun@govt.in',                   'Healthcare',       'Active'),
  ('Kavitha Iyer',       'kavitha@govt.in',                 'Education',        'Suspended'),
  ('Ramesh Gupta',       'ramesh@govt.in',                  'Rural Development','Active'),
  ('Sunita Devi',        'sunita@govt.in',                  'Women & Child',    'Active'),
  ('Amit Joshi',         'amit@govt.in',                    'Labour',           'Active'),
  ('Sanskar Tarte',      'sanskartarteoneplus@gmail.com',   'Housing',          'Active');

-- ============================================================
-- 3. INDIVIDUAL BENEFICIARIES (citizens)
-- ============================================================
INSERT INTO individualbeneficiaries (Name, Email, Aadhaar, Income, Category) VALUES
  ('Ravi Shankar',       'ravi.shankar@gmail.com',      '100000000001',  25000.00,  'SC'),
  ('Anita Desai',        'anita.desai@gmail.com',       '100000000002',  38000.00,  'General'),
  ('Mohammed Irfan',     'irfan.m@gmail.com',           '100000000003',  15000.00,  'OBC'),
  ('Lakshmi Bai',        'lakshmi.bai@gmail.com',       '100000000004',  12000.00,  'ST'),
  ('Sanjay Mehta',       'sanjay.mehta@gmail.com',      '100000000005',  55000.00,  'General'),
  ('Pooja Yadav',        'pooja.yadav@gmail.com',       '100000000006',  22000.00,  'OBC'),
  ('Karthik Naidu',      'karthik.n@gmail.com',         '100000000007',  48000.00,  'General'),
  ('Fatima Begum',       'fatima.b@gmail.com',          '100000000008',  18000.00,  'General'),
  ('Sunil Kumar',        'sunil.k@gmail.com',           '100000000009',  30000.00,  'SC'),
  ('Geeta Devi',         'geeta.devi@gmail.com',        '100000000010',  9000.00,   'ST'),
  ('Rahul Verma',        'rahul.verma@gmail.com',       '100000000011',  42000.00,  'General'),
  ('Priyanka Das',       'priyanka.das@gmail.com',      '100000000012',  20000.00,  'SC'),
  ('Arun Prasad',        'arun.prasad@gmail.com',       '100000000013',  75000.00,  'General'),
  ('Nisha Gupta',        'nisha.gupta@gmail.com',       '100000000014',  28000.00,  'OBC'),
  ('Dinesh Chand',       'dinesh.chand@gmail.com',      '100000000015',  35000.00,  'General'),
  ('Kamala Rani',        'kamala.rani@gmail.com',       '100000000016',  11000.00,  'ST'),
  ('Vijay Prakash',      'vijay.p@gmail.com',           '100000000017',  60000.00,  'General'),
  ('Sarita Kumari',      'sarita.k@gmail.com',          '100000000018',  16000.00,  'OBC'),
  ('Manoj Tiwari',       'manoj.t@gmail.com',           '100000000019',  45000.00,  'General'),
  ('Rekha Sharma',       'rekha.sharma@gmail.com',      '100000000020',  8000.00,   'SC'),
  ('Sanskar Tarte',      'sanskarsanskar055@gmail.com', '100000000021',  10000.00,  'General');

-- ============================================================
-- 4. WELFARE SCHEMES
-- ============================================================
INSERT INTO welfareschemes (SchemeName, Description, isactive, max_income) VALUES
  ('National Health Grant',
   'Financial assistance up to ₹50,000 for medical treatment including surgeries, hospitalisation, and critical illness coverage for economically weaker citizens.',
   1, 50000),

  ('Education Scholarship',
   'Merit-cum-means scholarship of ₹1,00,000 per annum for higher education (graduation and post-graduation) at recognised institutions.',
   1, 100000),

  ('PM Kisan Samman Nidhi',
   'Direct income support of ₹6,000 per year in three equal instalments to small and marginal farming families.',
   1, 200000),

  ('Indira Awaas Yojana',
   'Housing subsidy of up to ₹1,20,000 for construction of pucca houses for BPL families in rural areas.',
   1, 30000),

  ('Skill India Training',
   'Free vocational training and certification in 40+ trades with placement assistance for unemployed youth aged 18-35.',
   1, 80000),

  ('Maternity Benefit Scheme',
   'Cash incentive of ₹5,000 in three instalments for pregnant women and lactating mothers to ensure nutritional intake and institutional delivery.',
   1, 60000),

  ('SC/ST Scholarship Fund',
   'Full tuition fee waiver and monthly stipend for students from Scheduled Castes and Scheduled Tribes pursuing professional courses.',
   1, 250000),

  ('Disability Pension',
   'Monthly pension of ₹2,500 for persons with 40% or more disability as certified by a government medical board.',
   1, 40000),

  ('Rural Employment Guarantee',
   'Guaranteed 100 days of wage employment per year to rural households whose adult members volunteer to do unskilled manual work.',
   1, 150000),

  ('Senior Citizen Pension',
   'Monthly pension of ₹3,000 for citizens above 60 years belonging to BPL households with no other source of regular income.',
   1, 35000),

  ('Women Entrepreneur Loan',
   'Collateral-free loan up to ₹10,00,000 at subsidised interest rate of 4% for women starting or expanding micro-enterprises.',
   0, 300000),

  ('Clean Energy Subsidy',
   'Subsidy on solar panels and biogas plants for rural households to promote clean energy adoption and reduce carbon footprint.',
   0, 120000);

-- ============================================================
-- 5. CURRENT APPLICATIONS (mix of statuses)
-- ============================================================
INSERT INTO currentapplications (BeneficiaryID, SchemeID, OfficerID, Applied_on, Status) VALUES
  -- Approved applications
  (1,  1,  1,  '2025-11-10 09:30:00', 'Approved'),
  (4,  4,  4,  '2025-11-15 11:00:00', 'Approved'),
  (10, 8,  5,  '2025-12-01 14:20:00', 'Approved'),
  (6,  6,  9,  '2025-12-05 10:45:00', 'Approved'),
  (9,  7,  5,  '2025-12-10 16:30:00', 'Approved'),
  (12, 1,  6,  '2026-01-05 09:15:00', 'Approved'),

  -- Rejected applications
  (5,  1,  1,  '2025-11-20 13:15:00', 'Rejected'),
  (13, 2,  2,  '2025-12-18 11:00:00', 'Rejected'),
  (17, 3,  3,  '2026-01-12 10:30:00', 'Rejected'),

  -- Under Review
  (3,  3,  3,  '2026-01-20 08:45:00', 'Under Review'),
  (8,  5,  10, '2026-02-01 10:00:00', 'Under Review'),
  (14, 9,  8,  '2026-02-10 15:30:00', 'Under Review'),
  (16, 10, 5,  '2026-02-15 09:00:00', 'Under Review'),
  (2,  2,  2,  '2026-02-20 12:00:00', 'Under Review'),

  -- Pending applications (recent, not yet picked up)
  (7,  5,  NULL, '2026-03-01 11:30:00', 'Pending'),
  (11, 2,  NULL, '2026-03-05 14:00:00', 'Pending'),
  (15, 9,  NULL, '2026-03-08 09:45:00', 'Pending'),
  (18, 6,  NULL, '2026-03-10 16:15:00', 'Pending'),
  (19, 1,  NULL, '2026-03-12 10:20:00', 'Pending'),
  (20, 10, NULL, '2026-03-14 08:30:00', 'Pending'),
  (1,  5,  NULL, '2026-03-15 13:00:00', 'Pending'),
  (4,  7,  NULL, '2026-03-16 11:45:00', 'Pending'),
  (3,  6,  NULL, '2026-03-18 09:00:00', 'Pending'),
  (10, 9,  NULL, '2026-03-19 14:30:00', 'Pending');

-- ============================================================
-- 6. AUDIT LOGS (sample activity trail)
-- ============================================================
INSERT INTO auditlogs (ActorType, ActionDetails, ActionTime) VALUES
  ('Admin',   'Admin "System Admin" created scheme "National Health Grant".',               '2025-10-01 10:00:00'),
  ('Admin',   'Admin "System Admin" created scheme "Education Scholarship".',               '2025-10-01 10:05:00'),
  ('Admin',   'Admin "System Admin" created scheme "PM Kisan Samman Nidhi".',               '2025-10-01 10:10:00'),
  ('Admin',   'Admin "System Admin" created scheme "Indira Awaas Yojana".',                 '2025-10-01 10:15:00'),
  ('Admin',   'Admin "Rajesh Kumar" created scheme "Skill India Training".',                '2025-10-05 11:00:00'),
  ('Admin',   'Admin "Rajesh Kumar" created scheme "Maternity Benefit Scheme".',            '2025-10-05 11:05:00'),
  ('Admin',   'Admin "Priya Verma" created scheme "SC/ST Scholarship Fund".',               '2025-10-10 09:00:00'),
  ('Admin',   'Admin "Priya Verma" created scheme "Disability Pension".',                   '2025-10-10 09:05:00'),
  ('Admin',   'Admin "System Admin" added officer "Aarti Sharma" to Healthcare.',           '2025-10-15 08:30:00'),
  ('Admin',   'Admin "System Admin" added officer "Vikram Singh" to Education.',            '2025-10-15 08:35:00'),
  ('Admin',   'Admin "System Admin" added officer "Deepa Nair" to Agriculture.',            '2025-10-15 08:40:00'),
  ('Admin',   'Admin "System Admin" suspended officer "Kavitha Iyer".',                     '2026-01-20 14:00:00'),
  ('Admin',   'Admin "Sanskar Tarte" suspended officer "Suresh Patil".',                   '2026-02-05 10:00:00'),
  ('Admin',   'Admin "Sanskar Tarte" added officer "Sanskar Tarte" to Housing.',           '2026-02-06 09:00:00'),
  ('Citizen', 'Citizen "Ravi Shankar" applied for "National Health Grant".',                '2025-11-10 09:30:00'),
  ('Citizen', 'Citizen "Lakshmi Bai" applied for "Indira Awaas Yojana".',                  '2025-11-15 11:00:00'),
  ('Officer', 'Officer "Aarti Sharma" approved application #1 for "National Health Grant".','2025-11-25 10:00:00'),
  ('Officer', 'Officer "Aarti Sharma" rejected application #7 for "National Health Grant".','2025-12-05 15:30:00'),
  ('Officer', 'Officer "Suresh Patil" approved application #2 for "Indira Awaas Yojana".', '2025-12-01 09:00:00'),
  ('Citizen', 'Citizen "Geeta Devi" applied for "Disability Pension".',                    '2025-12-01 14:20:00'),
  ('Officer', 'Officer "Meena Kumari" approved application #3 for "Disability Pension".',  '2025-12-15 11:30:00'),
  ('Citizen', 'Citizen "Sanjay Mehta" applied for "National Health Grant" (income exceeds limit).', '2025-11-20 13:15:00'),
  ('Citizen', 'Citizen "Karthik Naidu" applied for "Skill India Training".',               '2026-03-01 11:30:00'),
  ('Citizen', 'Citizen "Rahul Verma" applied for "Education Scholarship".',                '2026-03-05 14:00:00'),
  ('Citizen', 'Citizen "Manoj Tiwari" applied for "National Health Grant".',               '2026-03-12 10:20:00'),
  ('Citizen', 'Citizen "Rekha Sharma" applied for "Senior Citizen Pension".',              '2026-03-14 08:30:00'),
  ('Admin',   'Admin "Priya Verma" deactivated scheme "Women Entrepreneur Loan".',         '2026-02-28 16:00:00');
```

## Data Summary

| Table | Rows | Notes |
|---|---|---|
| `admins` | 4 | System Admin + 2 named admins + Sanskar Tarte |
| `officers` | 11 | 9 Active, 2 Suspended across 8 departments |
| `individualbeneficiaries` | 21 | Income range ₹8,000 – ₹75,000; categories: General, SC, ST, OBC |
| `welfareschemes` | 12 | 10 active, 2 inactive; income ceilings ₹30k – ₹3L |
| `currentapplications` | 24 | 6 Approved, 3 Rejected, 5 Under Review, 10 Pending |
| `auditlogs` | 27 | Admin, Officer, and Citizen actions |

## Things You Can Test After Seeding

- **Officer queue:** Officers 1–6, 8–10 have assigned applications to review.
- **Pending queue:** 10 applications with `OfficerID = NULL` waiting to be picked up.
- **Eligibility edge case:** Beneficiary #5 (Sanjay Mehta, income ₹55,000) was rejected for National Health Grant (max ₹50,000).
- **Inactive schemes:** "Women Entrepreneur Loan" and "Clean Energy Subsidy" should not appear for citizen applications.
- **Suspended officers:** Kavitha Iyer (OfficerID 7) and Suresh Patil (OfficerID 4) are suspended and should not be assignable.
- **Multiple applications:** Beneficiaries #1, #3, #4, and #10 have applied for more than one scheme.
- **Sanskar Tarte:** Present as Admin (ID 4), Officer (ID 11, Housing), and Beneficiary (ID 21) — useful for cross-role testing.
