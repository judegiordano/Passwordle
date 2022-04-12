export type RequestBody = { token: string, password: string, attempt: number };

export type PasswordLookup = {
	[key: string]: number[]
}

export enum CircleType {
	correct,
	incorrect,
	wrong_position
}

export enum HttpMethod {
	GET = "GET",
	POST = "POST",
	PATCH = "PATCH",
	PUT = "PUT",
	DELETE = "DELETE",
	OPTIONS = "OPTIONS"
}

export type Guesses = { type: CircleType }

export interface IApiResponse {
	ok: boolean
	error?: string | null
	data?: {
		correct: boolean
		hash: string
		password: string
		positions: Guesses[]
	}
}
