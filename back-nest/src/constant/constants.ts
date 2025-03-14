export const jwtConfig = {
  accessToken: process.env.JWT_ACCESS_TOKEN,
  refreshToken: process.env.JWT_REFRESH_TOKEN,
};

export const tokenTypes = {
  access: 'access',
  refresh: 'refresh',
};

export const elasticIndex = {
  products: 'products',
};
