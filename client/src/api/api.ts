class ApiError extends Error {
  constructor(public status: number, public data: Record<string, unknown>) {
    super();
  }
}

export default async function fetchApi<T>(
  url: string,
  {
    payload,
    method,
  }: { payload?: Record<string, unknown>; method?: string } = {}
): Promise<T> {
  const request: RequestInit = {
    method: (method ??= payload ? "POST" : "GET"),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: payload ? JSON.stringify(payload) : undefined,
  };

  const response = await fetch(`http://localhost:4000/api${url}`, request);

  const json = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, json);
  }

  if (json.success && json.data) {
    console.log(json.message);
    return json.data as T;
  }

  // S'il y a pas de data on return tout le json
  return json;
}
