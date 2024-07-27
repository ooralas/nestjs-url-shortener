import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateLinkAnalyticTable1721638996047
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'link_analytic',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'device',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'browser',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'ip_address',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'country',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'city',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'link_id',
            type: 'int',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'link_analytic',
      new TableForeignKey({
        columnNames: ['link_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'link',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('link_analytic');
  }
}
