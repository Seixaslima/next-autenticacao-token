export async function HttpClient(fetchURL, fetchOptions) {
  const options = {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : null,
  };
  return fetch(fetchURL, options).then(async (respostaServidor) => {
    return {
      ok: respostaServidor.ok,
      body: await respostaServidor.json(),
    };
  });
}
