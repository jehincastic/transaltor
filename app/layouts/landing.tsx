import { Outlet } from "react-router";
import { Toaster } from "sonner";

export default function LandingLayout() {
	return (
		<>
			<Toaster />
			<Outlet />
		</>
	);
}
