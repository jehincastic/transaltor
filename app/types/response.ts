type OkResponse<T> = {
	ok: true;
	data: T;
};

type ErrorResponse = {
	ok: false;
	errors: string[];
};

export type ResponseType<T> = OkResponse<T> | ErrorResponse;