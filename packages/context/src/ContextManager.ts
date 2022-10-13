import cls from "cls-hooked";

export type IContextManager = cls.Namespace;
export class ContextManager {
	private static namespace: IContextManager;

	public static get Context(): IContextManager {
		if (ContextManager.namespace) return ContextManager.namespace;
		throw new Error(
			"ContextManager is not initialized. Call ContextManager.init() beforer use."
		);
	}

	public static Init(id?: string) {
		this.namespace =
			this.namespace || cls.createNamespace(id || Math.random().toFixed(13));
	}
}
