const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...(config.extra ?? {}),
    EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL ?? '',
    EXPO_PUBLIC_API_USER_ID: process.env.EXPO_PUBLIC_API_USER_ID ?? '',
    EXPO_PUBLIC_WS_URL: process.env.EXPO_PUBLIC_WS_URL ?? '',
  },
});
