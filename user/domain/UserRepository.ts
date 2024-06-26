import { User } from "../domain/User";

export interface UserRepository {
    getUsers(): Promise<User[]>;
    addUser(user: Omit<User, 'id'>): Promise<User>;
    updateUser(id: number, user: Partial<User>): Promise<void>;
    deleteUser(id: number): Promise<void>;
}
