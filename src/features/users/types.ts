export type UserRole = 'customer' | 'admin';

export type User = {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateUserDto = {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role?: UserRole;
};

export type UpdateUserDto = Partial<CreateUserDto>;
