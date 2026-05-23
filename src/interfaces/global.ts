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
  salesperson_id: string; // after 
  productName: string;
  description: string;
  uploadProduct: File | null;
}

// second step 
export interface CompanyData {
  company_size: string | null;
  company_id: string, //after
  headquarters: string | null;
  revenue: string | null;
  industry: string | null;
  tech_stack: string[];
  open_positions: string | null;
  founded_year: string | null;
  description: string | null;
  social_links: Record<string, string>; // empty object {}
  data_sources: string[];
}

// third step 
export interface Participant {
  name: string;
  role: string;
  note: string;
  decisionMaker: boolean;
  linkedin: string;
};


// meeting payload
interface MeetingPayload {
  salesperson_id: string;
  company_id: string;
  meeting_mode: string;
  status: string;
  representatives: any[];
  sales_methodology: string;
  meeting_goal: string;
  personality: string;
  duration_minutes: number;
  difficulty: string;
  questions?: string[];
}

// Full meeting state (IMPORTANT)
export interface StartMeetingState {
  product: ProductValue | null;
  companyData: CompanyData | null;
  participants: Participant[];
  payloadData: MeetingPayload | null
}

