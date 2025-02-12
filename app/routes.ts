import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
	layout("layouts/landing.tsx", [
		index("routes/index/page.tsx"),
	]),

	// API routes
	...prefix("api", [
		...prefix("file", [
			route("process", "routes/api/file/process/handler.ts"),
		]),
	]),
] satisfies RouteConfig;
