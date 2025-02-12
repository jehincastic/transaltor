import clsx from "clsx";
import React from "react";

type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "bottom";
};

export function Tooltip({ content, children, position = "bottom" }: TooltipProps) {
  return (
    <div className="relative group">
      {children}
      <div
        className={
          clsx(
            "absolute left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-xs p-2 bg-gray-800 text-white text-xs rounded opacity-0 hidden group-hover:opacity-100 group-hover:block transition-opacity duration-300 z-10",
            position === "top" && "top-full",
            position === "bottom" && "bottom-full"
          )
        }
      >
        {content}
      </div>
    </div>
  );
}
