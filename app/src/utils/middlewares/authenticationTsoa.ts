/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request } from "express";
import { container } from "@jbootcaba/inversify";
import { AuthService } from "../../services/AuthService";
import { IUser } from "../../IUser";

export const expressAuthentication = async (
	request: Request,
	_securityName: string,
	_scopes?: string[]
): Promise<IUser> => {
	const authService = container.get<AuthService>(AuthService);
	const user = await authService.Validade(request);
	return user;
};
