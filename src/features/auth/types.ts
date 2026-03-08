export type LoginDto = {
  email: string;
  password: string;
};

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
};
