import { mockedAxios } from "../mocks/axios.mock";
// import { mockClient } from "aws-sdk-client-mock";
// import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
// import { marshall } from "@aws-sdk/util-dynamodb";
import request from "supertest";
import { BuildApplication } from "../../src/Application";
import { Configuration, ConfigurationSchema } from "../../src/configuration";
import { ConfigureServices } from "../../src/ConfigureServices";
import { when } from "jest-when";
import { container, StartupBuilder } from "jbootcaba/inversify";
import {
	AuthRulesContext,
	DecryptTokenRule,
} from "../../src/services/AuthService";
import { Result } from "type-result";

describe("Characters", () => {
	let client: request.SuperTest<request.Test>;
	// const ddbMock = mockClient(DynamoDBClient);
	beforeAll(async () => {
		// ddbMock.reset();
		// ddbMock.on(GetItemCommand).resolves({
		// 	Item: marshall({
		// 		CustomerId: "123",
		// 		DeviceId: "123",
		// 	}),
		// });

		await StartupBuilder.Given<Configuration>(ConfigurationSchema)
			.WithConfigureServices(ConfigureServices)
			.Configure();
		jest.spyOn(DecryptTokenRule.prototype, "handle");
		when(DecryptTokenRule.prototype.handle)
			.calledWith(expect.anything())
			.mockResolvedValue(
				Result.ok<AuthRulesContext>({
					decryptedToken: {
						customer: {},
					},
					token: "",
				})
			);
		container
			.rebind(DecryptTokenRule)
			.toConstantValue(DecryptTokenRule.prototype);
		const app = await BuildApplication(container);
		client = request(app);
	});

	describe("Character queries", () => {
		it("should query a character", async () => {
			const id = "a7e5b9c5-ff21-44ff-9176-ab04c65a3de9";
			const exemploServiceMockResponse = {
				status: 200,
				data: {
					id: id,
					name: "goku",
				},
			};
			const url = `/v1/${id}`;
			const token = "ValidToken";
			when(mockedAxios.get)
				.calledWith(url, undefined)
				.mockResolvedValueOnce(exemploServiceMockResponse);

			const queryData = {
				query: `{character(input:{characterId: "${id}"}) {
					id,
					name
				}}`,
			};
			// when
			const response = await client
				.post("/graphql")
				.set("Content-Type", "application/json;charset=UTF-8")
				.set("authorization", token)
				.send(queryData);
			// then
			expect(response.body.errors).toBeUndefined();
			expect(response.body.data.character).toEqual({
				id: id,
				name: "goku",
			});

			expect(mockedAxios.get).toHaveBeenNthCalledWith(1, url, undefined);
		});
		it("should query a character and throw error if not found", async () => {
			const id = "a7e5b9c5-ff21-44ff-9176-ab04c65a3de9";
			const exemploServiceMockResponse = {
				data: undefined,
			};
			const url = `/v1/${id}`;
			const token = "ValidToken";
			when(mockedAxios.get)
				.calledWith(url, undefined)
				.mockResolvedValueOnce(exemploServiceMockResponse);
			const queryData = {
				query: `{character(input:{characterId: "${id}"}) {
						id,
						name
					}}`,
			};
			// when
			const response = await client
				.post("/graphql")
				.set("Content-Type", "application/json;charset=UTF-8")
				.set("authorization-token", token)
				.send(queryData);
			// then
			expect(response.body.errors).not.toBeUndefined();
			expect(response.body.data).toBe(null);
			expect(mockedAxios.get).toHaveBeenNthCalledWith(1, url, undefined);
		});
	});
});
