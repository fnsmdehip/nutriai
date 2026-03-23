/* eslint-disable @typescript-eslint/naming-convention */

exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = pgm => {
  pgm.createTable('food_logs', {
    log_id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    log_date: {
      type: 'date',
      notNull: true,
    },
    meal_type: { type: 'varchar(50)' },
    food_name: {
      type: 'varchar(255)',
      notNull: true,
    },
    calories: { type: 'integer', default: 0 },
    protein: { type: 'integer', default: 0 },
    carbs: { type: 'integer', default: 0 },
    fat: { type: 'integer', default: 0 },
    serving_size: { type: 'varchar(100)' },
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Add index for faster lookups by user and date
  pgm.createIndex('food_logs', ['user_id', 'log_date'], { name: 'idx_food_logs_user_date' });

  // Add the trigger to the food_logs table (uses function created in users migration)
  pgm.sql(`
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON food_logs
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
  `);
};

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = pgm => {
  pgm.dropTable('food_logs'); // Drops table, associated trigger, and index
};
