export interface UserData {
    id: string;
    name: string;
    email: string;
}

export class User implements UserData {
    constructor(public id: string, public name: string, public email: string) {}
}
