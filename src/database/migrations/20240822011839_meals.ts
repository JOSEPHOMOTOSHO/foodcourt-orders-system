import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.decimal('price', 12, 2);
    table.integer('brand_id').unsigned().notNullable().references('id').inTable('brands').onDelete('CASCADE');
    table.boolean('active').defaultTo(true);
    table.decimal('amount', 12, 2).notNullable();
    table.boolean('alcohol').defaultTo(false);
    table.integer('item_no');
    table.text('summary');
    table.string('calories');
    table.boolean('is_addon').defaultTo(false);
    table.boolean('is_combo').defaultTo(false);
    table.integer('position').defaultTo(0);
    table.integer('quantity').defaultTo(1);
    table.boolean('home_page').defaultTo(false);
    table.string('item_type').notNullable();
    table.jsonb('meal_tags').defaultTo([]);
    table.text('order_note');
    table.integer('available_no').defaultTo(0);;
    table.jsonb('meal_keywords').defaultTo([]);
    table.decimal('internal_profit', 12, 2).defaultTo(0);
    table.string('meal_category_id');
    table.boolean('is_deleted').defaultTo(false);
    table.integer('calculated_order_id').unsigned().references('id').inTable('calculated_orders').onDelete('CASCADE');
    table.integer('minimum_age').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.string('images'); 
    
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals');
}
