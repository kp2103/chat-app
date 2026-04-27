const BASE_URL = 'http://localhost:4000/api/v1';

async function handleApiRequest<T>(
	endpoint: string,
	{ body, ...customConfig }: RequestInit = {},
): Promise<T> {
	const headers = { 'Content-Type': 'application/json' };

	const config: RequestInit = {
		method: body ? 'POST' : 'GET',
		...customConfig,
		headers: {
			...headers,
			...customConfig.headers,
		},
	};

	if (body) {
		config.body = JSON.stringify(body);
	}

	const response = await fetch(`${BASE_URL}/${endpoint}`, config);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message);
	}

	return await response.json();
}

export { handleApiRequest };
