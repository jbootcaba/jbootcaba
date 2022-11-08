import { Resolver, Arg, Authorized, Query } from "type-graphql";
import { FindCharacterArgs, CharacterDTO } from "./Contracts";
import { provideSingleton } from "jbootcaba/inversify";
import { NotFoundError } from "./NotFoundError";
import { CharactersService } from "@services/CharactersService";

@provideSingleton(SettlementsResolver)
@Resolver(CharacterDTO)
export class SettlementsResolver {
	constructor(private charactersService: CharactersService) {}

	@Query(() => CharacterDTO)
	@Authorized()
	async character(
		@Arg("input") args: FindCharacterArgs
	): Promise<CharacterDTO> {
		const result = await this.charactersService.getById(args.characterId);
		if (result.isFailure) throw new NotFoundError();
		const value = result.getValue();
		return Promise.resolve(value);
	}
}
