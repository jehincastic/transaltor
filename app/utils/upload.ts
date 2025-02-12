import { fileTypeFromStream } from "file-type";

import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "~/config";

export async function validateUpload(file: FormDataEntryValue | null): Promise<[null, string, null] | [File, null, string]> {
	if (!file) {
		return [null, "File is required", null];
	}

	if (!(file instanceof Blob)) {
		return [null, "Invalid file uploaded", null];
	}

	if (file.size > MAX_FILE_SIZE) {
		return [null, "File size should be less than 10MB", null];
	}

	if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
		return [null, "Invalid file uploaded", null];
	}

	const fileStream = file.stream();
	const mimeType = await fileTypeFromStream(fileStream);
	if (!mimeType || !ACCEPTED_FILE_TYPES.includes(mimeType.mime)) {
		return [null, "Invalid file uploaded", null];
	}

	return [file, null, mimeType.ext];
}