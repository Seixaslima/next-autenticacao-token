import nookies from "nookies";

const ACCESS_TOKEN_KEY = "ACCESS_TOKEN_KEY";

export const tokenService = {
  save(accessToken, ctx = null) {
    // globalThis?.sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    nookies.set(ctx, ACCESS_TOKEN_KEY, accessToken, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
  },
  get(ctx = null) {
    const cookies = nookies.get(ctx);
    return cookies[ACCESS_TOKEN_KEY] || "";
  },
  delete(ctx = null) {
    // globalThis?.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    nookies.destroy(ctx, ACCESS_TOKEN_KEY);
  },
};
