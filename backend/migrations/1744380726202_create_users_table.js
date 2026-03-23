/* eslint-disable @typescript-eslint/naming-convention */

exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = pgm => {
  // First, create the trigger function (if it doesn't exist)
  pgm.sql(`
    CREATE OR REPLACE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // Then, create the users table
  pgm.createTable('users', {
    id: {
      type: 'uuid', // Changed to UUID
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'), // Requires pgcrypto extension if not enabled
    },
    email: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
    },
    password_hash: {
      // Added password hash
      type: 'varchar(255)',
      notNull: true,
    },
    // Fields from onboarding (adjust types/nullability as needed)
    first_name: { type: 'varchar(100)' },
    last_name: { type: 'varchar(100)' },
    birth_date: { type: 'date' },
    gender: { type: 'varchar(50)' },
    workout_frequency: { type: 'varchar(50)' },
    height_cm: { type: 'integer' },
    weight_kg: { type: 'numeric(5, 2)' }, // Corrected type
    goal: { type: 'varchar(50)' },
    diet_type: { type: 'varchar(50)' },
    obstacles: { type: 'text[]' },
    personal_aims: { type: 'text[]' },
    subscription_status: {
      type: 'varchar(20)', // Matched manual schema
      default: 'free',
      notNull: true,
    },
    trial_ends_at: { type: 'timestamp with time zone' }, // Matched manual schema
    health_app_connected: { type: 'boolean', default: false }, // Matched manual schema

    // Timestamps
    created_at: {
      type: 'timestamp with time zone', // Changed to timestamptz
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp with time zone', // Changed to timestamptz
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Add index on email for faster lookups
  pgm.createIndex('users', 'email');

  // Add the trigger to the users table
  pgm.sql(`
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
  `);
};

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = pgm => {
  pgm.dropTable('users'); // Drops table and associated triggers/indexes
  // Optionally drop the function if it's only used by this table
  // pgm.sql('DROP FUNCTION IF EXISTS trigger_set_timestamp();');
};
