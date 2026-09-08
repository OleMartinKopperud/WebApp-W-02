import type { RouteMiddleware } from "rwsdk/router";

/**
 * Security headers on every response. HSTS is skipped in local development
 * (`VITE_IS_DEV_SERVER`) so HMR and sourcemaps are not blocked.
 */
export const setCommonHeaders =
  (): RouteMiddleware =>
  ({ response, rw: { nonce } }) => {
    if (!import.meta.env.VITE_IS_DEV_SERVER) {
      // Force HTTPS for two years.
      response.headers.set(
        "Strict-Transport-Security",
        "max-age=63072000; includeSubDomains; preload"
      );
    }

    // Use the declared content-type instead of sniffing.
    response.headers.set("X-Content-Type-Options", "nosniff");
    // No framing in an iframe.
    response.headers.set("X-Frame-Options", "DENY");
    // Do not pass the referring URL on.
    response.headers.set("Referrer-Policy", "no-referrer");
    // Isolate the browsing context from windows opened on other origins.
    response.headers.set("Cross-Origin-Opener-Policy", "same-origin");

    // The app uses neither location, microphone nor camera.
    response.headers.set(
      "Permissions-Policy",
      "geolocation=(), microphone=(), camera=()"
    );

    // CSP, strict by default. 'unsafe-eval' stays because the rwsdk RSC
    // bootstrap needs it.
    response.headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        `script-src 'self' 'unsafe-eval' 'nonce-${nonce}'`,
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob:",
        "media-src 'self' data: blob:",
        "frame-ancestors 'self'",
        "object-src 'none'",
      ].join("; ")
    );
  };
