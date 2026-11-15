import os
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Request, Header, Response, BackgroundTasks
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import razorpay
from dotenv import load_dotenv

import database
import email_service

load_dotenv()

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_placeholderKey")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "rzp_test_placeholderSecret")
RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET", "")
UPI_ID = os.getenv("UPI_ID", "sm2157982-1@okhdfcbank")
INSTRUCTOR_EMAIL = os.getenv("INSTRUCTOR_EMAIL", "sachin19566@gmail.com")
raw_phone = os.getenv("INSTRUCTOR_PHONE", "+91 8928450584")
if not raw_phone or "7820802707" in raw_phone:
    INSTRUCTOR_PHONE = "+91 8928450584"
else:
    INSTRUCTOR_PHONE = raw_phone

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
    email: str
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
    email: str
    phone: str
    amount_inr: int = 8999
    promo_code: Optional[str] = "EARLYBIRD10"
    currency: str = "INR"

class PaymentVerificationRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    amount_inr: Optional[int] = 8099
    promo_code: Optional[str] = "EARLYBIRD10"

@app.get("/")
def health_check():
    students = database.get_all_students()
    db_name = "MongoDB Atlas (Atlas Cloud Cluster)" if database.is_mongo_active else "SQLite (data/students.db)"
    return {
        "status": "healthy",
        "service": "Production RAG Cohort Backend & Database",
        "instructor": "Sachin Mishra (Senior Gen AI Engineer)",
        "instructor_upi": UPI_ID,
        "instructor_phone": INSTRUCTOR_PHONE,
        "database": db_name,
        "registered_students_count": len(students),
        "seats_remaining": max(0, 35 - len(students)),
        "cohort": "Cohort 1 Live",
        "tuition_inr": 8999,
        "promo_code": "EARLYBIRD10",
        "discounted_inr": 8099
    }

@app.post("/api/register-student")
def register_student(payload: StudentRegistration, background_tasks: BackgroundTasks):
    """
    Stores incoming student enrollment & payment records in the persistent database.
    Used for UPI QR payments, Razorpay completions, and Stripe checkouts.
    Dispatches automated confirmation email and tax invoice in the background.
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

        student_dict = {
            "id": record_id,
            "name": payload.name,
            "email": payload.email,
            "phone": payload.phone,
            "amount_inr": payload.amount_inr,
            "payment_method": payload.payment_method,
            "promo_code": payload.promo_code or "EARLYBIRD10",
            "utr_number": payload.utr_number or "VERIFIED",
            "status": payload.status,
            "currency": payload.currency
        }

        # Dispatch automated tax invoice & confirmation email via background task
        background_tasks.add_task(email_service.send_enrollment_email, student_dict)

        return {
            "success": True,
            "message": "Student registration saved successfully and invoice queued.",
            "student_id": record_id,
            "invoice_url": f"/api/invoice/{record_id}",
            "name": payload.name,
            "email": payload.email,
            "payment_method": payload.payment_method,
            "status": payload.status,
            "instructor_contact": {
                "name": "Sachin Mishra",
                "email": INSTRUCTOR_EMAIL,
                "whatsapp": INSTRUCTOR_PHONE
            },
            "discord_invite": "https://discord.gg/fKXBsdr4H",
            "discord_note": "Join the official Production RAG VIP Discord: https://discord.gg/fKXBsdr4H"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/api/invoice/{student_id_or_email}", response_class=HTMLResponse)
def get_student_invoice(student_id_or_email: str):
    """
    Returns an official, print-ready HTML Tax Invoice / Receipt for the student.
    Can be viewed in browser or printed/saved as PDF.
    """
    student = database.get_student_by_id(student_id_or_email)
    if not student:
        # Build placeholder invoice if direct link used
        student = {
            "id": student_id_or_email,
            "name": "Enrolled Engineer",
            "email": student_id_or_email if "@" in student_id_or_email else "student@productionrag.dev",
            "phone": "Verified Student",
            "amount_inr": 8099,
            "payment_method": "UPI / Card",
            "utr_number": "VERIFIED",
            "promo_code": "EARLYBIRD10"
        }
    
    html_content = email_service.generate_invoice_html(student)
    return HTMLResponse(content=html_content, status_code=200)

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
def verify_payment(payload: PaymentVerificationRequest, background_tasks: BackgroundTasks):
    """
    Cryptographically verifies Razorpay signature, updates the student record to 'paid',
    and dispatches the tax invoice & enrollment confirmation email.
    """
    try:
        params_dict = {
            "razorpay_order_id": payload.razorpay_order_id,
            "razorpay_payment_id": payload.razorpay_payment_id,
            "razorpay_signature": payload.razorpay_signature
        }
        client.utility.verify_payment_signature(params_dict)
        
        record_id = None
        # Save or update verified payment in database
        if payload.name and payload.email and payload.phone:
            record_id = database.save_student(
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

            student_dict = {
                "id": record_id,
                "name": payload.name,
                "email": payload.email,
                "phone": payload.phone,
                "amount_inr": payload.amount_inr or 8099,
                "payment_method": "razorpay",
                "promo_code": payload.promo_code or "EARLYBIRD10",
                "utr_number": payload.razorpay_payment_id,
                "status": "paid",
                "currency": "INR"
            }
            background_tasks.add_task(email_service.send_enrollment_email, student_dict)

        return {
            "success": True,
            "message": "Payment verified successfully. Welcome to Production RAG Cohort 1!",
            "student_id": record_id,
            "invoice_url": f"/api/invoice/{record_id}" if record_id else None,
            "instructor_contact": {
                "name": "Sachin Mishra",
                "email": INSTRUCTOR_EMAIL,
                "whatsapp": INSTRUCTOR_PHONE
            },
            "discord_invite": "https://discord.gg/fKXBsdr4H",
            "discord_note": "Join the official Production RAG VIP Discord: https://discord.gg/fKXBsdr4H"
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

@app.get("/api/test-email")
def test_email(to: Optional[str] = "sachin19566@gmail.com"):
    """
    Live diagnostic endpoint to verify email delivery from Render.
    Hit this in browser or terminal to immediately see exact network/provider logs.
    """
    target_email = to.strip().lower() if to else "sachin19566@gmail.com"
    sample_student = {
        "id": "DIAG99",
        "name": "Sachin Mishra (Live Diagnostic Test)",
        "email": target_email,
        "phone": INSTRUCTOR_PHONE,
        "amount_inr": 8099,
        "payment_method": "upi_qr",
        "utr_number": "TEST_DIAGNOSTIC",
        "promo_code": "EARLYBIRD10"
    }

    result = email_service.send_enrollment_email(sample_student)
    
    # Mask password for secure diagnostic output
    smtp_pw = os.getenv("SMTP_PASSWORD", "")
    masked_pw = f"{smtp_pw[:2]}****{smtp_pw[-2:]}" if len(smtp_pw) >= 4 else ("SET" if smtp_pw else "NOT_SET")
    brevo_key = os.getenv("BREVO_API_KEY", "")
    masked_brevo = f"{brevo_key[:4]}****{brevo_key[-4:]}" if len(brevo_key) >= 8 else ("SET" if brevo_key else "NOT_SET")

    return {
        "status": "tested",
        "recipient": target_email,
        "email_delivery_result": result,
        "diagnostics": {
            "brevo_api_configured": bool(brevo_key),
            "brevo_key_preview": masked_brevo,
            "resend_api_configured": bool(os.getenv("RESEND_API_KEY")),
            "smtp_configured": bool(smtp_pw),
            "smtp_user": os.getenv("SMTP_USER", "sachin19566@gmail.com"),
            "smtp_host": os.getenv("SMTP_HOST", "smtp.gmail.com"),
            "smtp_port": os.getenv("SMTP_PORT", "587"),
            "smtp_password_status": masked_pw,
            "instructor_phone": INSTRUCTOR_PHONE
        }
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
