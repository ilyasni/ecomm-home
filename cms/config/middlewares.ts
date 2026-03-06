export default ({ env }: { env: (key: string, defaultValue?: string) => string }) => {
  const minioPublicUrl = env("MINIO_PUBLIC_URL", "http://localhost:9002");

  return [
    "strapi::logger",
    "strapi::errors",
    {
      name: "strapi::security",
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            "connect-src": ["'self'", "https:", minioPublicUrl],
            "img-src": ["'self'", "data:", "blob:", "market-assets.strapi.io", minioPublicUrl],
            "media-src": ["'self'", "data:", "blob:", "market-assets.strapi.io", minioPublicUrl],
            upgradeInsecureRequests: null,
          },
        },
      },
    },
    "strapi::cors",
    "strapi::poweredBy",
    "strapi::query",
    "strapi::body",
    "strapi::session",
    "strapi::favicon",
    "strapi::public",
  ];
};
