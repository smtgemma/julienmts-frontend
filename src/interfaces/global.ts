export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string | null;
  role: string; // Or use a union type like "INDIVIDUAL" | "ORGANIZATION" | etc. if you know all possible values
}

export type ErrorTypes = {
  success: boolean;
  message: string;
};

// first step
export interface ProductValue {
  productName : string;
  description: string;
  uploadProduct: File | null;
}

// second step 
export interface Participant {
  name: string;
  role: string;
  note: string;
  decisionMaker: boolean;
  linkedin: string;
};

// Full meeting state (IMPORTANT)
export interface StartMeetingState {
  product: ProductValue | null;
  participants: Participant[];
}

