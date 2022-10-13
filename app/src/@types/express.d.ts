import { IUser } from "../IUser";

declare module "express" {
	export interface Request {
		user: IUser;
	}
}
