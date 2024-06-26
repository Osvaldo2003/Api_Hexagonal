import express from 'express';
import { createConnection, Connection } from 'mysql2/promise';
import { MongoClient, Db } from 'mongodb';
import { UserController } from '../adapters/primary/UserController';
import { UserService } from '../application/UserService';
import { MySQLAdapter } from '../adapters/secondary/MySQLAdapter';
import { MongoDBAdapter } from '../adapters/secondary/MongoDBAdapter';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const startMySQLConnection = async (): Promise<MySQLAdapter> => {
    const mysqlConnection: Connection = await createConnection({
        host: 'database-1.ch3invxacnfz.us-east-1.rds.amazonaws.com',
        user: 'admin',
        password: 'pichito34',
        database: 'BD1'
    });
    return new MySQLAdapter(mysqlConnection);
};

const startMongoDBConnection = async (): Promise<MongoDBAdapter> => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('MONGODB_URI environment variable is not defined');
    }
    const mongoClient: MongoClient = new MongoClient(uri);
    await mongoClient.connect();
    const mongoDB: Db = mongoClient.db(process.env.MONGODB_DBNAME); // Make sure to define MONGODB_DBNAME in your .env file
    return new MongoDBAdapter(mongoDB);
};

const startServer = async () => {
    const mysqlAdapter = await startMySQLConnection();
    const mongoAdapter = await startMongoDBConnection();
    
    const userService = new UserService(mysqlAdapter, mongoAdapter);
    const userController = new UserController(userService);

    app.use('/api', userController.registerRoutes());

    app.listen(3000, () => {
        console.log('Servidor escuchando en el puerto 3000');
    });
};

startServer();
