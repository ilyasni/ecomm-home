export default ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET"),
    sessions: {
      maxRefreshTokenLifespan: env(
        "ADMIN_REFRESH_TOKEN_MAX_LIFESPAN",
        "30d"
      ),
      maxSessionLifespan: env("ADMIN_SESSION_MAX_LIFESPAN", "30d"),
    },
  },
  secrets: {
    encryptionKey: env("ADMIN_ENCRYPTION_KEY"),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT"),
  },
  transfer: {
    token: {
      salt: env("TRANSFER_TOKEN_SALT"),
    },
  },
});
