
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
};

async function request<T>(url: string, config: RequestInit): Promise<T> {

  const token = localStorage.getItem('authToken');
  const headers = new Headers(config.headers || DEFAULT_HEADERS);
  
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }


  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...config,
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.message || `Request failed: ${response.statusText}`
      };
    }

    return response.json() as Promise<T>;
  } catch (error) {
  const err = error as { message?: string };
  alert(err.message || 'Unknown error');
  throw err;
}
  
}


const api = {
  get: <T>(url: string) => request<T>(url, { method: 'GET' }),
  
  post: <T>(url: string, data: unknown) => 
    request<T>(url, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  put: <T>(url: string, data: unknown) => 
    request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  
  delete: <T>(url: string) => 
    request<T>(url, { method: 'DELETE' })
};

export default api;