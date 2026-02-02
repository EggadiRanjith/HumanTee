import { MigrationInterface, QueryRunner } from "typeorm";

export class AdminSeed1770028204895 implements MigrationInterface {
    name = 'AdminSeed1770028204895'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create the Auth User (Credentials)
        // Email: humanteeteam@gmail.com
        // Password: Admin@123
        // Hash generated with bcrypt rounds 10
        const adminId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
        const passwordHash = '$2b$10$wKpxmO6ePuxGZ/7eXY.1A.Dk7Z.B5hE/p7y5Wkly2lC/K9m8R.p9G';

        // check if user already exists
        const userExists = await queryRunner.query(
            `SELECT id FROM "auth_users" WHERE email = 'humanteeteam@gmail.com'`
        );

        if (userExists.length === 0) {
            await queryRunner.query(`
                INSERT INTO "auth_users" (
                    "id", 
                    "email", 
                    "password_hash", 
                    "auth_provider", 
                    "role", 
                    "is_active"
                ) VALUES (
                    '${adminId}', 
                    'humanteeteam@gmail.com', 
                    '${passwordHash}', 
                    'email', 
                    'ADMIN', 
                    true
                )
            `);

            // 2. Create the Admin Profile
            await queryRunner.query(`
                INSERT INTO "user_profiles" (
                    "id", 
                    "auth_user_id", 
                    "full_name"
                ) VALUES (
                    uuid_generate_v4(), 
                    '${adminId}', 
                    'HumanTee Admin'
                )
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const adminId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
        await queryRunner.query(`DELETE FROM "user_profiles" WHERE "auth_user_id" = '${adminId}'`);
        await queryRunner.query(`DELETE FROM "auth_users" WHERE "id" = '${adminId}'`);
    }
}
