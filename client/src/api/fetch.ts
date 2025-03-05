const { VITE_BACKEND_URL } = import.meta.env;

const refreshToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${VITE_BACKEND_URL}/api/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        await response.json(),
        "Failed to refresh token"
      );
    }

    const { accessToken } = await response.json();
    console.log("The access token after refreshing ", accessToken);

    return accessToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

type ApiDataError = {
  success: false;
  message: string;
  error: string;
  stack?: string;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: ApiDataError,
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

  console.log({ accessToken });

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

  let r = await fetch(`${VITE_BACKEND_URL}/api${url}`, requestOptions);

  if (requiresToken && r.status === 401) {
    try {
      const newAccessToken = await refreshToken();

      if (!newAccessToken) {
        if (setAccessToken) setAccessToken(null);
        if (navigate) navigate("/auth");
        throw new ApiError(r.status, await r.json(), "Failed to refresh token");
      }

      console.log("The new access token ", newAccessToken);

      if (setAccessToken) setAccessToken(newAccessToken);

      requestOptions.headers = {
        ...requestOptions.headers,
        Authorization: `Bearer ${newAccessToken}`,
      };

      r = await fetch(`${VITE_BACKEND_URL}/api${url}`, requestOptions);
    } catch (error) {
      if (setAccessToken) setAccessToken(null);
      if (navigate) navigate("/auth");
      throw error;
    }
  }

  if (r.status === 403) {
    if (navigate) navigate("/quiz-dashboard");
    throw new ApiError(r.status, await r.json(), "You don't have the rights");
  }

  const json = await r.json();

  if (!r.ok) {
    throw new ApiError(r.status, json);
  }

  console.log("The json after fetching ", json);

  return json.success && json.data
    ? (JSON.parse(json.data) as T)
    : (json.message as T);
};

export default fetchApi;
