    // // adapters/secondary/MemoryAdapter.ts
    // import { UserRepository } from '../../domain/UserRepository';
    // import { User } from '../';

    // export class MemoryAdapter implements UserRepository {
    //     private users: User[] = [];
    //     private currentId: number = 1;

    //     async getUsers(): Promise<User[]> {
    //         return this.users;
    //     }

    //     async addUser(user: Omit<User, 'id'>): Promise<User> {
    //         const newUser = new User(this.currentId++,  user.name, user.email);
    //         this.users.push(newUser);
    //         return newUser;
    //     }

    //     async updateUser(id: number, userData: Partial<User>): Promise<void> {
    //         const index = this.users.findIndex(user => user.id === id);
    //         if (index === -1) throw new Error('User not found');
    //         const user = this.users[index];
    //         user.name = userData.name ?? user.name;
    //         user.email = userData.email ?? user.email;
    //     }

    //     async deleteUser(id: number): Promise<void> {
    //         const index = this.users.findIndex(user => user.id === id);
    //         if (index === -1) throw new Error('User not found');
    //         this.users.splice(index, 1);
    //     }
    // }