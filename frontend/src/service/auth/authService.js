import { HttpClient } from "../../infra/HttpClient/HttpClient";
import { tokenService } from "./tokenService";

export const authService = {
  async login({ username, password }) {
    return HttpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
      method: "POST",
      body: {
        username: username,
        password: password,
      },
    })
      .then(async (respostaServidor) => {
        if (!respostaServidor.ok)
          throw new Error("Usuário ou senha inválidos!");
        const body = respostaServidor.body;

        tokenService.save(body.data.access_token);

        return body;
      })
      .then(async ({ data }) => {
        const { refresh_token } = data;

        const resposta = await HttpClient("/api/refresh", {
          method: "POST",
          body: {
            refresh_token,
          },
        });
        console.log(resposta);
      });
  },
  async getSession(ctx = null) {
    const token = tokenService.get(ctx);
    return HttpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/session`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
      ctx,
      refresh: true,
    }).then((resposta) => {
      if (!resposta.ok) throw new Error("Não autorizado!");
      return {
        ...resposta.body.data,
      };
    });
  },
};
