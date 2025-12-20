import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * CRITICAL: RBAC System
 * Adds role-based access control to prevent god-mode admin
 */
export class AddAdminRoles1734676100000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create admin_role enum
        await queryRunner.query(`
            CREATE TYPE "admin_role" AS ENUM ('OWNER', 'MANAGER', 'SUPPORT', 'VIEWER')
        `);

        // Add admin_role column to users table
        await queryRunner.query(`
            ALTER TABLE users
            ADD COLUMN admin_role admin_role DEFAULT 'VIEWER'
        `);

        // Update existing admin users to OWNER
        await queryRunner.query(`
            UPDATE users
            SET admin_role = 'OWNER'
            WHERE is_admin = true
        `);

        // Create admin_permissions table
        await queryRunner.query(`
            CREATE TABLE admin_permissions (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                role admin_role NOT NULL,
                resource VARCHAR(50) NOT NULL,
                action VARCHAR(50) NOT NULL,
                allowed BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(role, resource, action)
            )
        `);

        // Insert default permissions
        await this.insertDefaultPermissions(queryRunner);
    }

    private async insertDefaultPermissions(queryRunner: QueryRunner): Promise<void> {
        // OWNER permissions (full access)
        const ownerPermissions = [
            // Products
            "('OWNER', 'products', 'create')",
            "('OWNER', 'products', 'read')",
            "('OWNER', 'products', 'update')",
            "('OWNER', 'products', 'delete')",
            "('OWNER', 'products', 'publish')",
            // Orders
            "('OWNER', 'orders', 'read')",
            "('OWNER', 'orders', 'update')",
            "('OWNER', 'orders', 'cancel')",
            "('OWNER', 'orders', 'refund')",
            // Customers
            "('OWNER', 'customers', 'read')",
            "('OWNER', 'customers', 'update')",
            "('OWNER', 'customers', 'delete')",
            // Settings
            "('OWNER', 'settings', 'read')",
            "('OWNER', 'settings', 'update')",
            // Analytics
            "('OWNER', 'analytics', 'read')",
            // Audit Logs
            "('OWNER', 'audit_logs', 'read')",
            // Admin Management
            "('OWNER', 'admin', 'create')",
            "('OWNER', 'admin', 'read')",
            "('OWNER', 'admin', 'update')",
            "('OWNER', 'admin', 'delete')",
        ];

        // MANAGER permissions (products + orders, no settings/admin)
        const managerPermissions = [
            "('MANAGER', 'products', 'create')",
            "('MANAGER', 'products', 'read')",
            "('MANAGER', 'products', 'update')",
            "('MANAGER', 'products', 'publish')",
            "('MANAGER', 'orders', 'read')",
            "('MANAGER', 'orders', 'update')",
            "('MANAGER', 'customers', 'read')",
            "('MANAGER', 'analytics', 'read')",
        ];

        // SUPPORT permissions (orders + customers, read-only products)
        const supportPermissions = [
            "('SUPPORT', 'products', 'read')",
            "('SUPPORT', 'orders', 'read')",
            "('SUPPORT', 'orders', 'update')",
            "('SUPPORT', 'customers', 'read')",
        ];

        // VIEWER permissions (read-only)
        const viewerPermissions = [
            "('VIEWER', 'products', 'read')",
            "('VIEWER', 'orders', 'read')",
            "('VIEWER', 'customers', 'read')",
            "('VIEWER', 'analytics', 'read')",
        ];

        const allPermissions = [
            ...ownerPermissions,
            ...managerPermissions,
            ...supportPermissions,
            ...viewerPermissions,
        ];

        await queryRunner.query(`
            INSERT INTO admin_permissions (role, resource, action)
            VALUES ${allPermissions.join(', ')}
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS admin_permissions`);
        await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS admin_role`);
        await queryRunner.query(`DROP TYPE IF EXISTS "admin_role"`);
    }
}
