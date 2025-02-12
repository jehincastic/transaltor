import React from "react";
import { Tooltip } from "./tooltip";

interface CardProps {
  title: string;
  value: string | number;
  tooltip?: string;
}

export function Card({ title, value, tooltip }: CardProps) {
  return (
    <div className="border border-gray-300 p-6 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {
        tooltip ? (
          <Tooltip content={tooltip}>
            <p className="text-xl font-light cursor-default">{value}</p>
          </Tooltip>
        ) : (
          <p className="text-xl font-light cursor-default">{value}</p>
        )
      }
    </div>
  );
}
