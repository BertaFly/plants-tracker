import { sql } from '@vercel/postgres'

// Initialize database tables
export async function initDB() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        provider VARCHAR(50),
        provider_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Create plants table
    await sql`
      CREATE TABLE IF NOT EXISTS plants (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        photo_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Create care_records table
    await sql`
      CREATE TABLE IF NOT EXISTS care_records (
        id SERIAL PRIMARY KEY,
        plant_id INTEGER REFERENCES plants(id) ON DELETE CASCADE,
        care_type VARCHAR(50) NOT NULL, -- 'water', 'fertilize', 'treatment'
        care_date DATE NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_plants_user_id ON plants(user_id);`
    await sql`CREATE INDEX IF NOT EXISTS idx_care_records_plant_id ON care_records(plant_id);`
    await sql`CREATE INDEX IF NOT EXISTS idx_care_records_date ON care_records(care_date);`

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization failed:', error)
    throw error
  }
}

// User operations
export async function createUser(email, name, provider, providerId) {
  const result = await sql`
    INSERT INTO users (email, name, provider, provider_id)
    VALUES (${email}, ${name}, ${provider}, ${providerId})
    ON CONFLICT (email) DO UPDATE SET
      name = EXCLUDED.name,
      provider = EXCLUDED.provider,
      provider_id = EXCLUDED.provider_id,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `
  return result.rows[0]
}

export async function getUserByEmail(email) {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email} LIMIT 1;
  `
  return result.rows[0]
}

// Plant operations
export async function getPlantsByUserId(userId) {
  const result = await sql`
    SELECT 
      p.*,
      COALESCE(
        json_agg(
          json_build_object(
            'type', cr.care_type,
            'date', cr.care_date,
            'notes', cr.notes
          ) ORDER BY cr.care_date DESC
        ) FILTER (WHERE cr.id IS NOT NULL),
        '[]'::json
      ) as care_records
    FROM plants p
    LEFT JOIN care_records cr ON p.id = cr.plant_id
    WHERE p.user_id = ${userId}
    GROUP BY p.id
    ORDER BY p.created_at DESC;
  `
  return result.rows
}

export async function createPlant(userId, name, photoUrl = null) {
  const result = await sql`
    INSERT INTO plants (user_id, name, photo_url)
    VALUES (${userId}, ${name}, ${photoUrl})
    RETURNING *;
  `
  return result.rows[0]
}

export async function updatePlant(plantId, userId, updates) {
  const { name, photo_url } = updates
  const result = await sql`
    UPDATE plants 
    SET name = COALESCE(${name}, name),
        photo_url = COALESCE(${photo_url}, photo_url),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ${plantId} AND user_id = ${userId}
    RETURNING *;
  `
  return result.rows[0]
}

export async function deletePlant(plantId, userId) {
  const result = await sql`
    DELETE FROM plants 
    WHERE id = ${plantId} AND user_id = ${userId}
    RETURNING *;
  `
  return result.rows[0]
}

// Care record operations
export async function addCareRecord(plantId, careType, careDate, notes = null) {
  const result = await sql`
    INSERT INTO care_records (plant_id, care_type, care_date, notes)
    VALUES (${plantId}, ${careType}, ${careDate}, ${notes})
    RETURNING *;
  `
  return result.rows[0]
}

export async function removeCareRecord(plantId, careType, careDate) {
  const result = await sql`
    DELETE FROM care_records 
    WHERE plant_id = ${plantId} 
    AND care_type = ${careType} 
    AND care_date = ${careDate}
    RETURNING *;
  `
  return result.rows[0]
}

export async function getCareRecordsByDateRange(userId, startDate, endDate) {
  const result = await sql`
    SELECT 
      cr.*,
      p.name as plant_name,
      p.photo_url as plant_photo
    FROM care_records cr
    JOIN plants p ON cr.plant_id = p.id
    WHERE p.user_id = ${userId}
    AND cr.care_date BETWEEN ${startDate} AND ${endDate}
    ORDER BY cr.care_date DESC, p.name;
  `
  return result.rows
}
