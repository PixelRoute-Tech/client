export interface Company {
  _id: string;
  name: string;
  email: string;
  contactNo: string;
  address: string;
  logo?: string; // base64 string
  description: string;
  lisenceNo: string;
  createdAt: string;
  updatedAt: string;
}
