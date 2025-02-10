const refreshToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(
      "http://localhost:4000/api/auth/refresh-token",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new ApiError(
        response.status,
        await response.json(),
        "Failed to refresh token"
      );
    }

    const { accessToken } = await response.json();
    return accessToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: {
      success: false;
      message: string;
      error: Error | string;
      stack?: string;
    },
    message?: string
  ) {
    super(message || data.message);
    this.name = `Api error whith status ${status}`;

    if (data.error) {
      this.message += `
Error details: ${JSON.stringify(data.error, null, 2)}`;
    }

    if (data.stack) {
      this.stack = data.stack;
    }
  }
}
const fetchApi = async <T>(
  url: string,
  {
    payload,
    method,
    headers = {},
    navigate,
    requiresToken = false,
    accessToken,
    setAccessToken,
  }: {
    payload?: Record<string, unknown>;
    method?: string;
    headers?: Record<string, string>;
    navigate?: (path: string) => void;
    requiresToken?: boolean;
    accessToken?: string | null;
    setAccessToken?: (token: string | null) => void;
  } = {}
): Promise<T> => {
  method = method || (payload ? "POST" : "GET");

  if (requiresToken && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const requestOptions: RequestInit = {
    method,
    credentials: "include",
    body: payload ? JSON.stringify(payload) : undefined,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
  };

  let r = await fetch(`http://localhost:4000/api${url}`, requestOptions);

  if (requiresToken && r.status === 401) {
    try {
      const newAccessToken = await refreshToken();

      if (!newAccessToken) {
        if (setAccessToken) setAccessToken(null);
        if (navigate) navigate("/auth");
        throw new ApiError(r.status, await r.json(), "Failed to refresh token");
      }

      if (setAccessToken) setAccessToken(newAccessToken);

      requestOptions.headers = {
        ...requestOptions.headers,
        Authorization: `Bearer ${newAccessToken}`,
      };

      r = await fetch(`http://localhost:4000/api${url}`, requestOptions);
    } catch (error) {
      if (setAccessToken) setAccessToken(null);
      if (navigate) navigate("/auth");
      throw error;
    }
  }

  const json = await r.json();

  if (!r.ok) {
    throw new ApiError(r.status, json);
  }

  console.log("The json after fetching ", json);

  return json.success && json.data ? (json.data as T) : (json.message as T);
};

export default fetchApi;
