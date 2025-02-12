import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";

import type { Route } from "./+types/page";
import type { ResponseType } from "~/types/response";
import type { ProccessResponse } from "~/types/process";

import { Button } from "~/components/button";
import { FileUpload } from "~/components/file-upload";
import { ResponseComponent } from "./response";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Landing() {
  const [response, setResponse] = useState<ProccessResponse | null>(null);
  const fetcher = useFetcher<ResponseType<ProccessResponse>>();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (!fetcher.data.ok) {
        toast.error(fetcher.data.errors[0]);
        return; 
      }

      const parsedData = fetcher.data.data;
      setResponse(parsedData);
    }
  }, [fetcher.state]);

  if (response) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Processed Response</h1>
        <ResponseComponent response={response} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Upload Your File</h1>
      <fetcher.Form
        method="POST"
        action="api/file/process"
        encType="multipart/form-data"
        className="flex flex-col items-center"
      >
        <FileUpload
          name="file"
          helper={
            <>
              <p>
                Please upload a ZIP file containing the following directory structure:
              </p>
              <pre>
                - en<br/>
                  |----namespace-1.json<br/>
                  |----namespace-2.json<br/>
                - es<br/>
                  |----namespace-1.json<br/>
                  |----namespace-2.json<br/>
              </pre>
            </>
          }
        />
        <Button type="submit" className="mt-4">
          {fetcher.state != "idle" ? "Uploading..." : "Upload And Process"}
        </Button>
      </fetcher.Form>
    </div>
  );
}
