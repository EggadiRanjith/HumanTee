import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCollectionLabels1734870000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Rename 'Drop 1' to 'New Arrival'
        await queryRunner.query(`
            UPDATE \`collections\` 
            SET \`name\` = 'New Arrival', \`slug\` = 'new-arrival' 
            WHERE \`name\` = 'Drop 1' OR \`slug\` = 'drop-1'
        `);

        // Rename 'Drop 2' to 'Best Seller'
        await queryRunner.query(`
            UPDATE \`collections\` 
            SET \`name\` = 'Best Seller', \`slug\` = 'best-seller' 
            WHERE \`name\` = 'Drop 2' OR \`slug\` = 'drop-2'
        `);

        // Rename 'Drop 3' to 'Summer Collection'
        await queryRunner.query(`
            UPDATE \`collections\` 
            SET \`name\` = 'Summer Collection', \`slug\` = 'summer-collection' 
            WHERE \`name\` = 'Drop 3' OR \`slug\` = 'drop-3'
        `);

        // Add 'Sale' collection if it doesn't exist
        await queryRunner.query(`
            INSERT IGNORE INTO \`collections\` (\`id\`, \`name\`, \`slug\`, \`display_order\`) 
            VALUES (UUID(), 'Sale', 'sale', 4)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert names
        await queryRunner.query(`
            UPDATE \`collections\` 
            SET \`name\` = 'Drop 1', \`slug\` = 'drop-1' 
            WHERE \`name\` = 'New Arrival'
        `);
        await queryRunner.query(`
            UPDATE \`collections\` 
            SET \`name\` = 'Drop 2', \`slug\` = 'drop-2' 
            WHERE \`name\` = 'Best Seller'
        `);
        await queryRunner.query(`
            UPDATE \`collections\` 
            SET \`name\` = 'Drop 3', \`slug\` = 'drop-3' 
            WHERE \`name\` = 'Summer Collection'
        `);
    }
}
