-- Drop login_audit_logs table
-- This table is redundant as user_audit_logs already captures all authentication events with more detail

DROP TABLE IF EXISTS login_audit_logs;
