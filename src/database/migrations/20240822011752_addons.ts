import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('addons', (table) => {
    table.increments('id').primary();
    table.decimal('amount', 12, 2).notNullable();
    table.integer('meal_id').unsigned().references('id').inTable('meals').onDelete('CASCADE');
    table.jsonb('meal_data'); // Assuming meal_data is a JSON column
    table.integer('meal_addon_id');
    table.decimal('internal_profit', 12, 2).defaultTo(0);
    table.integer('min_selection_no').notNullable();
    table.string('meal_addon_category_id');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('addons');
}


