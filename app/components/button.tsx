import React, { type MouseEventHandler } from "react";
import { Link } from "react-router";
import clsx from "clsx";

type ButtonProps = {
	to?: string;
	variant?: "primary" | "secondary" | "danger";
	children: React.ReactNode;
	className?: string;
	iconButton?: boolean;
	onClick?: (e: MouseEventHandler<HTMLButtonElement>) => void | Promise<void>;
	type?: "button" | "submit" | "reset";
	prefix?: React.ComponentType<{ className: string }>;
}

function RenderChildren ({
	children, prefix: Prefix
}: {
	children: React.ReactNode;
	prefix?: React.ComponentType<{ className: string }>;
}) {
	if (!Prefix) {
		return children;
	}

	return (
		<span className="flex items-center">
			<Prefix className="h-5 w-5" />&nbsp;
			{children}
		</span>
	);
}

function ButtonComp({
	children, type,
	prefix: Prefix,
	iconButton = false,
	variant = "primary",
	className = "",
}: ButtonProps) {
	return (
		<button
			className={clsx(
				"px-4 py-2 font-semibold text-sm rounded-md hover:cursor-pointer transition-transform transform",
				variant === "primary" && "bg-blue-500 text-white hover:bg-blue-700",
				variant === "secondary" && "bg-gray-500 text-white hover:bg-gray-700",
				variant === "danger" && "bg-red-500 text-white hover:bg-red-700",
				"active:translate-y-0.5 active:shadow-none",
				iconButton && "!bg-transparent !px-2",
				className,
			)}
			type={type}
		>
			<RenderChildren prefix={Prefix}>
				{children}
			</RenderChildren>
		</button>
	);
}

export function Button(props: ButtonProps) {
	const { to } = props;
	if (to) {
		return (
			<Link to={to}>
				<ButtonComp {...props} />
			</Link>
		);
	}

	return <ButtonComp {...props} />;
}