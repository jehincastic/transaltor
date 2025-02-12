import fs from "node:fs";
import path from "node:path";
import os from "node:os";

import { pipelinePromise, streamToNodeReadable } from "~/utils/stream";
import { validateUpload } from "~/utils/upload";
import { handleError, handleMethodNotAllowed } from "~/utils/error";
import type { Route } from "./+types/handler";
import { processFile } from "~/service/process";

export function loader({ request }: Route.LoaderArgs) {
	return handleMethodNotAllowed(request, [])
}

export async function action({ request }: Route.ActionArgs) {
	const isInvalidMethod = handleMethodNotAllowed(request, ["POST"]);
	if (isInvalidMethod) {
		return isInvalidMethod;
	}

	let filePath = "";
	try {
		const formData = await request.formData();
		const inputFile = formData.get("file");

		const [file, error, fileExtension] = await validateUpload(inputFile);
		if (error != null) {
			return Response.json({ ok: false, errors: [error] }, { status: 400 });
		}

		const fileId = crypto.randomUUID();
		const fileName = `${fileId}.${fileExtension}`;
		filePath = path.join(os.tmpdir(), fileName);
		const writableStream = fs.createWriteStream(filePath);
		const readableStream = streamToNodeReadable(file.stream());

		await pipelinePromise(readableStream, writableStream);

		const missingKeys = await processFile(fileId, fileExtension);

		return Response.json({
			ok: true,
			data: missingKeys,
		});
	} catch (error) {
		return handleError(error);
	} finally {
		if (filePath) {
			await fs.promises.rm(filePath, { force: true });
		}
	}
}
