import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('calculated_orders', (table) => {
    table.increments('id').primary();
    table.decimal('total_amount', 12, 2).notNullable();
    table.boolean('free_delivery').notNullable().defaultTo(false);
    table.decimal('delivery_fee', 12, 2).notNullable();
    table.decimal('service_charge', 12, 2).notNullable();
    table.jsonb('address_details').notNullable();
    table.string('lat').nullable();
    table.string('lng').nullable();
    table.string('cokitchen_polygon_id').nullable();
    table.integer('cokitchen_id').nullable();
    table.boolean('pickup').defaultTo(false);
    table.decimal('prev_price', 12, 2).nullable();
    table.json('meals_details');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('calculated_orders');
}
