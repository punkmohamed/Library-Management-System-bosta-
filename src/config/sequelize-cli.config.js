require('dotenv').config();

const devUrl = process.env.DATABASE_URL_DEVELOPMENT || process.env.DATABASE_URL;
const prodUrl = process.env.DATABASE_URL_PRODUCTION || process.env.DATABASE_URL;

function fixRenderConnectionString(url) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;
    
    if (hostname.startsWith('dpg-') && !hostname.includes('.')) {
      console.error('\n❌ ERROR: Incomplete Render.com database connection string detected!');
      console.error(`   Current hostname: ${hostname}`);
      console.error('\n📋 To fix this:');
      console.error('   1. Go to Render Dashboard → Your Database → Connections tab');
      console.error('   2. Copy the FULL "External Connection" string');
      console.error('   3. It should look like: postgresql://user:pass@dpg-xxxxx.REGION-postgres.render.com:5432/dbname');
      console.error('   4. Update DATABASE_URL in your .env file\n');
      throw new Error(`Incomplete connection string. Hostname "${hostname}" is missing the domain. Please get the full connection string from Render Dashboard.`);
    }
    
    return url;
  } catch (error) {
    if (error.message.includes('Incomplete connection string')) {
      throw error;
    }
    return url;
  }
}

function parseDatabaseUrl(url) {
  const fixedUrl = fixRenderConnectionString(url);
  const parsed = new URL(fixedUrl);
  const isLocalhost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
  const needsSSL = !isLocalhost;
  
  return {
    username: parsed.username,
    password: parsed.password,
    database: parsed.pathname.slice(1),
    host: parsed.hostname,
    port: parsed.port || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: needsSSL ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    } : {},
  };
}

if (!devUrl) {
  throw new Error('DATABASE_URL_DEVELOPMENT or DATABASE_URL required for migrations');
}
if (!prodUrl) {
  throw new Error('DATABASE_URL_PRODUCTION required for production migrations');
}

const devConfig = parseDatabaseUrl(devUrl);
const prodConfig = parseDatabaseUrl(prodUrl);

module.exports = {
  development: devConfig,
  test: {
    ...devConfig,
    database: devConfig.database + '_test',
    logging: false,
  },
  production: {
    ...prodConfig,
    logging: false,
  },
};
