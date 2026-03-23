const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

// Connect to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Hash password function
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Seed users data
async function seedUsers() {
  console.log('Seeding users...');

  try {
    // Create users
    const users = [
      {
        email: 'test@example.com',
        password: await hashPassword('password123'),
        first_name: 'Test',
        last_name: 'User',
        gender: 'Male',
        workout_frequency: '3-5',
        height_cm: 175,
        weight_kg: 70.5,
        goal: 'Lose',
        diet_type: 'No Restrictions',
        health_app_connected: true,
      },
      {
        email: 'jane@example.com',
        password: await hashPassword('password123'),
        first_name: 'Jane',
        last_name: 'Doe',
        gender: 'Female',
        workout_frequency: '0-2',
        height_cm: 165,
        weight_kg: 60.0,
        goal: 'Maintain',
        diet_type: 'Vegetarian',
        health_app_connected: false,
      },
      {
        email: 'john@example.com',
        password: await hashPassword('password123'),
        first_name: 'John',
        last_name: 'Smith',
        gender: 'Male',
        workout_frequency: '6+',
        height_cm: 185,
        weight_kg: 85.0,
        goal: 'Gain',
        diet_type: 'High Protein',
        health_app_connected: true,
      },
    ];

    // Insert users
    for (const user of users) {
      const result = await pool.query(
        `INSERT INTO users (
          email, password_hash, first_name, last_name, gender,
          workout_frequency, height_cm, weight_kg, goal, diet_type, health_app_connected
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id`,
        [
          user.email,
          user.password,
          user.first_name,
          user.last_name,
          user.gender,
          user.workout_frequency,
          user.height_cm,
          user.weight_kg,
          user.goal,
          user.diet_type,
          user.health_app_connected,
        ],
      );
      user.id = result.rows[0].id;
    }

    console.log('Users seeded successfully');
    return users;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

// Seed food logs data
async function seedFoodLogs(users) {
  console.log('Seeding food logs...');

  try {
    // Get current date
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Format dates to YYYY-MM-DD
    const formatDate = date => date.toISOString().split('T')[0];
    const todayFormatted = formatDate(today);
    const yesterdayFormatted = formatDate(yesterday);

    // Food logs data
    const foodLogs = [
      // User 1 - Today
      {
        user_id: users[0].id,
        log_date: todayFormatted,
        meal_type: 'Breakfast',
        food_name: 'Oatmeal with Banana',
        calories: 350,
        protein: 10,
        carbs: 65,
        fat: 5,
        serving_size: '1 bowl',
      },
      {
        user_id: users[0].id,
        log_date: todayFormatted,
        meal_type: 'Lunch',
        food_name: 'Chicken Salad',
        calories: 450,
        protein: 35,
        carbs: 20,
        fat: 25,
        serving_size: '1 plate',
      },
      // User 1 - Yesterday
      {
        user_id: users[0].id,
        log_date: yesterdayFormatted,
        meal_type: 'Dinner',
        food_name: 'Salmon with Vegetables',
        calories: 550,
        protein: 40,
        carbs: 30,
        fat: 25,
        serving_size: '1 fillet',
      },
      // User 2 - Today
      {
        user_id: users[1].id,
        log_date: todayFormatted,
        meal_type: 'Breakfast',
        food_name: 'Avocado Toast',
        calories: 320,
        protein: 8,
        carbs: 30,
        fat: 20,
        serving_size: '2 slices',
      },
      {
        user_id: users[1].id,
        log_date: todayFormatted,
        meal_type: 'Lunch',
        food_name: 'Vegetable Wrap',
        calories: 380,
        protein: 12,
        carbs: 45,
        fat: 15,
        serving_size: '1 wrap',
      },
      // User 3 - Today
      {
        user_id: users[2].id,
        log_date: todayFormatted,
        meal_type: 'Breakfast',
        food_name: 'Protein Smoothie',
        calories: 420,
        protein: 35,
        carbs: 45,
        fat: 10,
        serving_size: '1 large glass',
      },
      {
        user_id: users[2].id,
        log_date: todayFormatted,
        meal_type: 'Lunch',
        food_name: 'Steak with Rice',
        calories: 680,
        protein: 50,
        carbs: 60,
        fat: 25,
        serving_size: '1 plate',
      },
    ];

    // Insert food logs
    for (const log of foodLogs) {
      await pool.query(
        `INSERT INTO food_logs (
          user_id, log_date, meal_type, food_name,
          calories, protein, carbs, fat, serving_size
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          log.user_id,
          log.log_date,
          log.meal_type,
          log.food_name,
          log.calories,
          log.protein,
          log.carbs,
          log.fat,
          log.serving_size,
        ],
      );
    }

    console.log('Food logs seeded successfully');
  } catch (error) {
    console.error('Error seeding food logs:', error);
    throw error;
  }
}

// Main function to run the seed
async function seed() {
  try {
    // Check if tables already have data
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCount.rows[0].count) > 0) {
      console.log('Database already contains data. Clearing existing data...');
      await pool.query('DELETE FROM food_logs');
      await pool.query('DELETE FROM users');
    }

    // Run the seed functions
    const users = await seedUsers();
    await seedFoodLogs(users);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    pool.end();
  }
}

// Run the seed
seed();
