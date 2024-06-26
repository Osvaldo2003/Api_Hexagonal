import { Connection, OkPacket, RowDataPacket } from 'mysql2/promise';
import { UserRepository } from '../../domain/UserRepository';
import { User } from '../../domain/User';

export class MySQLAdapter implements UserRepository {
    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    // GET: Obtener todos los usuarios
    async getUsers(): Promise<User[]> {
        const [rows] = await this.connection.execute<RowDataPacket[]>('SELECT * FROM users');
        return rows.map(row => new User(row.id, row.name, row.email));
    }

    // POST: Agregar un nuevo usuario
    async addUser(user: User): Promise<User> {
        const [result] = await this.connection.execute<OkPacket>(
            'INSERT INTO users (name, email) VALUES (?, ?)', 
            [user.name, user.email]
        );

        const insertedId = result.insertId;
        return new User(insertedId, user.name, user.email);
    }

    // UPDATE: Actualizar un usuario existente por su ID
    async updateUser(id: number, user: Partial<User>): Promise<void> {
        // Construir la consulta SQL dinámicamente
        const fields: string[] = [];
        const values: (string | number)[] = [];

        if (user.name !== undefined) {
            fields.push('name = ?');
            values.push(user.name);
        }

        if (user.email !== undefined) {
            fields.push('email = ?');
            values.push(user.email);
        }

        if (fields.length > 0) {
            const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
            values.push(id);

            await this.connection.execute(sql, values);
        }
    }

    // DELETE: Eliminar un usuario por su ID
    async deleteUser(id: number): Promise<void> {
        await this.connection.execute('DELETE FROM users WHERE id = ?', [id]);
    }
}
