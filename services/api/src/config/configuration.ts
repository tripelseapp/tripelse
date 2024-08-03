export default () => ({
  port: parseInt(process.env.PORT ?? '4000', 10) || 4000,
  uri: process.env.CONNECT_STRING ?? '',
  domain: process.env.DOMAIN ?? '',
});
