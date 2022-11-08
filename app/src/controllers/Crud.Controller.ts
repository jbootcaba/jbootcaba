import {
	Body,
	Controller,
	Get,
	Path,
	Post,
	Query,
	Route,
	SuccessResponse,
	Security,
} from "tsoa";
import { inject } from "inversify";
import { ILogger } from "jbootcaba/core";
import { config, logger, provideSingleton } from "jbootcaba/inversify";
import { Character, CharactersService } from "../services/CharactersService";
import { Configuration } from "../configuration";

@Route("characters")
@provideSingleton(UsersController)
export class UsersController extends Controller {
	constructor(
		@inject(CharactersService) private charactersService: CharactersService,
		@logger() private logger: ILogger,
		@config() private config: Configuration
	) {
		super();
	}

	@Get("{characterId}")
	public async getCharacter(
		@Path() characterId: number,
		@Query() name?: string
	): Promise<Character[]> {
		this.logger.info("TESTE " + this.config.SERVICE_NAME);
		const result = await this.charactersService.get();
		return result.getValue();
	}

	@SuccessResponse("201", "Created") // Custom success response
	@Post()
	@Security("bearer_token", ["admin"])
	public async createUser(
		@Body() requestBody: Character
	): Promise<Character | string> {
		this.logger.info("TESTE %s", this.config.SERVICE_NAME);
		this.logger.info("LOG LEVEL %s", this.config.LOG_LEVEL);
		this.charactersService.add(requestBody);
		this.setStatus(201); // set return status 201
		return requestBody;
	}
}
