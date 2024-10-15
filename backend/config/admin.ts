export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET','qE6ye7xay0BFHUXCDAHy3g=='),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT','qE6ye7xay0BFHUXCDAHy3g=='),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT','qE6ye7xay0BFHUXCDAHy3g=='),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
