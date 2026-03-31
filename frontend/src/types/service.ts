export interface Service {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  discountedPrice: number | null;
  durationMinutes: number;
  doctorType: string;
  isActive: boolean;
  minAge: number | null;
  maxAge: number | null;
  allowForChild: boolean;
  allowForSomeoneElse: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetServicesResponse {
  success: boolean;
  count?: number;
  services: Service[];
  message?: string;
}

export interface ServiceContextType {
  services: Service[];
  loading: boolean;
  fetchServices: () => Promise<void>;
  getServiceBySlug: (slug: string) => Service | undefined;
}