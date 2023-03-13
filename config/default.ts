export default {
  port: process.env.PORT,
  dbUri: process.env.DBURI,
  saltWork: process.env.SALTWORKFACTOR,
  privateKey: process.env.JWTPRIVATEKEY,
  accessTokenTtl: process.env.ACCESSTOKENTTL,
  refreshTokenTtl: process.env.REFRESHTOKENTTL,
  permissionCode: process.env.PERMISSION_CODE,
};
