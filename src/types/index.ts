export enum CircleType {
	correct,
	incorrect,
	wrong_position
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
