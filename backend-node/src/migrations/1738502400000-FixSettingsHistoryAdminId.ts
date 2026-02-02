import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Fix settings_history schema to allow nullable admin_id
 * This resolves the production constraint violation error
 */
export class FixSettingsHistoryAdminId1738502400000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Make admin_id nullable to match entity definition
        await queryRunner.query(`
            ALTER TABLE settings_history 
            ALTER COLUMN admin_id DROP NOT NULL
        `);

        // Ensure settings column exists and is nullable
        const table = await queryRunner.getTable('settings_history');
        const settingsColumn = table?.findColumnByName('settings');

        if (!settingsColumn) {
            await queryRunner.query(`
                ALTER TABLE settings_history 
                ADD COLUMN settings jsonb
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert admin_id to NOT NULL (only if all rows have values)
        await queryRunner.query(`
            ALTER TABLE settings_history 
            ALTER COLUMN admin_id SET NOT NULL
        `);

        // Remove settings column if it was added
        await queryRunner.query(`
            ALTER TABLE settings_history 
            DROP COLUMN IF EXISTS settings
        `);
    }
}
