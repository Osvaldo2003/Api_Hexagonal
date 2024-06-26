// Archivo: application/UserService.ts
import { User } from '../domain/User';
import { UserRepository } from '../domain/UserRepository';

export class UserService {
    constructor(
        private readonly mysqlRepo: UserRepository,
        private readonly mongoRepo: UserRepository
    ) {}

    async getUsers(): Promise<User[]> {
        const mysqlUsers = await this.mysqlRepo.getUsers();
        const mongoUsers = await this.mongoRepo.getUsers();
        return [...mysqlUsers, ...mongoUsers];
    }

    async getUserById(id: string): Promise<User | null> {
        const user = await this.mysqlRepo.getUserById(id) || await this.mongoRepo.getUserById(id);
        return user;
    }

    async addUser(user: Omit<User, "id">): Promise<User> {
        const newUserMysql = await this.mysqlRepo.addUser(user);
        const newUserMongo = await this.mongoRepo.addUser(user);
        return newUserMysql; // Assuming both have the same data, return one of them
    }

    async updateUser(id: string, user: Partial<User>): Promise<void> {
        await this.mysqlRepo.updateUser(id, user);
        await this.mongoRepo.updateUser(id, user);
    }

    async deleteUser(id: string): Promise<void> {
        await this.mysqlRepo.deleteUser(id);
        await this.mongoRepo.deleteUser(id);
    }
}
