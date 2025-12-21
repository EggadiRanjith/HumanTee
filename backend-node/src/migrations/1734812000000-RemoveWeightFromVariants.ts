import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveWeightFromVariants1734812000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Remove weight column from product_variants
        await queryRunner.dropColumn('product_variants', 'weight');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Re-add weight column
        await queryRunner.addColumn(
            'product_variants',
            new TableColumn({
                name: 'weight',
                type: 'int',
                isNullable: true,
            })
        );
    }
}
