import { Connection } from 'mysql2/promise';
import { User } from '../../domain/User';
import { UserRepository } from '../../domain/UserRepository';

export class MySQLAdapter implements UserRepository {
    constructor(private readonly connection: Connection) {}

    async getUsers(): Promise<User[]> {
        const [rows] = await this.connection.query('SELECT * FROM users');
        return (rows as any[]).map(row => new User(row.id.toString(), row.name, row.email));
    }

    async getUserById(id: string): Promise<User | null> {
        const [rows] = await this.connection.query('SELECT * FROM users WHERE id = ?', [id]);
        if ((rows as any[]).length === 0) {
            return null;
        }
        const row = (rows as any[])[0];
        return new User(row.id.toString(), row.name, row.email);
    }

    async addUser(user: Omit<User, "id">): Promise<User> {
        const [result] = await this.connection.execute('INSERT INTO users (name, email) VALUES (?, ?)', [user.name, user.email]);
        const insertId = (result as any).insertId;
        return new User(insertId.toString(), user.name, user.email);
    }

    async updateUser(id: string, user: Partial<User>): Promise<void> {
        await this.connection.execute('UPDATE users SET name = ?, email = ? WHERE id = ?', [user.name, user.email, id]);
    }

    async deleteUser(id: string): Promise<void> {
        await this.connection.execute('DELETE FROM users WHERE id = ?', [id]);
    }
}
