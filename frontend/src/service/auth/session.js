import { authService } from "./authService";

export function withSession(funcao) {
  return async (ctx) => {
    try {
      const session = await authService.getSession(ctx);
      const ctxModificado = {
        ...ctx,
        req: {
          ...ctx.req,
          session,
        },
      };
      return funcao(ctxModificado);
    } catch {
      return {
        redirect: {
          permanent: false,
          destination: "/?err=401",
        },
      };
    }
  };
}
