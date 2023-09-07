import { useRouter } from "next/router";
import { authService } from "./authService";
import { useEffect, useState } from "react";

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

function useSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    authService
      .getSession()
      .then((useSession) => {
        setSession(useSession);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    loading,
    error,
    data: {
      ...session,
    },
  };
}

export function withSessionHOC(Component) {
  return function wrapper(props) {
    const { loading, error, data } = useSession();
    const router = useRouter();

    if (!loading && error) {
      console.log("redirecionar para home");
      router.push("/?err=401");
    }

    const propsModificada = {
      ...props,
      session: data,
    };

    return <Component {...propsModificada} />;
  };
}
