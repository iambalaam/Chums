export interface Member {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

export interface AuthToken {
  id: string;
  memberId: string;
  expiry: string;
}
