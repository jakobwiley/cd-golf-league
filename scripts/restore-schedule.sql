-- Restore match schedule
-- Run this in the Supabase SQL editor

-- Insert matches for each week
INSERT INTO "Match" (id, date, "weekNumber", "homeTeamId", "awayTeamId", "startingHole", status, "createdAt", "updatedAt")
VALUES 
  -- Week 1 - April 15, 2024
  (gen_random_uuid(), '2024-04-15T18:00:00Z', 1, 'hot-huerter', 'nick-brent', 1, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-04-15T18:00:00Z', 1, 'ashley-alli', 'brett-tony', 2, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-04-15T18:00:00Z', 1, 'brew-jake', 'clauss-wade', 3, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-04-15T18:00:00Z', 1, 'sketch-rob', 'ap-johnp', 4, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-04-15T18:00:00Z', 1, 'trev-murph', 'ryan-drew', 5, 'SCHEDULED', NOW(), NOW()),

  -- Week 2 - April 22, 2024
  (gen_random_uuid(), '2024-04-22T18:00:00Z', 2, 'brett-tony', 'brew-jake', 1, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-04-22T18:00:00Z', 2, 'nick-brent', 'ryan-drew', 2, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-04-22T18:00:00Z', 2, 'ap-johnp', 'trev-murph', 3, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-04-22T18:00:00Z', 2, 'clauss-wade', 'sketch-rob', 4, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-04-22T18:00:00Z', 2, 'hot-huerter', 'ashley-alli', 5, 'SCHEDULED', NOW(), NOW()),

  -- Week 3 - April 29, 2024
  (gen_random_uuid(), '2024-04-29T18:00:00Z', 3, 'ryan-drew', 'trev-murph', 1, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-04-29T18:00:00Z', 3, 'clauss-wade', 'brett-tony', 2, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-04-29T18:00:00Z', 3, 'sketch-rob', 'hot-huerter', 3, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-04-29T18:00:00Z', 3, 'brew-jake', 'nick-brent', 4, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-04-29T18:00:00Z', 3, 'ashley-alli', 'ap-johnp', 5, 'SCHEDULED', NOW(), NOW()),

  -- Week 4 - May 6, 2024
  (gen_random_uuid(), '2024-05-06T18:00:00Z', 4, 'nick-brent', 'ap-johnp', 1, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-05-06T18:00:00Z', 4, 'hot-huerter', 'sketch-rob', 2, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-05-06T18:00:00Z', 4, 'ashley-alli', 'brew-jake', 3, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-05-06T18:00:00Z', 4, 'brett-tony', 'trev-murph', 4, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-05-06T18:00:00Z', 4, 'clauss-wade', 'ryan-drew', 5, 'SCHEDULED', NOW(), NOW()),

  -- Week 5 - May 13, 2024
  (gen_random_uuid(), '2024-05-13T18:00:00Z', 5, 'sketch-rob', 'ashley-alli', 1, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-05-13T18:00:00Z', 5, 'brew-jake', 'nick-brent', 2, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-05-13T18:00:00Z', 5, 'ryan-drew', 'brett-tony', 3, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-05-13T18:00:00Z', 5, 'ap-johnp', 'clauss-wade', 4, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-05-13T18:00:00Z', 5, 'trev-murph', 'hot-huerter', 5, 'SCHEDULED', NOW(), NOW()),

  -- Week 6 - May 20, 2024
  (gen_random_uuid(), '2024-05-20T18:00:00Z', 6, 'nick-brent', 'clauss-wade', 1, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-05-20T18:00:00Z', 6, 'brett-tony', 'ap-johnp', 2, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-05-20T18:00:00Z', 6, 'hot-huerter', 'ryan-drew', 3, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-05-20T18:00:00Z', 6, 'ashley-alli', 'trev-murph', 4, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-05-20T18:00:00Z', 6, 'brew-jake', 'sketch-rob', 5, 'SCHEDULED', NOW(), NOW()),

  -- Week 7 - May 27, 2024
  (gen_random_uuid(), '2024-05-27T18:00:00Z', 7, 'ryan-drew', 'ashley-alli', 1, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-05-27T18:00:00Z', 7, 'trev-murph', 'brew-jake', 2, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-05-27T18:00:00Z', 7, 'sketch-rob', 'nick-brent', 3, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-05-27T18:00:00Z', 7, 'ap-johnp', 'hot-huerter', 4, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-05-27T18:00:00Z', 7, 'clauss-wade', 'brett-tony', 5, 'SCHEDULED', NOW(), NOW()),

  -- Week 8 - June 3, 2024
  (gen_random_uuid(), '2024-06-03T18:00:00Z', 8, 'sketch-rob', 'ashley-alli', 1, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-06-03T18:00:00Z', 8, 'trev-murph', 'ap-johnp', 2, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-06-03T18:00:00Z', 8, 'hot-huerter', 'clauss-wade', 3, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-06-03T18:00:00Z', 8, 'nick-brent', 'brett-tony', 4, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-06-03T18:00:00Z', 8, 'brew-jake', 'ryan-drew', 5, 'SCHEDULED', NOW(), NOW()),

  -- Week 9 - June 10, 2024
  (gen_random_uuid(), '2024-06-10T18:00:00Z', 9, 'clauss-wade', 'ashley-alli', 1, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-06-10T18:00:00Z', 9, 'brett-tony', 'hot-huerter', 2, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-06-10T18:00:00Z', 9, 'trev-murph', 'nick-brent', 3, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-06-10T18:00:00Z', 9, 'ryan-drew', 'sketch-rob', 4, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-06-10T18:00:00Z', 9, 'ap-johnp', 'brew-jake', 5, 'SCHEDULED', NOW(), NOW()),

  -- Week 11 - June 24, 2024
  (gen_random_uuid(), '2024-06-24T18:00:00Z', 11, 'brett-tony', 'trev-murph', 1, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-06-24T18:00:00Z', 11, 'ryan-drew', 'clauss-wade', 2, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-06-24T18:00:00Z', 11, 'ap-johnp', 'hot-huerter', 3, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-06-24T18:00:00Z', 11, 'ashley-alli', 'brew-jake', 4, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-06-24T18:00:00Z', 11, 'nick-brent', 'sketch-rob', 5, 'SCHEDULED', NOW(), NOW()),

  -- Week 12 - July 1, 2024
  (gen_random_uuid(), '2024-07-01T18:00:00Z', 12, 'hot-huerter', 'trev-murph', 1, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-07-01T18:00:00Z', 12, 'sketch-rob', 'clauss-wade', 2, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-07-01T18:00:00Z', 12, 'ashley-alli', 'ryan-drew', 3, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-07-01T18:00:00Z', 12, 'nick-brent', 'hot-huerter', 4, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-07-01T18:00:00Z', 12, 'ap-johnp', 'brett-tony', 5, 'SCHEDULED', NOW(), NOW()),

  -- Week 13 - July 8, 2024
  (gen_random_uuid(), '2024-07-08T18:00:00Z', 13, 'trev-murph', 'clauss-wade', 1, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-07-08T18:00:00Z', 13, 'ap-johnp', 'ashley-alli', 2, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-07-08T18:00:00Z', 13, 'nick-brent', 'brew-jake', 3, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-07-08T18:00:00Z', 13, 'ryan-drew', 'hot-huerter', 4, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-07-08T18:00:00Z', 13, 'sketch-rob', 'brett-tony', 5, 'SCHEDULED', NOW(), NOW()),

  -- Week 14 - July 15, 2024
  (gen_random_uuid(), '2024-07-15T18:00:00Z', 14, 'hot-huerter', 'sketch-rob', 1, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-07-15T18:00:00Z', 14, 'nick-brent', 'clauss-wade', 2, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-07-15T18:00:00Z', 14, 'ashley-alli', 'ryan-drew', 3, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-07-15T18:00:00Z', 14, 'brew-jake', 'brett-tony', 4, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-07-15T18:00:00Z', 14, 'trev-murph', 'ap-johnp', 5, 'SCHEDULED', NOW(), NOW()); 