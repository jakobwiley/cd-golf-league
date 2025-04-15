-- Insert teams first
INSERT INTO "Team" (id, name, "createdAt", "updatedAt")
VALUES 
  ('hot-huerter', 'Hot Huerter', NOW(), NOW()),
  ('nick-brent', 'Nick & Brent', NOW(), NOW()),
  ('ashley-alli', 'Ashley & Alli', NOW(), NOW()),
  ('brett-tony', 'Brett & Tony', NOW(), NOW()),
  ('brew-jake', 'Brew & Jake', NOW(), NOW()),
  ('clauss-wade', 'Clauss & Wade', NOW(), NOW()),
  ('sketch-rob', 'Sketch & Rob', NOW(), NOW()),
  ('ap-johnp', 'AP & JohnP', NOW(), NOW()),
  ('trev-murph', 'Trev & Murph', NOW(), NOW()),
  ('ryan-drew', 'Ryan & Drew', NOW(), NOW())
ON CONFLICT (id) DO NOTHING; 