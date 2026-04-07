export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9000";

type ApiOptions = {
  token?: string | null;
};

function headers(token?: string | null) {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function apiGet<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: headers(options.token),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  options: ApiOptions = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: headers(options.token),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

export async function apiDelete<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    headers: headers(options.token),
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}
