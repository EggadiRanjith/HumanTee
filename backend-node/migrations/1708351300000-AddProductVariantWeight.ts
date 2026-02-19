import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductVariantWeight1708351300000 implements MigrationInterface {
    name = 'AddProductVariantWeight1708351300000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add weight_grams column with default 300 (typical t-shirt weight)
        await queryRunner.query(
            `ALTER TABLE "product_variants" ADD COLUMN IF NOT EXISTS "weight_grams" integer NOT NULL DEFAULT 300`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "product_variants" DROP COLUMN IF EXISTS "weight_grams"`,
        );
    }
}
