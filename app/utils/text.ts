export function trimText(text: string, size = 20) {
	if (text.length <= size) {
		return text;
	}
	return text.slice(0, size - 3) + "...";
}