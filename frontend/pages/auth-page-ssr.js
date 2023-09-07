import { tokenService } from "../src/service/auth/tokenService";

export default function authPageSSR(props) {
  console.log();
  return (
    <div>
      <h1>Auth Page Server Side Render</h1>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const token = tokenService.get(ctx);

  return { props: { token } };
}
