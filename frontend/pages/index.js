import { useState } from "react";
import { useRouter } from "next/router";
import { authService } from "../src/service/auth/authService";

export default function HomeScreen() {
  const router = useRouter();
  const [values, setValues] = useState({
    usuario: "omariosouto",
    password: "safepassword",
  });

  function handleChange(event) {
    const fieldValue = event.target.value;
    const fieldName = event.target.name;

    setValues((previusValue) => {
      return {
        ...previusValue,
        [fieldName]: fieldValue,
      };
    });
  }

  return (
    <div>
      <h1>Login</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          authService
            .login({
              username: values.usuario,
              password: values.password,
            })
            .then(() => {
              router.push("/auth-page-ssr");
              // router.push("/auth-page-static");
            })
            .catch(() => {
              alert("Usuário ou a senha estão inválidos");
            });
        }}
      >
        <input
          placeholder="Usuário"
          name="usuario"
          value={values.usuario}
          onChange={handleChange}
        />
        <input
          placeholder="Senha"
          name="senha"
          type="password"
          value={values.password}
          onChange={handleChange}
        />
        <div>
          <button>Entrar</button>
        </div>
        {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
      </form>
    </div>
  );
}
