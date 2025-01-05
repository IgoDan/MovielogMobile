import 'dotenv/config';

export default {
  expo: {
    name: "MovielogMobile",
    slug: "MovielogMobile",
    version: "1.0.0",
    extra: {
      apiKey: process.env.API_KEY,
    },
  },
};