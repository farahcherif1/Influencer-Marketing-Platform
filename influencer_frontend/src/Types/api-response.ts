export type DeletePackageResponse = {
  message: string;
  status: boolean;
  statusCode: number;
};
export type LogoutResponse = {
  message: string;
};

export type UpdateCreatorProfileResponse = {
  message: string;
  creator: {
    id: number;
    name: string;
    location: string;
    title: string;
    description: string;
    gender: string;
  };
};

export type BookingItemPayload = {
  creatorServiceId: number;
  quantity: number;
  unitPrice: number;
  productDescription: string;
  contentRequirements: string;
  contentApproval: boolean;
  physicalProduct: boolean;
  productCost?: number | null;
  useForAds: boolean;
  additionalRequirements?: string;
  deliveryDate?: string;
};
