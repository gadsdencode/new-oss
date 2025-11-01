-- Verification script to check if contact_submissions table exists and is properly configured
-- Run this in your Neon SQL Editor to verify the table structure

-- Check if table exists
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_name = 'contact_submissions'
ORDER BY 
    ordinal_position;

-- Check table constraints
SELECT 
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS constraint_definition
FROM 
    pg_constraint
WHERE 
    conrelid = 'contact_submissions'::regclass;

-- Test INSERT (will be rolled back)
BEGIN;
INSERT INTO contact_submissions (
    name,
    email,
    company,
    phone,
    subject,
    message
) VALUES (
    'Test User',
    'test@example.com',
    NULL,
    NULL,
    'Test Subject',
    'This is a test message'
);
ROLLBACK;

-- If the above works without errors, your schema is correctly configured!

