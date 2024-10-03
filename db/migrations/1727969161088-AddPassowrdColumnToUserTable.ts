import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

const userTableName = 'user';
export class AddPassowrdColumnToUserTable1727969161088
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      userTableName,
      new TableColumn({
        name: 'password',
        type: 'varchar',
        length: '255',
        isUnique: false,
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(userTableName, 'password');
  }
}
