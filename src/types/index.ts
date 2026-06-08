// ============================================================
// Tipos globales del proyecto
// ============================================================

export type Theme = 'light' | 'dark';

// Item genérico para listas — se especializa según el dominio de la app
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
