import { InputType, Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class CharacterDTO {
	@Field(() => ID)
	id: string;
	@Field()
	name: string;
}

@InputType()
export class FindCharacterPagedArgs {
	@Field()
	pageSize: number;
	@Field()
	pageNumber: number;
}

@InputType()
export class FindCharacterArgs {
	@Field()
	characterId: string;
}
