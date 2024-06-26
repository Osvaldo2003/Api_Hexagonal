import { Request, Response, Router } from 'express';
import { UserService } from '../../application/UserService';

export class UserController {
    constructor(private readonly userService: UserService) {}

    registerRoutes(): Router {
        const router = Router();
        router.get('/users', this.getUsers.bind(this));
        router.get('/users/:id', this.getUserById.bind(this));
        router.post('/users', this.addUser.bind(this));
        router.put('/users/:id', this.updateUser.bind(this));
        router.delete('/users/:id', this.deleteUser.bind(this));
        return router;
    }

    async getUsers(req: Request, res: Response): Promise<void> {
        const users = await this.userService.getUsers();
        res.json(users);
    }

    async getUserById(req: Request, res: Response): Promise<void> {
        const user = await this.userService.getUserById(req.params.id);
        if (!user) {
            res.sendStatus(404);
            return;
        }
        res.json(user);
    }

    async addUser(req: Request, res: Response): Promise<void> {
        const { name, email } = req.body;
        const user = await this.userService.addUser({ name, email });
        res.status(201).json(user);
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        const { name, email } = req.body;
        await this.userService.updateUser(req.params.id, { id: req.params.id, name, email });
        res.sendStatus(204);
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        await this.userService.deleteUser(req.params.id);
        res.sendStatus(204);
    }
}
