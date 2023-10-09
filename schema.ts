export interface Member {
  name: string;
  email: string;
  isAdmin?: boolean;
}

export interface AuthToken {
  memberId: string;
  expiry: string;
}
