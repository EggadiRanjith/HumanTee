const { DataSource } = require('typeorm');

// Create a temporary data source
const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'humantee',
});

async function updateCollections() {
    try {
        await AppDataSource.initialize();
        console.log('✅ Connected to database');

        // Update Drop 1 -> New Arrival
        await AppDataSource.query(`
            UPDATE collections 
            SET name = 'New Arrival', slug = 'new-arrival' 
            WHERE name = 'Drop 1' OR slug = 'drop-1'
        `);
        console.log('✅ Updated Drop 1 -> New Arrival');

        // Update Drop 2 -> Best Seller
        await AppDataSource.query(`
            UPDATE collections 
            SET name = 'Best Seller', slug = 'best-seller' 
            WHERE name = 'Drop 2' OR slug = 'drop-2'
        `);
        console.log('✅ Updated Drop 2 -> Best Seller');

        // Update Drop 3 -> Summer Collection
        await AppDataSource.query(`
            UPDATE collections 
            SET name = 'Summer Collection', slug = 'summer-collection' 
            WHERE name = 'Drop 3' OR slug = 'drop-3'
        `);
        console.log('✅ Updated Drop 3 -> Summer Collection');

        // Add Sale collection if it doesn't exist
        await AppDataSource.query(`
            INSERT INTO collections (id, name, slug, display_order, is_active, created_at, updated_at) 
            VALUES (gen_random_uuid(), 'Sale', 'sale', 4, true, NOW(), NOW())
            ON CONFLICT (name) DO NOTHING
        `);
        console.log('✅ Added Sale collection');

        console.log('\n🎉 All collections updated successfully!');

        await AppDataSource.destroy();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

updateCollections();
