import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnablePgVector1710000000000 implements MigrationInterface {
  name = 'EnablePgVector1710000000000';

  async up(queryRunner: QueryRunner) {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector`);
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.query(`DROP EXTENSION IF EXISTS vector`);
  }
}

