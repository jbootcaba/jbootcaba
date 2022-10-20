import { interfaces } from "inversify";
import { DecoratorTarget } from "inversify/lib/annotation/decorator_utils";
export declare function loggerFactory(): (target: DecoratorTarget<unknown>, propertyKey: string | symbol, parameterIndex: number) => void;
export declare function logger(): (target: DecoratorTarget<unknown>, propertyKey: string | symbol, parameterIndex: number) => void;
export declare function loggerAdapter(): (target: DecoratorTarget<unknown>, propertyKey: string | symbol, parameterIndex: number) => void;
export declare function config(): (target: DecoratorTarget<unknown>, propertyKey: string | symbol, parameterIndex: number) => void;
export declare const provideSingleton: <T>(identifier: interfaces.ServiceIdentifier<T>) => (target: any) => any;
//# sourceMappingURL=Decorators.d.ts.map