import 'reflect-metadata';
import { DataSource } from 'typeorm';

// Support both DATABASE_URL (production) and individual vars (local dev)
const getDatabaseConfig = () => {
    if (process.env.DATABASE_URL) {
        return {
            type: 'postgres' as const,
            url: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }, // Required for Neon
        };
    }

    return {
        type: 'postgres' as const,
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'Jithu459@',
        database: process.env.DB_DATABASE || 'HumanTee',
    };
};

export const AppDataSource = new DataSource({
    ...getDatabaseConfig(),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
    synchronize: false,
    logging: true,
});
