import { FeatureFlag, FeatureFlagValue } from "jbootcaba/config";
import Joi from "joi";

export type FeatureFlags = {
	SESSION_VALIDATION_FEATURE: FeatureFlagValue;
};

export const FeatureFlagSchema: Joi.SchemaMap<FeatureFlags> = {
	SESSION_VALIDATION_FEATURE: FeatureFlag(),
};
