import os
import json
import smtplib
import urllib.request
import urllib.error
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime
from typing import Dict, Any, Optional

# SMTP Configuration
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "sachin19566@gmail.com")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "").strip()
SMTP_FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL", "sachin19566@gmail.com")
SMTP_FROM_NAME = os.getenv("SMTP_FROM_NAME", "Sachin Mishra | Production RAG")

# HTTP-Based Providers (Bypasses Render Free Tier outbound SMTP port restrictions on 25/465/587)
BREVO_API_KEY = os.getenv("BREVO_API_KEY", "").strip()
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "").strip()
RESEND_FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL", "Sachin Mishra <onboarding@resend.dev>").strip()

# Instructor Official Contact Details
INSTRUCTOR_EMAIL = os.getenv("INSTRUCTOR_EMAIL", "sachin19566@gmail.com")
raw_phone = os.getenv("INSTRUCTOR_PHONE", "+91 8928450584")
if not raw_phone or "7820802707" in raw_phone:
    INSTRUCTOR_PHONE = "+91 8928450584"
else:
    INSTRUCTOR_PHONE = raw_phone

DISCORD_INVITE_URL = os.getenv("DISCORD_INVITE_URL", "https://discord.gg/fKXBsdr4H")

def generate_invoice_html(student: Dict[str, Any]) -> str:
    invoice_num = f"INV-PRAG-{str(student.get('id', student.get('_id', '000000')))[-6:].upper()}"
    date_str = datetime.now().strftime("%B %d, %Y")
    
    student_name = student.get("name", "Valued Student")
    student_email = student.get("email", "N/A")
    student_phone = student.get("phone", "N/A")
    amount = student.get("amount_inr", 8099)
    payment_method = student.get("payment_method", "upi_qr").upper()
    utr_number = student.get("utr_number", "VERIFIED")
    promo_code = student.get("promo_code", "EARLYBIRD10")

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice - {invoice_num}</title>
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }}
    .invoice-card {{ max-width: 680px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 36px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }}
    .header {{ display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0d9488; padding-bottom: 20px; margin-bottom: 24px; }}
    .brand {{ font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }}
    .brand span {{ color: #0d9488; }}
    .badge {{ background: #ccfbf1; color: #0f766e; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; display: inline-block; margin-top: 4px; }}
    .inv-meta {{ text-align: right; font-size: 12px; color: #64748b; }}
    .inv-meta strong {{ color: #0f172a; font-size: 15px; display: block; margin-bottom: 4px; }}
    .grid {{ display: flex; justify-content: space-between; margin-bottom: 28px; font-size: 13px; }}
    .col {{ flex: 1; }}
    .col h4 {{ font-size: 11px; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px; margin: 0 0 8px 0; }}
    .col p {{ margin: 2px 0; color: #334155; }}
    table {{ width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }}
    th {{ background: #f8fafc; color: #475569; font-weight: 600; text-align: left; padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 11px; text-transform: uppercase; }}
    td {{ padding: 14px 12px; border-bottom: 1px solid #f1f5f9; color: #1e293b; }}
    .text-right {{ text-align: right; }}
    .total-row td {{ font-weight: 700; font-size: 15px; color: #0f172a; border-top: 2px solid #e2e8f0; background: #f8fafc; }}
    .notes-box {{ background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 12px; padding: 18px; margin-top: 24px; font-size: 12px; color: #134e4a; }}
    .notes-box h5 {{ margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #115e59; }}
    .contact-bar {{ margin-top: 24px; padding-top: 18px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; text-align: center; }}
    .contact-bar a {{ color: #0d9488; text-decoration: none; font-weight: 600; }}
    .print-btn {{ display: block; width: 100%; max-width: 200px; margin: 24px auto 0; padding: 10px; background: #0d9488; color: #fff; text-align: center; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px; cursor: pointer; }}
    @media print {{
      body {{ background: #ffffff; padding: 0; }}
      .invoice-card {{ border: none; box-shadow: none; padding: 0; }}
      .print-btn {{ display: none; }}
    }}
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div>
        <div class="brand">PRODUCTION<span>.RAG</span></div>
        <div class="badge">OFFICIAL TAX INVOICE & RECEIPT</div>
      </div>
      <div class="inv-meta">
        <strong>{invoice_num}</strong>
        <div>Date: {date_str}</div>
        <div>Status: <span style="color:#059669; font-weight:700;">PAID & VERIFIED</span></div>
      </div>
    </div>

    <div class="grid">
      <div class="col">
        <h4>Billed To (Student)</h4>
        <p><strong>{student_name}</strong></p>
        <p>{student_email}</p>
        <p>{student_phone}</p>
      </div>
      <div class="col" style="text-align: right;">
        <h4>Instructor & Provider</h4>
        <p><strong>Sachin Mishra</strong></p>
        <p>Senior Generative AI Engineer</p>
        <p>Email: <a href="mailto:{INSTRUCTOR_EMAIL}" style="color:#0d9488;">{INSTRUCTOR_EMAIL}</a></p>
        <p>WhatsApp: <a href="https://wa.me/{INSTRUCTOR_PHONE.replace(' ', '').replace('+', '')}" style="color:#0d9488;">{INSTRUCTOR_PHONE}</a></p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Course Description</th>
          <th>Batch</th>
          <th>Duration</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>Production RAG Live Masterclass</strong><br>
            <span style="font-size:11px; color:#64748b;">Complete Multimodal Ingestion (ColPali), Scalable Hybrid Retrieval & Production Microservice Architecture</span>
          </td>
          <td>Cohort #1 (Live)</td>
          <td>4 Weeks (Weekends)</td>
          <td class="text-right">₹8,999.00</td>
        </tr>
        <tr>
          <td colspan="3" style="color: #059669;">
            Early Bird Discount (Code: <strong>{promo_code}</strong> - 10% Off)
          </td>
          <td class="text-right" style="color: #059669;">-₹900.00</td>
        </tr>
        <tr class="total-row">
          <td colspan="3">Total Paid (INR)</td>
          <td class="text-right">₹{amount:,.2f}</td>
        </tr>
      </tbody>
    </table>

    <div style="font-size: 11px; color: #64748b; margin-bottom: 16px;">
      Payment Method: <strong>{payment_method}</strong> &bull; Reference/UTR: <strong>{utr_number}</strong>
    </div>

    <div class="notes-box">
      <h5>Next Steps &amp; Cohort Onboarding</h5>
      <p style="margin: 4px 0;">1. <strong>Direct Instructor Access:</strong> You can contact Sachin Mishra directly on WhatsApp at <strong>{INSTRUCTOR_PHONE}</strong> or email at <strong>{INSTRUCTOR_EMAIL}</strong> for any queries.</p>
      <p style="margin: 4px 0;">2. <strong>VIP Discord Community:</strong> Join our private cohort Discord server right away for live announcements, pre-reading, and office hours: <a href="{DISCORD_INVITE_URL}" style="color:#5865F2; font-weight:700;" target="_blank">{DISCORD_INVITE_URL}</a></p>
      <p style="margin: 4px 0;">3. <strong>Starter Codebase &amp; Schematics:</strong> Complete repository access and the 77-page MiG-29 manual will be delivered via email and pinned in the Discord #announcements channel.</p>
    </div>

    <div class="contact-bar">
      Need assistance? Contact Sachin Mishra at <a href="mailto:{INSTRUCTOR_EMAIL}">{INSTRUCTOR_EMAIL}</a> or WhatsApp <a href="https://wa.me/{INSTRUCTOR_PHONE.replace(' ', '').replace('+', '')}">{INSTRUCTOR_PHONE}</a>.<br>
      &copy; 2025-2026 Production RAG Masterclass by Sachin Mishra. All rights reserved.
    </div>

    <button onclick="window.print()" class="print-btn">Print / Save as PDF</button>
  </div>
</body>
</html>"""

def build_email_contents(student: Dict[str, Any]):
    student_name = student.get("name", "Engineer")
    student_email = student.get("email", "").strip().lower()
    amount = student.get("amount_inr", 8099)
    utr_number = student.get("utr_number", "VERIFIED")
    invoice_num = f"INV-PRAG-{str(student.get('id', student.get('_id', '000000')))[-6:].upper()}"

    subject = f"Enrollment Confirmed & Invoice {invoice_num} - Production RAG Cohort 1"
    
    text_content = f"""Hi {student_name},

Welcome to Cohort 1 of the Production RAG Masterclass!

Your enrollment has been successfully registered and verified.

INVOICE SUMMARY:
- Invoice Number: {invoice_num}
- Course: Production RAG Live Cohort #1 (4 Weeks Live)
- Amount Paid: ₹{amount:,} INR
- Reference/UTR: {utr_number}

DIRECT INSTRUCTOR CONTACT:
- Sachin Mishra (Senior Gen AI Engineer)
- WhatsApp: {INSTRUCTOR_PHONE}
- Email: {INSTRUCTOR_EMAIL}

COMMUNITY ONBOARDING:
Join the official Production RAG VIP Discord Server right away:
{DISCORD_INVITE_URL}

You can introduce yourself in #introductions, network with cohort peers, and access pinned pre-reading materials prior to session #1.

If you have any questions, feel free to reply directly to this email or reach out on WhatsApp.

Best regards,
Sachin Mishra
Senior Generative AI Engineer
YouTube: @LocData | LinkedIn: sachin-mishra19566
"""
    html_content = generate_invoice_html(student)
    return subject, text_content, html_content

def send_via_brevo(student: Dict[str, Any], subject: str, text_content: str, html_content: str) -> Dict[str, Any]:
    """
    Sends transactional email via Brevo REST API over HTTPS port 443.
    Never blocked by Render free tier firewalls.
    """
    cleaned_key = BREVO_API_KEY.strip()
    sender_email = os.getenv("BREVO_SENDER_EMAIL", os.getenv("SMTP_FROM_EMAIL", "sachin19566@gmail.com")).strip().lower()
    sender_name = os.getenv("SMTP_FROM_NAME", "Sachin Mishra | Production RAG").strip()

    # Check if user accidentally pasted SMTP relay key instead of REST API Key
    if cleaned_key.startswith("xsmt"):
        return {
            "success": False,
            "provider": "brevo_http_api",
            "error": "Invalid Brevo Key Type: Your key starts with 'xsmt', which is an SMTP Relay Key, NOT a REST API Key.",
            "help": "In Brevo Dashboard, go to 'SMTP & API' -> click the 'API Keys' tab (NOT the SMTP tab) -> click 'Generate a new API key'. The correct key MUST start with 'xkeysib-'."
        }

    url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "accept": "application/json",
        "api-key": cleaned_key,
        "content-type": "application/json"
    }
    payload = {
        "sender": {
            "name": sender_name,
            "email": sender_email
        },
        "to": [
            {
                "email": student["email"].strip().lower(),
                "name": student.get("name", "Engineer")
            }
        ],
        "replyTo": {
            "email": INSTRUCTOR_EMAIL,
            "name": "Sachin Mishra"
        },
        "subject": subject,
        "htmlContent": html_content,
        "textContent": text_content
    }
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers=headers,
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=12) as resp:
            res_data = resp.read().decode("utf-8")
            print(f"[EmailService/Brevo] Dispatched successfully to {student['email']}")
            return {
                "success": True,
                "provider": "brevo_http_api",
                "sender": sender_email,
                "response": json.loads(res_data) if res_data.startswith("{") else res_data
            }
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8") if e.fp else str(e)
        try:
            parsed_err = json.loads(err_body)
        except Exception:
            parsed_err = err_body
        print(f"[EmailService/Brevo] HTTP Error {e.code}: {parsed_err}")
        return {
            "success": False,
            "provider": "brevo_http_api",
            "status_code": e.code,
            "sender_attempted": sender_email,
            "error": parsed_err,
            "help": "If error mentions 'sender', go to Brevo -> Senders & Domains and verify your sender email. If 'unauthorized', re-check the API key."
        }
    except Exception as e:
        print(f"[EmailService/Brevo] Unexpected error: {e}")
        return {
            "success": False,
            "provider": "brevo_http_api",
            "error": str(e)
        }

def send_via_resend(student: Dict[str, Any], subject: str, text_content: str, html_content: str) -> Dict[str, Any]:
    """
    Sends transactional email via Resend REST API over HTTPS port 443.
    """
    url = "https://api.resend.com/emails"
    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "from": RESEND_FROM_EMAIL,
        "to": [student["email"].strip().lower()],
        "reply_to": INSTRUCTOR_EMAIL,
        "subject": subject,
        "html": html_content,
        "text": text_content
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=12) as resp:
        res_data = resp.read().decode("utf-8")
        print(f"[EmailService/Resend] Dispatched successfully to {student['email']}")
        return {"success": True, "provider": "resend_http_api", "response": res_data}

def send_via_smtp(student: Dict[str, Any], subject: str, text_content: str, html_content: str) -> Dict[str, Any]:
    """
    Sends email via SMTP (Gmail, custom mail server).
    Note: Render Free Tier blocks outbound ports 25, 465, and 587.
    """
    student_email = student["email"].strip().lower()
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{SMTP_FROM_NAME} <{SMTP_FROM_EMAIL}>"
    msg["To"] = student_email
    msg["Reply-To"] = INSTRUCTOR_EMAIL

    part1 = MIMEText(text_content, "plain")
    part2 = MIMEText(html_content, "html")
    msg.attach(part1)
    msg.attach(part2)

    # Try SMTP with SSL if port 465, otherwise STARTTLS
    if SMTP_PORT == 465:
        server = smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=10)
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_FROM_EMAIL, [student_email], msg.as_string())
        server.quit()
    else:
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_FROM_EMAIL, [student_email], msg.as_string())
        server.quit()

    print(f"[EmailService/SMTP] Dispatched successfully to {student_email}")
    return {"success": True, "provider": "smtp", "response": "OK"}

def send_enrollment_email(student: Dict[str, Any]) -> Dict[str, Any]:
    """
    Multi-provider email dispatcher with automatic fallback:
    1. Brevo HTTP API (Port 443 - zero domain DNS required, 300 free/day)
    2. Resend HTTP API (Port 443)
    3. Direct SMTP (Gmail / Custom Server)
    """
    student_email = student.get("email", "").strip().lower()
    if not student_email or "@" not in student_email:
        print(f"[EmailService] Skipping email: invalid address '{student_email}'")
        return {"success": False, "error": f"Invalid email '{student_email}'"}

    subject, text_content, html_content = build_email_contents(student)

    # 1. Primary HTTP Provider: Brevo (Recommended for Render Free Tier)
    if BREVO_API_KEY:
        brevo_res = send_via_brevo(student, subject, text_content, html_content)
        # Always return Brevo's direct result so errors are fully transparent
        return brevo_res

    # 2. Secondary HTTP Provider: Resend
    if RESEND_API_KEY:
        try:
            resend_res = send_via_resend(student, subject, text_content, html_content)
            if resend_res.get("success"):
                return resend_res
        except Exception as e:
            print(f"[EmailService] Resend API error: {e}")

    # 3. Standard SMTP (Works on local dev and Render paid plans)
    if SMTP_PASSWORD:
        try:
            return send_via_smtp(student, subject, text_content, html_content)
        except Exception as e:
            err_msg = str(e)
            is_firewall = any(term in err_msg.lower() for term in ["timeout", "timed out", "refused", "unreachable"])
            print(f"[EmailService] SMTP error for {student_email}: {err_msg}")
            
            help_advice = (
                "Render Free Web Services block outbound ports 25, 465, and 587 to prevent spam. "
                "To send emails reliably over standard HTTPS port 443, sign up at brevo.com (100% free, 300 emails/day), "
                "verify 'sachin19566@gmail.com', and set BREVO_API_KEY in Render Environment Variables."
                if is_firewall else
                f"SMTP Error: {err_msg}. Verify your Google App Password and 2-step verification."
            )
            return {
                "success": False,
                "provider": "smtp",
                "error": err_msg,
                "render_port_blocked": is_firewall,
                "help": help_advice
            }

    print(f"[EmailService] No active email provider configured (BREVO_API_KEY, RESEND_API_KEY, or SMTP_PASSWORD).")
    return {
        "success": False,
        "provider": "none",
        "error": "No email provider credentials configured on server.",
        "help": "Set BREVO_API_KEY (recommended) or SMTP_PASSWORD in Render environment variables."
    }
