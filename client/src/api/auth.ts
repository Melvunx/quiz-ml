import fetchApi from "./api";

export const getAccessToken = async () =>
  await fetchApi("/auth/refresh", { method: "POST" });
