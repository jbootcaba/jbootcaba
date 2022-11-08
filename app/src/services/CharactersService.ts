import { logger, provideSingleton } from "jbootcaba/inversify";
import { ILogger } from "jbootcaba/core";
import { Api } from "jbootcaba/http";
import { CharacterApi } from "@utils/decorators";
import { Result } from "type-result";

export interface Character {
	id: string;
	name: string;
	friends: string[];
}
@provideSingleton(CharactersService) // or @provide(FooService)
export class CharactersService {
	constructor(
		@CharacterApi()
		private readonly characterApi: Api,
		@logger()
		private readonly logger: ILogger
	) {}
	async add(character: Character): Promise<Result<void, string>> {
		const response = await this.characterApi.post("/v1", character);
		if (response.status !== 200) return Result.fail("Problems happens =)");
		return Result.ok();
	}
	async get(): Promise<Result<Character[], string>> {
		const response = await this.characterApi.get("/v1");
		if (response.status !== 200) return Result.fail("Problems happens =)");
		return Result.ok(response.data);
	}
	async getById(id: string): Promise<Result<Character, string>> {
		const response = await this.characterApi.get(`/v1/${id}`);
		if (response.status !== 200) return Result.fail("Problems happens =)");
		return Result.ok(response.data);
	}
}
