import { withSession } from "../src/service/auth/session";

export default function authPageSSR(props) {
  console.log();
  return (
    <div>
      <h1>Auth Page Server Side Render</h1>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  );
}

//decoration
export const getServerSideProps = withSession((ctx) => {
  return {
    props: {
      session: ctx.req.session,
    },
  };
});

// export async function getServerSideProps(ctx) {
//   try {
//     const session = await authService.getSession(ctx);
//     return { props: { session } };
//   } catch {
//     return {
//       redirect: {
//         permanent: false,
//         destination: "/?err=401",
//       },
//     };
//   }
// }
