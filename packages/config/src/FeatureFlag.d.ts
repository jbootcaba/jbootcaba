import Joi from "joi";
export declare type UserFeature = {
    userId: string;
    groups: Array<string>;
};
export interface FeatureFlagValue {
    /**
     * Id for the feature flag.
     */
    id?: string;
    /**
     * A Feature filter consistently evaluates the state of a feature flag.
     * Our feature management library supports three types of built-in filters: Targeting, TimeWindow, and Percentage.
     * Custom filters can also be created based on different factors, such as device used, browser types, geographic location, etc.
     *
     * [More Info](https://docs.microsoft.com/en-us/azure/azure-app-configuration/howto-feature-filters-aspnet-core)
     */
    conditions: {
        clientFilters: {
            name: string;
            parameters?: Record<string, unknown>;
        }[];
    };
    /**
     * Description of the feature.
     */
    description?: string;
    /**
     * Boolean flag to say if the feature flag is enabled.
     */
    enabled: boolean;
    /**
     * Display name for the feature to use for display rather than the ID.
     */
    displayName?: string;
    IsEnabled: (user?: Partial<UserFeature>) => boolean;
}
export declare const FeatureFlag: () => Joi.AnySchema<any>;
//# sourceMappingURL=FeatureFlag.d.ts.map