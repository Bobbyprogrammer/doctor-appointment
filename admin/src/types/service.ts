export interface Service {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  discountedPrice?: number | null;
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

export interface CreateServicePayload {
  name: string;
  slug: string;
  description?: string;
  category?: string;
  price: number;
  discountedPrice?: number | null;
  durationMinutes?: number;
  doctorType?: string;
  minAge?: number | null;
  maxAge?: number | null;
  allowForChild?: boolean;
  allowForSomeoneElse?: boolean;
}

export interface UpdateServicePayload {
  name?: string;
  slug?: string;
  description?: string;
  category?: string;
  price?: number;
  discountedPrice?: number | null;
  durationMinutes?: number;
  doctorType?: string;
  minAge?: number | null;
  maxAge?: number | null;
  allowForChild?: boolean;
  allowForSomeoneElse?: boolean;
  isActive?: boolean;
}

export interface GetServicesResponse {
  success: boolean;
  count?: number;
  services: Service[];
  message?: string;
}

export interface GetServiceByIdResponse {
  success: boolean;
  service: Service;
  message?: string;
}

export interface CreateServiceResponse {
  success: boolean;
  message: string;
  service: Service;
}

export interface UpdateServiceResponse {
  success: boolean;
  message: string;
  service: Service;
}

export interface DeleteServiceResponse {
  success: boolean;
  message: string;
}

export interface ServicesContextType {
  services: Service[];
  loading: boolean;
  fetchServices: () => Promise<void>;
  addService: (payload: CreateServicePayload) => Promise<boolean>;
  editService: (serviceId: string, payload: UpdateServicePayload) => Promise<boolean>;
  deleteService: (serviceId: string) => Promise<boolean>;
}