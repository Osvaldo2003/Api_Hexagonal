import { User } from '../domain/User';
import { UserRepository } from '../domain/UserRepository';

export class UserService implements UserRepository {
    constructor(private adapter: UserRepository) {}

    async getUsers(): Promise<User[]> {
        return this.adapter.getUsers();
    }

    async addUser(user: Omit<User, 'id'>): Promise<User> {
        return this.adapter.addUser(user);
    }

    async updateUser(id: number, user: Partial<User>): Promise<void> {
        return this.adapter.updateUser(id, user);
    }

    async deleteUser(id: number): Promise<void> {
        return this.adapter.deleteUser(id);
    }
}
