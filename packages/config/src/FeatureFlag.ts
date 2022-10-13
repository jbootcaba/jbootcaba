import Joi, { CustomHelpers } from "joi";

const FeatureFlagSchema = Joi.object({
	id: Joi.string().required(),
	enabled: Joi.bool().required(),
	description: Joi.string().optional().empty("").default(""),
	displayName: Joi.string().optional().empty("").default(""),
	conditions: Joi.object({
		clientFilters: Joi.array().required(),
	}).required(),
	IsEnabled: Joi.function().required(),
})
	.unknown(false)
	.options({
		abortEarly: false,
		stripUnknown: { arrays: false, objects: true },
	});

export type UserFeature = {
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
const defaultValue = {
	id: "",
	enabled: false,
	description: "",
	displayName: "",
	conditions: {
		clientFilters: [],
	},
	IsEnabled: (user?: Partial<UserFeature>) =>
		FeatureFilter.IsEnabled(defaultValue, user),
};
const FeatureFlagParser = (value?: string) => {
	if (!value) {
		return defaultValue;
	}
	const jsonFeatureFlagValue = JSON.parse(value);
	const featureFlag: FeatureFlagValue = Object.assign<any, FeatureFlagValue>(
		{},
		{
			id: jsonFeatureFlagValue.id,
			enabled: jsonFeatureFlagValue.enabled,
			description: jsonFeatureFlagValue.description,
			displayName: jsonFeatureFlagValue.display_name,
			conditions: {
				clientFilters: jsonFeatureFlagValue.conditions.client_filters,
			},
			IsEnabled: (user?: Partial<UserFeature>) =>
				FeatureFilter.IsEnabled(featureFlag, user),
		}
	);
	const validation = FeatureFlagSchema.validate(featureFlag, {
		convert: true,
	});
	if (validation.error) {
		const errors = validation.error.details
			.map((it) => it.message)
			.join("\r\n");
		throw Error(`Configuration can\`t be loaded Erros: \r\n ${errors}`);
	}
	return validation.value;
};

export const FeatureFlag = () =>
	Joi.custom(FeatureFlagParser).default((parent, helpers: CustomHelpers) => {
		const id = (<any>helpers.state.path).join("_");
		return Object.assign<any, FeatureFlagValue, Partial<FeatureFlagValue>>(
			{},
			defaultValue,
			{
				id: id,
				description: id,
				displayName: id,
			}
		);
	});

type TargetFilter = {
	Audience: {
		Groups: Array<{ Name: string; RolloutPercentage: number }>;
		Users: Array<string>;
		DefaultRolloutPercentage: number;
	};
};

type WindowFilter = {
	End: string;
	Start: string;
};

enum Type {
	Target = "Microsoft.Targeting",
	TimeWindow = "Microsoft.TimeWindow",
	Percentage = "Microsoft.Percentage",
}
type ClientFilter = {
	name: string;
	parameters?: Record<string, unknown>;
};
class FeatureFilter {
	private static CalcPercentagem(rolloutPercentage: number) {
		return Math.floor(Math.random() * 100) <= rolloutPercentage;
	}
	private static CheckPercent(clientFilter: ClientFilter): boolean {
		const rolloutPercentage = <number>clientFilter.parameters?.Value || 0;
		return this.CalcPercentagem(rolloutPercentage);
	}
	private static CheckClientTarget(
		clientFilter: ClientFilter,
		user?: Partial<UserFeature>
	) {
		const target: TargetFilter = <any>clientFilter.parameters;
		if (user) {
			if (target.Audience.Users.includes(user.userId ?? "")) return true;
			const group = target.Audience.Groups.find((it) =>
				user.groups?.includes(it.Name)
			);
			if (group) {
				return this.CalcPercentagem(group.RolloutPercentage);
			}
		}
		return this.CalcPercentagem(target.Audience.DefaultRolloutPercentage);
	}

	private static CheckTimeWindow(clientFilter: ClientFilter) {
		// Changes the start time
		const filter: WindowFilter = <any>clientFilter.parameters;
		const startDate = new Date(filter.Start);
		const endDate = new Date(filter.End);
		const now = new Date();
		return startDate < now && now < endDate;
	}

	static IsEnabled(
		feature?: FeatureFlagValue,
		user?: Partial<UserFeature>
	): boolean {
		if (!feature || !feature.enabled) return false;
		for (const clientFilter of feature.conditions.clientFilters) {
			clientFilter.parameters = clientFilter.parameters ?? {};
			switch (clientFilter.name) {
				// Tweak the client filters of the feature flag
				case Type.Target:
					return this.CheckClientTarget(clientFilter, user);
				case Type.TimeWindow:
					return this.CheckTimeWindow(clientFilter);
				case Type.Percentage:
					// Changes the percentage value from 50 to 75 - to enable the feature flag for 75% of requests
					return this.CheckPercent(clientFilter);
				default:
					// Change the filter name for all other client filters
					// clientFilter.name = "FilterY";
					return false;
			}
		}
		return feature.enabled;
	}
}
