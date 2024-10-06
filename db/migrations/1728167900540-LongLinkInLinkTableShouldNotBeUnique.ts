import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUniqueConstraintFromLongLink1645678901234
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "link" DROP CONSTRAINT "UQ_4616bf0bd8900c9f6b19d1f8726"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "link" ADD CONSTRAINT "UQ_4616bf0bd8900c9f6b19d1f8726" UNIQUE ("long_link")`,
    );
  }
}
