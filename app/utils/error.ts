export function handleError(error: unknown) {
	if (error instanceof TypeError && error.message.startsWith("Content-Type was not one of")) {
		return Response.json({ ok: false, errors: ["content.type"] }, { status: 400 });
	}

	console.error(error);
	return Response.json({ ok: false, errors: ["internal.error"] }, { status: 500 });
}

export function handleMethodNotAllowed(request: Request, allowedMethods: string[]) {
	if (allowedMethods.includes(request.method.toUpperCase())) {
		return;
	}
	return Response.json({ ok: false, errors: ["Method not allowed"] }, { status: 405 });
}