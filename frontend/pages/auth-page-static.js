import { withSessionHOC } from "../src/service/auth/session";

function authPageStatic(props) {
  return (
    <div>
      <h1>Auth Page Static</h1>
      <div>
        <a href="/logout">Logout</a>
      </div>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  );
}

export default withSessionHOC(authPageStatic);
