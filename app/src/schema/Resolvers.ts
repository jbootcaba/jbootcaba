import { NonEmptyArray } from "type-graphql";
import { SettlementsResolver } from "./settlements/Resolver";
// eslint-disable-next-line @typescript-eslint/ban-types
export const Resolvers: NonEmptyArray<Function> = [SettlementsResolver];
