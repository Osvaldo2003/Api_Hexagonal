import express from 'express';
import { createConnection, Connection } from 'mysql2/promise';
import { UserController } from '../adapters/primary/UserController';
import { UserService } from '../application/UserService';
import { MySQLAdapter } from '../adapters/secondary/MySQLAdapter';
import { MemoryAdapter } from '../adapters/secondary/MemoryAdapter';

const app = express();
app.use(express.json());

const startMySQLConnection = async () => {
    try {
        const mysqlConnection: Connection = await createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'BD1'
        });

        const mysqlAdapter = new MySQLAdapter(mysqlConnection);
        const userServiceMySQL = new UserService(mysqlAdapter);
        const userControllerMySQL = new UserController(userServiceMySQL);

        app.use('/api/mysql', userControllerMySQL.registerRoutes());

        console.log('Conexión exitosa a MySQL');
    } catch (error) {
        console.error('Error al conectar con MySQL:', error);
    }
};

const startMemoryDatabase = () => {
    const memoryAdapter = new MemoryAdapter();
    const userServiceMemory = new UserService(memoryAdapter);
    const userControllerMemory = new UserController(userServiceMemory);

    app.use('/api/memory', userControllerMemory.registerRoutes());
    
    console.log('Base de datos en memoria configurada');
};

const startServer = async () => {
    await startMySQLConnection();
    startMemoryDatabase();
    
    app.listen(3000, () => {
        console.log('Servidor escuchando en el puerto 3000');
    });
};

startServer();
