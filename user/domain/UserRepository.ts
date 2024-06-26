import { User } from "./User";

export interface UserRepository {
    getUsers(): Promise<User[]>;
    getUserById(id: string): Promise<User | null>;
    addUser(user: Omit<User, "id">): Promise<User>;
    updateUser(id: string, user: Partial<User>): Promise<void>;
    deleteUser(id: string): Promise<void>;
}


