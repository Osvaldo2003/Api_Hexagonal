import { Db, ObjectId } from 'mongodb';
import { User } from '../../domain/User';
import { UserRepository } from '../../domain/UserRepository';

export class MongoDBAdapter implements UserRepository {
    constructor(private readonly db: Db) {}

    async getUsers(): Promise<User[]> {
        const users = await this.db.collection('users').find().toArray();
        return users.map(user => new User(user._id.toString(), user.name, user.email));
    }

    async getUserById(id: string): Promise<User | null> {
        const user = await this.db.collection('users').findOne({ _id: new ObjectId(id) });
        return user ? new User(user._id.toString(), user.name, user.email) : null;
    }

    async addUser(user: Omit<User, "id">): Promise<User> {
        const result = await this.db.collection('users').insertOne(user);
        return new User(result.insertedId.toString(), user.name, user.email);
    }

    async updateUser(id: string, user: Partial<User>): Promise<void> {
        await this.db.collection('users').updateOne({ _id: new ObjectId(id) }, { $set: user });
    }

    async deleteUser(id: string): Promise<void> {
        await this.db.collection('users').deleteOne({ _id: new ObjectId(id) });
    }
}
