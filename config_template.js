module.exports = {
  projectId: '[Your Project ID]',
  keyFilename: './key.json',
  bucketName: '[your Google Cloud Storage bucket name]',
  cookieSecret: '[Your Cookie Secret]',
  oauth2: {
    clientId: '[Your ClientID]',
    clientSecret: '[Your Client Secret]',
    redirectUrl: process.env.REDIRECT_URL || 'https://localhost:8080'
  }
};