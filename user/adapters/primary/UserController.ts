// adapters/primary/UserController.ts

import { Request, Response, Router } from 'express';
import { UserService } from '../../application/UserService';

export class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    public registerRoutes(): Router {
        const router = Router();

        router.get('/users', this.getUsers.bind(this));
        router.post('/users', this.addUser.bind(this));
        router.put('/users/:id', this.updateUser.bind(this));
        router.delete('/users/:id', this.deleteUser.bind(this));

        return router;
    }

    private async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.userService.getUsers();
            res.json(users);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    private async addUser(req: Request, res: Response): Promise<void> {
        try {
            const { name, email } = req.body;
            const newUser = await this.userService.addUser({ name, email });
            res.status(201).json(newUser);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    private async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.id, 10);
            const { name, email } = req.body;
            await this.userService.updateUser(userId, { name, email });
            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    private async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.id, 10);
            await this.userService.deleteUser(userId);
            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
