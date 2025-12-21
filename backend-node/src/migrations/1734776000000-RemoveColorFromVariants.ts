import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveColorFromVariants1734776000000 implements MigrationInterface {
    name = 'RemoveColorFromVariants1734776000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Remove color and color_hex columns from product_variants table
        await queryRunner.query(`ALTER TABLE "product_variants" DROP COLUMN "color"`);
        await queryRunner.query(`ALTER TABLE "product_variants" DROP COLUMN "color_hex"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Restore color and color_hex columns if migration is reverted
        await queryRunner.query(`ALTER TABLE "product_variants" ADD "color_hex" character varying(7)`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD "color" character varying(50)`);
    }
}
