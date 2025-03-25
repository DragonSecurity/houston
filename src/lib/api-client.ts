import {toast} from "sonner";

interface FetchOptions extends RequestInit {
	baseUrl?: string
	throwOnError?: boolean
	showErrorToast?: boolean
}

/**
 * Enhanced fetch function with error handling and toast notifications
 */
export async function fetchApi<T>(url: string, options: FetchOptions = {}): Promise<T> {
	const { baseUrl = "", throwOnError = true, showErrorToast = true, ...fetchOptions } = options

	const fullUrl = `${baseUrl}${url}`

	try {
		const response = await fetch(fullUrl, {
			headers: {
				"Content-Type": "application/json",
				...fetchOptions.headers,
			},
			...fetchOptions,
		})

		if (!response.ok) {
			// Try to parse error message from response
			let errorMessage = `Error: ${response.status} ${response.statusText}`
			try {
				const errorData = await response.json()
				if (errorData.error || errorData.message) {
					errorMessage = errorData.error || errorData.message
				}
			} catch (e) {
				// Ignore JSON parsing errors
			}

			if (showErrorToast) {
				toast.error("Error",{
					description: errorMessage,
				})
			}

			if (throwOnError) {
				throw new Error(errorMessage)
			}

			return { error: errorMessage } as T
		}

		return await response.json()
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

		if (showErrorToast) {
			toast.error("Error",{
				description: errorMessage,
			})
		}

		if (throwOnError) {
			throw error
		}

		return { error: errorMessage } as T
	}
}

/**
 * API client with methods for common operations
 */
export const apiClient = {
	get: <T>(url: string, options?: FetchOptions) =>
		fetchApi<T>(url, { method: 'GET', ...options }),

	post: <T>(url: string, data: any, options?: FetchOptions) =>
		fetchApi<T>(url, {
			method: 'POST',
			body: JSON.stringify(data),
			...options
		}),

	put: <T>(url: string, data: any, options?: FetchOptions) =>
		fetchApi<T>(url, {
			method: 'PUT',
			body: JSON.stringify(data),
			...options
		}),

	patch: <T>(url: string, data: any, options?: FetchOptions) =>
		fetchApi<T>(url, {
			method: 'PATCH',
			body: JSON.stringify(data),
			...options
		}),

	delete: <T>(url: string, options?: FetchOptions) =>
		fetchApi<T>(url, { method: 'DELETE', ...options }),
}

