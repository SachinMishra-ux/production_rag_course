import os
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Request, Header, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import razorpay
from dotenv import load_dotenv

import database

load_dotenv()

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_placeholderKey")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "rzp_test_placeholderSecret")
RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET", "")
UPI_ID = os.getenv("UPI_ID", "sm2157982-1@okhdfcbank")
INSTRUCTOR_PHONE = os.getenv("INSTRUCTOR_PHONE", "7820802707")

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

app = FastAPI(
    title="Production RAG Cohort API & Student Database",
    description="Backend API for Payments, Student Database & Registration Management",
    version="1.1.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StudentRegistration(BaseModel):
    name: str
    email: EmailStr
    phone: str
    amount_inr: int = 8099
    payment_method: str = "upi_qr"  # 'upi_qr' | 'razorpay' | 'stripe'
    promo_code: Optional[str] = "EARLYBIRD10"
    utr_number: Optional[str] = None
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    status: str = "confirmed"
    notes: Optional[str] = None
    currency: str = "INR"

class OrderRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    amount_inr: int = 8999
    promo_code: Optional[str] = "EARLYBIRD10"
    currency: str = "INR"

class PaymentVerificationRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    amount_inr: Optional[int] = 8099
    promo_code: Optional[str] = "EARLYBIRD10"

@app.get("/")
def health_check():
    students = database.get_all_students()
    return {
        "status": "healthy",
        "service": "Production RAG Cohort Backend & Database",
        "instructor": "Sachin Mishra (Senior Gen AI Engineer)",
        "instructor_upi": UPI_ID,
        "instructor_phone": INSTRUCTOR_PHONE,
        "database": "SQLite (data/students.db)",
        "registered_students_count": len(students),
        "cohort": "Cohort 1 Live",
        "tuition_inr": 8999,
        "promo_code": "EARLYBIRD10",
        "discounted_inr": 8099
    }

@app.post("/api/register-student")
def register_student(payload: StudentRegistration):
    """
    Stores incoming student enrollment & payment records in the persistent SQLite database.
    Used for UPI QR payments, Razorpay completions, and Stripe checkouts.
    """
    try:
        record_id = database.save_student(
            name=payload.name,
            email=payload.email,
            phone=payload.phone,
            amount_inr=payload.amount_inr,
            payment_method=payload.payment_method,
            promo_code=payload.promo_code,
            utr_number=payload.utr_number,
            razorpay_order_id=payload.razorpay_order_id,
            razorpay_payment_id=payload.razorpay_payment_id,
            status=payload.status,
            notes=payload.notes,
            currency=payload.currency
        )
        return {
            "success": True,
            "message": "Student registration saved successfully into database.",
            "student_id": record_id,
            "name": payload.name,
            "email": payload.email,
            "payment_method": payload.payment_method,
            "status": payload.status,
            "discord_invite": "https://discord.gg/production-rag"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/api/students")
def list_students():
    """
    Admin endpoint to view all registered students and payment details.
    """
    students = database.get_all_students()
    total_revenue_inr = sum(s.get("amount_inr", 0) for s in students if s.get("status") in ["confirmed", "paid"])
    return {
        "total_count": len(students),
        "total_revenue_inr": total_revenue_inr,
        "seats_remaining": max(0, 35 - len(students)),
        "students": students
    }

@app.get("/api/export-students-csv")
def export_students_csv():
    """
    Allows the instructor (Sachin Mishra) to download the complete student roster as a CSV spreadsheet.
    """
    csv_data = database.export_students_to_csv()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=production_rag_cohort1_students.csv"}
    )

@app.post("/api/create-order")
def create_order(payload: OrderRequest):
    """
    Creates a Razorpay order in INR (converted to paise), applying early bird promo discount.
    """
    try:
        final_amount = payload.amount_inr
        applied_promo = False
        if payload.promo_code and payload.promo_code.upper() in ["EARLYBIRD10", "EARLYBIRD", "RAG10", "SACHIN10"]:
            final_amount = round(payload.amount_inr * 0.90)  # 10% early bird discount (8,099)
            applied_promo = True

        order_data = {
            "amount": final_amount * 100,  # paise
            "currency": payload.currency,
            "receipt": f"cohort1_{payload.email.split('@')[0]}",
            "notes": {
                "student_name": payload.name,
                "student_email": payload.email,
                "student_phone": payload.phone,
                "promo_applied": str(applied_promo),
                "course": "Production RAG 4-Week Live Masterclass"
            }
        }
        order = client.order.create(data=order_data)
        
        # Pre-save student intent in database
        database.save_student(
            name=payload.name,
            email=payload.email,
            phone=payload.phone,
            amount_inr=final_amount,
            payment_method="razorpay",
            promo_code=payload.promo_code,
            razorpay_order_id=order.get("id"),
            status="order_created"
        )

        return {
            "success": True,
            "order_id": order.get("id"),
            "amount": order.get("amount"),
            "currency": order.get("currency"),
            "key_id": RAZORPAY_KEY_ID
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/verify-payment")
def verify_payment(payload: PaymentVerificationRequest):
    """
    Cryptographically verifies Razorpay signature and updates the student record to 'paid'.
    """
    try:
        params_dict = {
            "razorpay_order_id": payload.razorpay_order_id,
            "razorpay_payment_id": payload.razorpay_payment_id,
            "razorpay_signature": payload.razorpay_signature
        }
        client.utility.verify_payment_signature(params_dict)
        
        # Save or update verified payment in database
        if payload.name and payload.email and payload.phone:
            database.save_student(
                name=payload.name,
                email=payload.email,
                phone=payload.phone,
                amount_inr=payload.amount_inr or 8099,
                payment_method="razorpay",
                promo_code=payload.promo_code,
                razorpay_order_id=payload.razorpay_order_id,
                razorpay_payment_id=payload.razorpay_payment_id,
                status="paid"
            )

        return {
            "success": True,
            "message": "Payment verified successfully. Welcome to Production RAG Cohort 1!",
            "discord_invite": "https://discord.gg/production-rag"
        }
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Signature verification failed. Invalid payment.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/razorpay-webhook")
async def razorpay_webhook(request: Request, x_razorpay_signature: Optional[str] = Header(None)):
    """
    Handles background asynchronous server-to-server Razorpay webhooks.
    """
    body_bytes = await request.body()
    body_str = body_bytes.decode("utf-8")
    
    if RAZORPAY_WEBHOOK_SECRET and x_razorpay_signature:
        try:
            client.utility.verify_webhook_signature(body_str, x_razorpay_signature, RAZORPAY_WEBHOOK_SECRET)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid webhook signature")
            
    return {"status": "received"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
