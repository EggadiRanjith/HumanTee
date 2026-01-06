-- User Audit Logs Table
-- Tracks customer activities for security, compliance, and support

CREATE TABLE IF NOT EXISTS user_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(255),
    entity_name VARCHAR(255),
    before JSONB,
    after JSONB,
    changes JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_user_audit_logs_user_id ON user_audit_logs(user_id);
CREATE INDEX idx_user_audit_logs_event_type ON user_audit_logs(event_type);
CREATE INDEX idx_user_audit_logs_created_at ON user_audit_logs(created_at DESC);
CREATE INDEX idx_user_audit_logs_entity ON user_audit_logs(entity_type, entity_id);

-- Comment
COMMENT ON TABLE user_audit_logs IS 'Audit trail for customer activities (login, orders, payments, profile changes)';
