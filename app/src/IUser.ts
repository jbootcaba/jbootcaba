// The root provides a resolver function for each API endpoint
export interface IUser {
	id: number;
	name: string;
	roles?: string[];
}
