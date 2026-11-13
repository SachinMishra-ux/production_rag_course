// Production RAG Cohort Cloud API Client
export const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL || 'https://production-rag-api-gwus.onrender.com';

export interface CohortStats {
  registeredCount: number;
  seatsRemaining: number;
  database: string;
  totalRevenueInr: number;
}

export interface StudentRecord {
  id?: string;
  name: string;
  email: string;
  phone: string;
  amount_inr: number;
  currency: string;
  promo_code?: string;
  payment_method: string;
  utr_number?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  status: string;
  notes?: string;
  created_at?: string;
}

export async function fetchCohortStats(): Promise<CohortStats> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/students`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      registeredCount: data.total_count ?? 0,
      seatsRemaining: data.seats_remaining ?? 35,
      database: "MongoDB Atlas",
      totalRevenueInr: data.total_revenue_inr ?? 0
    };
  } catch (err) {
    console.warn("Could not fetch remote cohort stats, using local defaults:", err);
    return {
      registeredCount: 0,
      seatsRemaining: 35,
      database: "MongoDB Atlas",
      totalRevenueInr: 0
    };
  }
}

export async function fetchAllStudents(): Promise<StudentRecord[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/students`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.students || [];
  } catch (err) {
    console.warn("Could not fetch students from API:", err);
    return [];
  }
}

export async function submitStudentRegistration(payload: {
  name: string;
  email: string;
  phone: string;
  amount_inr: number;
  currency?: string;
  promo_code?: string;
  payment_method: string;
  utr_number?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  status?: string;
  notes?: string;
}) {
  const res = await fetch(`${BACKEND_URL}/api/register-student`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || `Registration failed: HTTP ${res.status}`);
  }
  return await res.json();
}
