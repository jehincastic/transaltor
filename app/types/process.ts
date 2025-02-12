export type ProccessResponse = {
	keys: Record<string, Record<string, string[]>>;
	totalNamespaces: number;
	keysPerNamespace: Record<string, number>;
	langs: string[];
}