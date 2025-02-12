import { useState } from "react";
import { toast } from "sonner";

import type { ProccessResponse } from "~/types/process";
import { Card } from "~/components/card";
import { Dropdown } from "~/components/dropdown";
import { trimText } from "~/utils/text";
import { Tooltip } from "~/components/tooltip";

type ResponseComponentProps = {
	response: ProccessResponse;
}

function MissingKeys({ response }: ResponseComponentProps) {
  const [values, setValues] = useState({
    language: response.langs[0],
    namespace: Object.keys(response.keysPerNamespace)[0],
  });

  const totalKeysForNamespace = response.keysPerNamespace[values.namespace];
  const missingKeys = response.keys?.[values.language]?.[values.namespace] ?? [];
  function copyText(val: string) {
    navigator.clipboard.writeText(val).then(() => {
      toast("Text copied to clipboard", { position: "top-center" });
    }).catch(err => {
      console.error("Failed to copy text: ", err);
    });
  };

  return (
    <>
      <div className="flex justify-between w-full mt-4 items-center">
        <div>
          <p className="font-bold mb-1">
            {totalKeysForNamespace - missingKeys.length}/{totalKeysForNamespace} Completed
          </p>
          <p className="font-bold">
            {missingKeys.length}/{totalKeysForNamespace} Missing
          </p>
        </div>
        <div className="flex">
          <Dropdown
            noEmpty
            name="language"
            label="Language"
            className="min-w-[100px]"
            options={response.langs}
            defaultValue={values.language}
            onChange={(newVal) => setValues({ ...values, language: newVal })}
          />
          <Dropdown
            noEmpty
            name="namespace"
            label="Namespace"
            className="min-w-[150px] ml-3"
            options={Object.keys(response.keysPerNamespace  )}
            defaultValue={values.namespace}
            onChange={(newVal) => setValues({ ...values, namespace: newVal })}
          />
        </div>
      </div>
      {
        missingKeys.length
          ? (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 cursor-pointer">
              {missingKeys.map(key => (
                <div
                  key={key}
                  onClick={() => copyText(`"${key}"`)}
                  className="p-2 border rounded"
                >
                  <Tooltip content={`"${key}"`}>
                    {trimText(key, 25)}
                  </Tooltip>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center">
              <p className="text-xl font-bold">All keys are added</p>
            </div>
          )
      }
    </>
  )
}

export function ResponseComponent({ response }: ResponseComponentProps) {
  const { langs, totalNamespaces, keysPerNamespace } = response;
  const totalKeys = Object.values(keysPerNamespace).reduce((acc, val) => acc + val, 0);
  const completedLangs = langs.length - Object.keys(response.keys).length;

	let keysToBeCompleted = 0;
	Object.values(response.keys).forEach(lng => {
		Object.values(lng).forEach(namespace => {
			keysToBeCompleted += namespace.length;
		});
	});

	const percentageCompleted = ((((totalKeys * langs.length) - keysToBeCompleted) / (totalKeys * langs.length)) * 100).toFixed(2);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Languages" value={langs.length} />
        <Card title="Namespaces" value={totalNamespaces ?? 0} />
        <Card
          title="Translation Pending"
          value={`${keysToBeCompleted}/${totalKeys * langs.length}`}
          tooltip={`${percentageCompleted}% Completed`}
        />
        <Card title="Completed Lang" value={completedLangs} />
      </div>
      <MissingKeys response={response} />
    </>
  );
}