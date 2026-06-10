export type Theme = 'light' | 'dark';

export interface Item {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  createdAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
