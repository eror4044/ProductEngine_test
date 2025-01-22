import { User } from "./UserModel";

export interface Account {
  id: string;
  name: string;
  email: string;
  owner: User;
}
