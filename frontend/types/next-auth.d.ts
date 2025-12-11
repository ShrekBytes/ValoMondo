import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    token?: string;
    is_moderator?: boolean;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      token?: string;
      is_moderator?: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    token?: string;
    is_moderator?: boolean;
  }
}

