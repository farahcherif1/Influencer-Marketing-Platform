export type UpdateProfileResponse = {
  message: string;
  creator: {
    id: number;
    name: string;
    location?: string;
    title?: string;
    description?: string;
    gender?: string;
  };
};

export type UpdateAccountResponse = {
  success: boolean;
  message: string;
  user: {
    id: number;
    email: string;
  };
};
export type DeletePackageResponse = {
  message: string;
  status: boolean;
  statusCode: number;
};
export type deleteResponse = {
  message: string;
  status: boolean;
  statusCode: number;
};
