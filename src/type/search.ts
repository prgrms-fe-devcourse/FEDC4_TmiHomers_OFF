import type { Post } from '@/type/Post';
import type { User } from '@/type/User';
export type SearchType = 'all' | 'users';

export type SearchParams = {
  type?: 'all' | 'users';
  keyword: string;
};

export type SearchData = {
  data: (User | Post)[] | undefined;
};

export type RecentResultParams = {
  isSuccess: boolean;
  keyword: string;
};

export type UserListItemParams = {
  id: string;
  fullName: string;
};
