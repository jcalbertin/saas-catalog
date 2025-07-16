export default () => ({
  // Use || para fornecer valores padrão para todas as variáveis de ambiente
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'saas_catalog',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secretKey',
    expiresIn: '1d',
  },
  whatsapp: {
    apiKey: process.env.WHATSAPP_API_KEY || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  },
});