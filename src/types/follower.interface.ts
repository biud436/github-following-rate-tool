export interface User {
    id: number;
    login: string;
}

export interface Follower extends User {}
export interface Following extends User {}
