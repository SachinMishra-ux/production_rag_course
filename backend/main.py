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

ADMIN_SECRET = os.getenv("ADMIN_SECRET", "sachin_rag_admin_2026")
BACKEND_BASE_URL = os.getenv("BACKEND_BASE_URL", "https://production-rag-api-gwus.onrender.com")

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
    status: str = "pending_verification"
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
@app.get("/health")
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
    Stores incoming student enrollment & payment records with strict fraud protection:
    1. Validates exact 12-digit format for UPI UTR references.
    2. Enforces duplicate UTR check to block fake or replayed transactions.
    3. Manual UPI payments are set to 'pending_verification' (NO instant Discord access until verified).
    4. Automatically alerts Sachin Mishra via email with a 1-click bank approval link.
    """
    try:
        clean_name = payload.name.strip()
        clean_email = payload.email.strip().lower()
        clean_phone = payload.phone.strip()
        clean_method = payload.payment_method.strip().lower()
        clean_utr = (payload.utr_number or "").strip()

        # Enforce validation for direct UPI payments
        if clean_method == "upi_qr":
            if not clean_utr or len(clean_utr) != 12 or not clean_utr.isdigit():
                raise HTTPException(
                    status_code=400,
                    detail="Invalid UPI Reference (UTR) Number. It must be exactly 12 numeric digits from your payment receipt (e.g. 431289012345)."
                )
            
            # Anti-Fraud: Check for duplicate UTR in the database
            duplicate_student = database.find_student_by_utr(clean_utr)
            if duplicate_student:
                raise HTTPException(
                    status_code=400,
                    detail=f"This UPI Reference / UTR number ({clean_utr}) has already been submitted for enrollment. Duplicate submissions are strictly blocked. If you need assistance, contact Sachin Mishra on WhatsApp."
                )

            # Strict policy: Direct UPI transfers CANNOT be auto-confirmed without bank check
            enforced_status = "pending_verification"
        elif clean_method == "razorpay" and payload.razorpay_payment_id:
            enforced_status = "confirmed"
        else:
            enforced_status = "pending_verification"

        record_id = database.save_student(
            name=clean_name,
            email=clean_email,
            phone=clean_phone,
            amount_inr=payload.amount_inr,
            payment_method=clean_method,
            promo_code=payload.promo_code,
            utr_number=clean_utr or None,
            razorpay_order_id=payload.razorpay_order_id,
            razorpay_payment_id=payload.razorpay_payment_id,
            status=enforced_status,
            notes=payload.notes or f"Registered via {clean_method}",
            currency=payload.currency
        )

        student_dict = {
            "id": record_id,
            "name": clean_name,
            "email": clean_email,
            "phone": clean_phone,
            "amount_inr": payload.amount_inr,
            "payment_method": clean_method,
            "promo_code": payload.promo_code or "EARLYBIRD10",
            "utr_number": clean_utr or "PENDING_VERIFICATION",
            "status": enforced_status,
            "currency": payload.currency
        }

        # 1. Dispatch student receipt email (Pending receipt if pending, Paid Invoice if confirmed)
        background_tasks.add_task(email_service.send_enrollment_email, student_dict)

        # 2. If pending verification, alert instructor Sachin Mishra with 1-click approval URL
        if enforced_status == "pending_verification":
            approve_url = f"{BACKEND_BASE_URL}/api/admin/approve-student/{record_id}?token={ADMIN_SECRET}"
            background_tasks.add_task(email_service.send_instructor_pending_alert, student_dict, approve_url)

            return {
                "success": True,
                "status": "pending_verification",
                "message": "Payment reference submitted successfully for verification. We are cross-checking against HDFC Bank account statement.",
                "id": record_id,
                "id": record_id,
                "student_id": record_id,
                "utr_number": clean_utr,
                "invoice_url": f"/api/invoice/{record_id}",
                "name": clean_name,
                "email": clean_email,
                "payment_method": clean_method,
                "instructor_contact": {
                    "name": "Sachin Mishra",
                    "email": INSTRUCTOR_EMAIL,
                    "whatsapp": INSTRUCTOR_PHONE
                },
                "discord_invite": None,
                "discord_note": "VIP Discord invite will be unlocked and dispatched as soon as the bank statement verification is approved."
            }
        else:
            return {
                "success": True,
                "status": "confirmed",
                "message": "Student registration confirmed and payment verified.",
                "id": record_id,
                "student_id": record_id,
                "invoice_url": f"/api/invoice/{record_id}",
                "name": clean_name,
                "email": clean_email,
                "payment_method": clean_method,
                "instructor_contact": {
                    "name": "Sachin Mishra",
                    "email": INSTRUCTOR_EMAIL,
                    "whatsapp": INSTRUCTOR_PHONE
                },
                "discord_invite": "https://discord.gg/fKXBsdr4H",
                "discord_note": "Join the official Production RAG VIP Discord: https://discord.gg/fKXBsdr4H"
            }
    except HTTPException:
        raise
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

@app.get("/api/student-status")
def get_student_status(student_id: Optional[str] = None, email: Optional[str] = None):
    """
    Allows a student or frontend to poll/check their enrollment verification status.
    If confirmed, returns the official VIP Discord community link.
    """
    identifier = student_id or email
    if not identifier:
        raise HTTPException(status_code=400, detail="Provide student_id or email.")
    student = database.get_student_by_id(identifier)
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found.")

    is_confirmed = student.get("status") in ["confirmed", "paid"]
    return {
        "student_id": student.get("id"),
        "name": student.get("name"),
        "email": student.get("email"),
        "status": student.get("status"),
        "utr_number": student.get("utr_number"),
        "is_verified": is_confirmed,
        "invoice_url": f"/api/invoice/{student.get('id')}",
        "discord_invite": "https://discord.gg/fKXBsdr4H" if is_confirmed else None,
        "message": "Payment verified! You can now join the VIP Discord server." if is_confirmed else "Payment reference is still under manual review against HDFC Bank statements."
    }

@app.get("/api/admin/pending-students")
def get_pending_students_admin(token: str):
    """
    Admin portal endpoint for instructor Sachin Mishra to review all unverified UPI transfers.
    """
    if token != ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Unauthorized: Invalid admin token.")
    pending = database.get_pending_students()
    return {
        "pending_count": len(pending),
        "students": [
            {
                **s,
                "approve_url": f"{BACKEND_BASE_URL}/api/admin/approve-student/{s.get('id')}?token={ADMIN_SECRET}",
                "reject_url": f"{BACKEND_BASE_URL}/api/admin/reject-student/{s.get('id')}?token={ADMIN_SECRET}"
            }
            for s in pending
        ]
    }

@app.get("/api/admin/approve-student/{student_id}", response_class=HTMLResponse)
def approve_student_admin(student_id: str, token: str, background_tasks: BackgroundTasks):
    """
    1-Click verification link: marks student as 'confirmed', generates the official Paid Invoice,
    and automatically dispatches the VIP Discord community invite link to the student.
    """
    if token != ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Unauthorized: Invalid admin token.")
    
    student = database.get_student_by_id(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")
    
    # Update status to confirmed
    database.update_student_status(student_id, "confirmed", notes="Verified and approved by Sachin Mishra")
    
    # Refresh student object with updated status
    updated_student = {
        **student,
        "status": "confirmed"
    }

    # Dispatch official confirmed invoice & VIP Discord invite email
    background_tasks.add_task(email_service.send_enrollment_email, updated_student)

    return HTMLResponse(content=f"""<!DOCTYPE html>
<html>
<head>
  <title>Student Approved - Production RAG</title>
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background:#f8fafc; padding:40px; color:#1e293b; text-align:center; }}
    .card {{ max-width:500px; margin:0 auto; background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:36px; box-shadow:0 4px 6px rgba(0,0,0,0.05); }}
    .badge {{ background:#ccfbf1; color:#0f766e; font-weight:700; padding:4px 12px; border-radius:999px; font-size:12px; display:inline-block; margin-bottom:12px; }}
    h2 {{ color:#0f172a; margin:0 0 8px 0; }}
    p {{ color:#64748b; font-size:14px; line-height:1.6; }}
    .btn {{ display:inline-block; background:#0d9488; color:#fff; padding:10px 20px; border-radius:8px; text-decoration:none; font-weight:600; font-size:13px; margin-top:16px; }}
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">ENROLLMENT APPROVED ✓</div>
    <h2>{updated_student.get('name')} is Verified!</h2>
    <p>
      The payment reference (UTR: <strong>{updated_student.get('utr_number')}</strong>) has been confirmed in the database.
    </p>
    <p>
      An official <strong>Paid Tax Invoice</strong> and the <strong>VIP Discord Invitation Link (https://discord.gg/fKXBsdr4H)</strong> have been automatically dispatched to <strong>{updated_student.get('email')}</strong>.
    </p>
    <a href="/api/invoice/{student_id}" target="_blank" class="btn">View Official Paid Invoice</a>
  </div>
</body>
</html>""", status_code=200)

@app.get("/api/admin/reject-student/{student_id}", response_class=HTMLResponse)
def reject_student_admin(student_id: str, token: str):
    """
    Marks a fraudulent or unverified student payment submission as rejected.
    """
    if token != ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Unauthorized: Invalid admin token.")
    
    student = database.get_student_by_id(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")
    
    database.update_student_status(student_id, "rejected", notes="Rejected: UTR not found in bank statement")

    return HTMLResponse(content=f"""<!DOCTYPE html>
<html>
<body style="font-family:sans-serif; text-align:center; padding:40px; background:#f8fafc;">
  <div style="max-width:480px; margin:0 auto; background:#fff; border:1px solid #fee2e2; border-radius:16px; padding:32px;">
    <h2 style="color:#b91c1c;">Submission Flagged as Rejected ✕</h2>
    <p style="color:#64748b; font-size:14px;">The registration for <strong>{student.get('name')}</strong> (UTR: {student.get('utr_number')}) has been marked as rejected.</p>
  </div>
</body>
</html>""", status_code=200)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
