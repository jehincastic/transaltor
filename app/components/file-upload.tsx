import React, { useState } from "react";
import { HelpCircle } from "lucide-react";

import { ACCEPTED_FILE_TYPES } from "~/config";
import { Button } from "./button";
import { Tooltip } from "./tooltip";

type FileUpload = {
  name: string;
  helper?: React.ReactNode;
}

export function FileUpload({ name, helper }: FileUpload) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && ACCEPTED_FILE_TYPES.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError("Please upload a zip file.");
    }
  };

  return (
    <div className="max-w-lg w-full mx-auto p-8 bg-white rounded-lg border-dashed border-2 border-gray-300">
      <div className="flex self-center mb-4">
        <label className="block text-lg font-medium text-gray-700">Upload File</label>
        {
          helper && (
            <>
              &nbsp;
              <Tooltip position="top" content={helper}>
                <HelpCircle className="w-3 h-3" />
              </Tooltip>
            </>
          )
        }
      </div>
      <div
        onClick={() => inputRef.current?.click()}
        className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
      >
        {
          file ? (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">File selected:</span>&nbsp;
                {file.name}
              </p>
              <Button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Replace file
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">
                  Click to upload
                </span>
                {/* &nbsp;or drag and drop */}
              </p>
              <p className="text-xs text-gray-500">ZIP files only</p>
            </div>
          )
        }
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          name={name}
          accept=".zip"
          ref={inputRef}
        />
      </div>
      {error && <p className="mt-4 text-lg text-red-600">{error}</p>}
    </div>
  );
}
