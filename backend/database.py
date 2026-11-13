import os
import csv
import io
import sqlite3
from datetime import datetime
from typing import List, Dict, Optional, Any

# -------------------------------------------------------------
# Configuration & Drivers
# -------------------------------------------------------------
MONGODB_URI = os.getenv("MONGODB_URI", "")
DB_NAME = os.getenv("MONGODB_DB_NAME", "production_rag")
COLLECTION_NAME = "students"

mongo_client = None
mongo_db = None
mongo_collection = None
is_mongo_active = False

if MONGODB_URI:
    try:
        from pymongo import MongoClient
        mongo_client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
        # Verify connection
        mongo_client.admin.command('ping')
        mongo_db = mongo_client[DB_NAME]
        mongo_collection = mongo_db[COLLECTION_NAME]
        # Create indexes
        mongo_collection.create_index("email")
        mongo_collection.create_index("phone")
        mongo_collection.create_index("utr_number")
        is_mongo_active = True
        print(f"Connected to hosted MongoDB Atlas cluster! DB: {DB_NAME}")
    except Exception as e:
        print(f"MongoDB connection failed ({e}). Falling back to local SQLite database.")
        is_mongo_active = False

# Local SQLite Fallback Setup
DB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
SQLITE_PATH = os.path.join(DB_DIR, "students.db")

def get_sqlite_conn():
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(SQLITE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_sqlite_db():
    conn = get_sqlite_conn()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        amount_inr INTEGER NOT NULL,
        currency TEXT DEFAULT 'INR',
        promo_code TEXT,
        payment_method TEXT NOT NULL,
        utr_number TEXT,
        razorpay_order_id TEXT,
        razorpay_payment_id TEXT,
        status TEXT NOT NULL DEFAULT 'confirmed',
        notes TEXT,
        created_at TEXT NOT NULL
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_students_phone ON students(phone);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_students_utr ON students(utr_number);")
    conn.commit()
    conn.close()

# Initialize SQLite tables
init_sqlite_db()

# -------------------------------------------------------------
# Unified Database Operations (MongoDB Atlas with SQLite Fallback)
# -------------------------------------------------------------
def get_database_info() -> Dict[str, Any]:
    return {
        "engine": "MongoDB Atlas" if is_mongo_active else "SQLite (Local Fallback)",
        "is_hosted_cloud": is_mongo_active,
        "database_name": DB_NAME if is_mongo_active else "students.db",
        "collection_or_table": COLLECTION_NAME
    }

def save_student(
    name: str,
    email: str,
    phone: str,
    amount_inr: int,
    payment_method: str,
    promo_code: Optional[str] = None,
    utr_number: Optional[str] = None,
    razorpay_order_id: Optional[str] = None,
    razorpay_payment_id: Optional[str] = None,
    status: str = "confirmed",
    notes: Optional[str] = None,
    currency: str = "INR"
) -> str:
    """
    Saves student registration record to MongoDB Atlas (or local SQLite if Atlas URI is not set).
    Returns unique record ID.
    """
    created_at = datetime.utcnow().isoformat() + "Z"
    
    doc = {
        "name": name.strip(),
        "email": email.strip().lower(),
        "phone": phone.strip(),
        "amount_inr": amount_inr,
        "currency": currency,
        "promo_code": promo_code.strip() if promo_code else None,
        "payment_method": payment_method,
        "utr_number": utr_number.strip() if utr_number else None,
        "razorpay_order_id": razorpay_order_id,
        "razorpay_payment_id": razorpay_payment_id,
        "status": status,
        "notes": notes,
        "created_at": created_at
    }

    if is_mongo_active and mongo_collection is not None:
        result = mongo_collection.insert_one(doc)
        return str(result.inserted_id)
    else:
        conn = get_sqlite_conn()
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO students (
            name, email, phone, amount_inr, currency, promo_code,
            payment_method, utr_number, razorpay_order_id, razorpay_payment_id,
            status, notes, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            doc["name"], doc["email"], doc["phone"], doc["amount_inr"],
            doc["currency"], doc["promo_code"], doc["payment_method"],
            doc["utr_number"], doc["razorpay_order_id"], doc["razorpay_payment_id"],
            doc["status"], doc["notes"], doc["created_at"]
        ))
        record_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return str(record_id)

def get_all_students() -> List[Dict[str, Any]]:
    """
    Returns all registered students ordered by registration time.
    """
    if is_mongo_active and mongo_collection is not None:
        cursor = mongo_collection.find().sort("created_at", -1)
        records = []
        for doc in cursor:
            doc["id"] = str(doc.get("_id", ""))
            if "_id" in doc:
                del doc["_id"]
            records.append(doc)
        return records
    else:
        conn = get_sqlite_conn()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM students ORDER BY id DESC")
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]

def export_students_to_csv() -> str:
    """
    Exports all student records to a clean CSV spreadsheet string.
    """
    students = get_all_students()
    output = io.StringIO()
    writer = csv.writer(output)
    
    writer.writerow([
        "ID", "Name", "Email", "WhatsApp Phone", "Amount (INR)", "Currency",
        "Promo Code", "Payment Method", "UPI UTR / Ref Number", "Razorpay Order ID",
        "Razorpay Payment ID", "Status", "Registered At (UTC)"
    ])
    
    for s in students:
        writer.writerow([
            s.get("id"),
            s.get("name"),
            s.get("email"),
            s.get("phone"),
            s.get("amount_inr"),
            s.get("currency"),
            s.get("promo_code"),
            s.get("payment_method"),
            s.get("utr_number"),
            s.get("razorpay_order_id"),
            s.get("razorpay_payment_id"),
            s.get("status"),
            s.get("created_at")
        ])
        
    return output.getvalue()
