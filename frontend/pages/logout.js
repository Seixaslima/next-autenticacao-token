import React from "react";
import { useRouter } from "next/router";
import { tokenService } from "../src/service/auth/tokenService";
import { HttpClient } from "../src/infra/HttpClient/HttpClient";

export default function logout() {
  const router = useRouter();

  React.useEffect(() => {
    tokenService.delete();
    HttpClient("/api/refresh", {
      method: "DELETE",
    });
    router.push("/");
  }, []);
  return (
    <div>
      <p>Você sera redirecionado em breve</p>
    </div>
  );
}
