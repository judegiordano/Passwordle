import { NEXT_PUBLIC_DOMAIN } from "@services/config";
import { IApiResponse, HttpMethod } from "@types";

export class Rest {

	public static async Post<T>(url: string, json: T) {
		const body = JSON.stringify(json);
		const response = await fetch(`${NEXT_PUBLIC_DOMAIN}/api/${url}`, { method: HttpMethod.POST, body });
		const data = await response.json();
		return data as IApiResponse;
	}
}
