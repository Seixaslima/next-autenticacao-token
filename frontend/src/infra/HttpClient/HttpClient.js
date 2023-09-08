import { tokenService } from "../../service/auth/tokenService";
import nookies from "nookies";

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

      const isServer = Boolean(fetchOptions?.ctx);
      const currentRefreshToken =
        fetchOptions?.ctx?.req?.cookies["REFRESH_TOKEN_NAME"];

      console.log("Middleware: atualizar token");

      try {
        // [tentar atualizar o token]
        const refreshResponse = await HttpClient(
          "http://localhost:3000/api/refresh",
          {
            method: isServer ? "PUT" : "GET",
            body: isServer ? { refresh_token: currentRefreshToken } : undefined,
          }
        );
        const newAccessToken = refreshResponse.body.data.access_token;
        const newRefreshToken = refreshResponse.body.data.refresh_token;

        // [guardar os tokens novos]
        if (isServer) {
          nookies.set(fetchOptions.ctx, "REFRESH_TOKEN_NAME", newRefreshToken, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
          });
        }

        tokenService.save(newAccessToken);
        // [tentar rodar request anterior]
        const retryResponse = await fetch(fetchURL, {
          ...options,
          refresh: false,
          headers: {
            authorization: `Bearer ${newAccessToken}`,
          },
        });
        return {
          ok: retryResponse.ok,
          status: retryResponse.status,
          statusText: retryResponse.statusText,
          body: await retryResponse.json(),
        };
      } catch (err) {
        console.error(err);
        return resposta;
      }
    });
}
