export type CreateUserMutationResult = {
    createUser: {
      id: number;
      username: string;
      email: string;
    };
  };

  export type LoginUserMutationResult = {
    loginUser: {
      id: number;
      username: string;
      email: string;
    };
  };