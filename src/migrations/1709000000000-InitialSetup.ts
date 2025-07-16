import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSetup1709000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criação da tabela countries
    await queryRunner.query(`
      CREATE TABLE countries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        code VARCHAR(3) NOT NULL,
        currency VARCHAR(3) NOT NULL,
        currency_symbol VARCHAR(10),
        supported_payment_methods JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Criação da tabela subscription_plans
    await queryRunner.query(`
      CREATE TABLE subscription_plans (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        interval VARCHAR(20) NOT NULL,
        description TEXT,
        features JSONB,
        product_limit INTEGER NOT NULL,
        user_limit INTEGER NOT NULL,
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Criação da tabela tenants
    await queryRunner.query(`
      CREATE TABLE tenants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        subdomain VARCHAR(100) NOT NULL UNIQUE,
        store_name VARCHAR(255) NOT NULL,
        country_id INTEGER NOT NULL REFERENCES countries(id),
        subscription_plan_id INTEGER REFERENCES subscription_plans(id),
        business_document VARCHAR(100),
        whatsapp_number VARCHAR(50),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Inserção de dados iniciais
    await queryRunner.query(`
      INSERT INTO countries (name, code, currency, currency_symbol) VALUES
      ('Brasil', 'BRA', 'BRL', 'R$'),
      ('Portugal', 'PRT', 'EUR', '€');

      INSERT INTO subscription_plans (name, price, interval, description, product_limit, user_limit, features) VALUES
      ('Gratuito', 0, 'monthly', 'Plano básico gratuito', 10, 1, '{"max_photos_per_product": 3}'),
      ('Profissional', 29.90, 'monthly', 'Plano profissional', 100, 3, '{"max_photos_per_product": 5}'),
      ('Empresarial', 99.90, 'monthly', 'Plano empresarial', 500, 10, '{"max_photos_per_product": 10}');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS tenants;');
    await queryRunner.query('DROP TABLE IF EXISTS subscription_plans;');
    await queryRunner.query('DROP TABLE IF EXISTS countries;');
  }
}