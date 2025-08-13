import { User } from "./user";

export type UserCredential = Pick<User, 'id' | 'password'>