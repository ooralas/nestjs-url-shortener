import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class CreateLinkTable1721576599668 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'link',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'alias',
            type: 'varchar',
          },
          {
            name: 'long_link',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'views',
            type: 'int',
            default: 0,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('link');
  }
}
