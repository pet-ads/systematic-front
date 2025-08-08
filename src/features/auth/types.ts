export interface User {
  username: string;
  password: string;
  email: string;
  country: string;
  affiliation: string;
}

export interface JWTClaims {
  id: string;
  exp: number;
  sub: string;
  iat: number;
}

export interface UserData extends User, JWTClaims {
  token: string;
}

export interface AccessCredentials {
  username: string;
  password: string;
}
