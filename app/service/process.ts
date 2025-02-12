import AdmZip from "adm-zip";
import path from "node:path";
import os from "node:os";

import type { ProccessResponse } from "~/types/process";

type FileContent = {
	path: string;
	lang: string;
	keys: string[];
	slugs: string[];
	slugPath: string;
	data: Record<string, any>;
};

function getAllKeysFromJSON(
	object: Record<string, any>,
	prefix: string = "",
	keys: string[] = [],
) {
	for (const key in object) {
		if (typeof object[key] === "object") {
			getAllKeysFromJSON(object[key], `${prefix}${key}.`, keys);
		} else if (Array.isArray(object[key])) {
			object[key].forEach((item, index) => {
				if (typeof item === "object") {
					getAllKeysFromJSON(item, `${prefix}${key}.${index}.`, keys);
				} else {
					keys.push(`${prefix}${key}.${index}`);
				}
			});
		} else {
			keys.push(`${prefix}${key}`);
		}
	}

	return keys;
}

function getFileContent(file: AdmZip.IZipEntry): Promise<FileContent> {
	return new Promise((resolve, reject) => {
		file.getDataAsync((json, err) => {
			if (err) {
				reject(err);
				return;
			}
			if (!file.entryName.endsWith(".json")) {
				reject(new Error("Invalid file type"));
				return
			}
			try {
				let filePath = file.entryName;

				// json files at the root level are considered default namespace
				if (file.entryName.split("/").length < 2) {
					filePath = `${filePath.replace(".json", "")}/default.json`;
				}

				const paths = filePath.split("/");
				const jsonData = JSON.parse(json.toString());
				const slugs = paths.slice(1);
				slugs[slugs.length - 1] = slugs[slugs.length - 1].replace(".json", "");
				const slugPrefix = slugs.join(".");
				const lang = paths[0];
				resolve({
					data: jsonData,
					path: file.entryName,
					lang,
					slugs,
					slugPath: slugPrefix,
					keys: getAllKeysFromJSON(jsonData),
				});
			} catch (err) {
				reject(err);
			}
		});
	});
}

function getMissingKeys(
	allLangs: string[],
	keysByPath: Record<string, string[]>,
	allSlugPaths: string[],
	groupedContents: Record<string, Record<string, FileContent>>,
) {
	const missingKeys: Record<string, Record<string, string[]>> = {};
	allLangs.forEach(lang => {
		allSlugPaths.forEach(slugPath => {
			const content = groupedContents?.[lang]?.[slugPath];
			const keys = content?.keys || [];
			const missing = keysByPath[slugPath].filter(k => !keys.includes(k));
			if (missing.length > 0) {
				missingKeys[lang] = missingKeys[lang] || {};
				missingKeys[lang][slugPath] = missing;
			}
		});
	});

	return missingKeys;
}

function getAllKeysBySlugPath(contents: FileContent[]) {
	const keysBySlugPath: Record<string, Set<string>> = {};
	const allSlugPaths = new Set<string>();
	const allLangs = new Set<string>();
	const groupedContents: Record<string, Record<string, FileContent>> = {};
	const countBySlugPath: Record<string, number> = {};
	contents.forEach(c => {
		allSlugPaths.add(c.slugPath);
		allLangs.add(c.lang);
		keysBySlugPath[c.slugPath] = keysBySlugPath[c.slugPath] || new Set();
		c.keys.forEach(k => keysBySlugPath[c.slugPath].add(k));
		groupedContents[c.lang] = groupedContents[c.lang] || {};
		groupedContents[c.lang][c.slugPath] = c;
	});

	return {
		keysByPath: Object.keys(keysBySlugPath).reduce<Record<string, string[]>>((acc, key) => {
			acc[key] = [...keysBySlugPath[key]];
			countBySlugPath[key] = keysBySlugPath[key].size;
			return acc;
		}, {}),
		allSlugPaths: [...allSlugPaths],
		allLangs: [...allLangs],
		groupedContents,
		countBySlugPath,
	};
}

export async function processFile(id: string, extension: string): Promise<ProccessResponse> {
	const zipFilePath = path.join(os.tmpdir(), `${id}.${extension}`);

	const zip = new AdmZip(zipFilePath);
	const entries = zip.getEntries();
	const promArr: Promise<FileContent>[] = [];
	entries.forEach(e => {
		if (e.isDirectory) {
			return;
		}
		promArr.push(getFileContent(e));
	});

	const results = await Promise.all(promArr);
	const {
		allLangs,
		keysByPath,
		allSlugPaths,
		groupedContents,
		countBySlugPath,
	} = getAllKeysBySlugPath(results);

	const missingKeys = getMissingKeys(allLangs, keysByPath, allSlugPaths, groupedContents);

	return {
		keys: missingKeys,
		totalNamespaces: allSlugPaths.length,
		keysPerNamespace: countBySlugPath,
		langs: allLangs,
	};
}
