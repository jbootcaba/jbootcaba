import { Container } from "inversify";
// Create a new container tsoa can use
export const container: Container =
	global.Container || (global.Container = new Container());
