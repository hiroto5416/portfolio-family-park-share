export interface UserProfile {
  username: string;
  email: string;
  avatar: string| null;
}

export interface Review {
  id: number;
  parkName: string;
  content: string;
  dada: string;
  likes: number;
}