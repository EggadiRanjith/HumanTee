import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTicketViewTracking1739201252000 implements MigrationInterface {
    name = 'AddTicketViewTracking1739201252000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add first_viewed_at column to tickets table for tracking when admin first viewed the ticket
        await queryRunner.addColumn(
            'tickets',
            new TableColumn({
                name: 'first_viewed_at',
                type: 'timestamp',
                isNullable: true,
                default: null,
                comment: 'Timestamp when admin first viewed this ticket. NULL = unread/new ticket',
            })
        );

        console.log('✅ Added first_viewed_at column to tickets table');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Rollback: Remove the column
        await queryRunner.dropColumn('tickets', 'first_viewed_at');

        console.log('✅ Removed first_viewed_at column from tickets table');
    }
}
