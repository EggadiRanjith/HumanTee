-- Login Audit Logs Table
-- Tracks ALL login/logout events for both users and admins
-- Separated for performance (high-frequency events)

CREATE TABLE IF NOT EXISTS login_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL, -- 'USER' or 'ADMIN'
    event_type VARCHAR(50) NOT NULL, -- 'LOGIN', 'LOGOUT', 'TOKEN_REFRESH'
    login_method VARCHAR(50), -- 'OTP', 'Google', etc.
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    success BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_login_audit_logs_user_id ON login_audit_logs(user_id);
CREATE INDEX idx_login_audit_logs_user_type ON login_audit_logs(user_type);
CREATE INDEX idx_login_audit_logs_event_type ON login_audit_logs(event_type);
CREATE INDEX idx_login_audit_logs_created_at ON login_audit_logs(created_at DESC);
CREATE INDEX idx_login_audit_logs_user_email ON login_audit_logs(user_email);

-- Comment
COMMENT ON TABLE login_audit_logs IS 'High-frequency login/logout audit trail for both users and admins';
