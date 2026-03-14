export interface Customer {
  id: number;
  name: string;
  email: string;
}

export interface Account {
  id: number;
  customerId: number;
  type: string;
  balance: number;
  status: string;
}

export interface User {
  username: string;
  password: string;
  role: string;
}