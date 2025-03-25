-- Update match status to ensure it's properly recognized as completed
UPDATE public."Match"
SET status = 'FINALIZED'
WHERE id = 'd0b585dd-09e4-4171-b133-2f5376bcc59a';

-- Verify the update
SELECT id, homeTeamId, awayTeamId, status
FROM public."Match"
WHERE id = 'd0b585dd-09e4-4171-b133-2f5376bcc59a';
