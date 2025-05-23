export type User = {
  id: string;
  email?: string;
  avatar_url?: string;
};

export type FileItem = {
  id: string;
  name: string;
  type: string;
  size: number;
  created_at: string;
  url?: string;
  thumbnailUrl?: string;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};