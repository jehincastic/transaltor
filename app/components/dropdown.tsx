import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, XIcon } from "lucide-react";
import clsx from "clsx";

type DropdownProps = {
  label: string;
  name?: string;
  value?: string;
  onChange?: (val: string) => void;
  required?: boolean;
  options: string[];
  className?: string;
  optionClass?: string;
  defaultValue?: string;
  placeholder?: string;
  noEmpty?: boolean;
};

export function Dropdown({
  label, name, options,
  className, defaultValue,
  placeholder, required,
  optionClass, noEmpty,
  onChange: handleOptionChange,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(defaultValue || "");

  function handleToggle() {
    setIsOpen(!isOpen);
  }

  function handleClear() {
    setValue("");
  }

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setValue(e.target.value);
    handleOptionChange?.(e.target.value);
  }

  return (
    <div className={clsx("relative", className)}>
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onClick={handleToggle}
          onBlur={() => setIsOpen(false)}
        >
          {
            !noEmpty && (
              placeholder
                ? <option className={optionClass} value="" disabled>{placeholder}</option>
                : <option className={optionClass} value="" disabled>Select an option</option>
            )
          }
          {options.map((option) => (
            <option className={optionClass} key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          {isOpen ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
        </div>
        {value && !noEmpty && (
          <button
            type="button"
            className="absolute inset-y-0 right-8 flex items-center pr-2"
            onClick={handleClear}
          >
            <XIcon className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
}