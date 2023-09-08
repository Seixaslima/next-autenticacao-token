import { tokenService } from "../../service/auth/tokenService";

export async function HttpClient(fetchURL, fetchOptions) {
  const options = {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : null,
  };
  return fetch(fetchURL, options)
    .then(async (respostaServidor) => {
      return {
        ok: respostaServidor.ok,
        status: respostaServidor.status,
        statusText: respostaServidor.statusText,
        body: await respostaServidor.json(),
      };
    })
    .then(async (resposta) => {
      if (!fetchOptions.refresh) return resposta;
      if (resposta.status !== 401) return resposta;
      console.log("Middleware: atualizar token");

      // [tentar atualizar o token]
      const refreshResponse = await HttpClient(
        "http://localhost:3000/api/refresh",
        {
          method: "GET",
        }
      );
      const newAccessToken = refreshResponse.body.data.access_token;
      const newRefreshToken = refreshResponse.body.data.refresh_token;

      // [guardar os tokens novos]
      tokenService.save(newAccessToken);

      // [tentar rodar request anterior]
      const retryResponse = await fetch(fetchURL, {
        ...options,
        refresh: false,
        headers: {
          authorization: `Bearer ${newAccessToken}`,
        },
      });

      console.log(retryResponse);
      return {
        ok: retryResponse.ok,
        status: retryResponse.status,
        statusText: retryResponse.statusText,
        body: await retryResponse.json(),
      };
    });
}
