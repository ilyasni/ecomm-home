export default ({ env }: { env: (key: string, defaultValue?: string) => string }) => {
  const minioEndpoint = env("MINIO_ENDPOINT_URL", "");

  return {
    "users-permissions": {
      config: {
        jwtSecret: env("JWT_SECRET"),
      },
    },
    ...(minioEndpoint
      ? {
          upload: {
            config: {
              provider: "aws-s3",
              providerOptions: {
                s3Options: {
                  endpoint: minioEndpoint,
                  forcePathStyle: true,
                  region: env("MINIO_REGION", "us-east-1"),
                  credentials: {
                    accessKeyId: env("MINIO_ACCESS_KEY"),
                    secretAccessKey: env("MINIO_SECRET_KEY"),
                  },
                },
                params: {
                  Bucket: env("MINIO_BUCKET", "strapi-uploads"),
                },
              },
              actionOptions: {
                upload: {},
                uploadStream: {},
                delete: {},
              },
            },
          },
        }
      : {}),
  };
};
