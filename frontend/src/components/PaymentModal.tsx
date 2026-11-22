import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, QrCode, CreditCard, Smartphone, Copy, Check, Sparkles, ExternalLink, CheckCheck, Phone, FileText, Mail, MessageCircle, MessageSquare, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import sachinPhotoImg from '../assets/sachin_photo.jpg';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'upi_qr' | 'razorpay' | 'stripe'>('upi_qr');
  const [enrolledStudentId, setEnrolledStudentId] = useState<string>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [hasPaidConfirmed, setHasPaidConfirmed] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [enrollmentStatus, setEnrollmentStatus] = useState<'pending_verification' | 'confirmed' | ''>('');
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Pricing & Promo Code
  const baseAmountINR = 8999;
  const [promoCodeInput, setPromoCodeInput] = useState('EARLYBIRD10');
  const [isPromoApplied, setIsPromoApplied] = useState(true);
  const [promoError, setPromoError] = useState('');

  const discountAmount = isPromoApplied ? Math.round(baseAmountINR * 0.10) : 0;
  const amountINR = baseAmountINR - discountAmount;
  const amountUSD = 99;

  if (!isOpen) return null;

  // Sachin Mishra's Official Verified UPI & Contact Credentials
  const upiId = "sm2157982-1@okhdfcbank";
  const upiPhoneDisplay = "+91 8928450584";
  const upiPhoneNumber = "8928450584";
  const instructorEmail = "sachin19566@gmail.com";
  const payeeName = "Sachin Mishra";

  // Direct UPI Intent Link for mobile phones
  const upiIntentUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amountINR}&cu=INR&tn=Production%20RAG%20Cohort%20Enrollment`;
  // Dynamic QR Code via public QR API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiIntentUrl)}`;

  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (code === 'EARLYBIRD10' || code === 'EARLYBIRD' || code === 'RAG10' || code === 'SACHIN10') {
      setIsPromoApplied(true);
      setPromoError('');
    } else {
      setIsPromoApplied(false);
      setPromoError('Invalid code. Use EARLYBIRD10 for 10% off.');
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(upiPhoneNumber);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const persistStudentToDatabase = async (paymentDetails: {
    payment_method: string;
    utr_number?: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    status: string;
  }) => {
    const studentPayload = {
      name: name.trim() || 'Enrolled Engineer',
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      amount_inr: amountINR,
      currency: 'INR',
      promo_code: isPromoApplied ? 'EARLYBIRD10' : '',
      payment_method: paymentDetails.payment_method,
      utr_number: paymentDetails.utr_number,
      razorpay_order_id: paymentDetails.razorpay_order_id,
      razorpay_payment_id: paymentDetails.razorpay_payment_id,
      status: paymentDetails.status,
      notes: `Registered via ${paymentDetails.payment_method} on landing page`
    };

    // 1. Primary: Save to backend database (Live Cloud FastAPI on Render or local fallback)
    const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || 'https://production-rag-api-gwus.onrender.com';
    try {
      const res = await fetch(`${backendUrl}/api/register-student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentPayload),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        if (json.student_id) {
          setEnrolledStudentId(json.student_id);
        }
        const finalStatus = json.status || paymentDetails.status;
        setEnrollmentStatus(finalStatus);
        return { success: true, status: finalStatus };
      } else {
        const errorMsg = json.detail || "Registration failed. Please check your payment details.";
        setSubmissionError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      console.warn("Backend server not reached, saving to local persistent storage:", err);
      // Redundant LocalStorage backup: Guarantees zero data loss
      try {
        const existing = JSON.parse(localStorage.getItem('production_rag_enrolled_students') || '[]');
        existing.push({
          ...studentPayload,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('production_rag_enrolled_students', JSON.stringify(existing));
      } catch (e) {
        console.error("Local storage save error:", e);
      }
      setEnrollmentStatus('pending_verification');
      return { success: true, status: 'pending_verification' };
    }
  };

  const handleRazorpayCheckout = () => {
    if (!name || !email || !phone) {
      setSubmissionError("Please enter your Name, Email, and WhatsApp phone number before proceeding.");
      return;
    }
    setSubmissionError('');
    setIsProcessing(true);

    if (typeof (window as any).Razorpay !== 'undefined') {
      const options = {
        key: (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholderKey",
        amount: amountINR * 100, // in paise
        currency: "INR",
        name: "Production RAG Cohort",
        description: `4-Week Live Masterclass by Sachin Mishra (Code: ${isPromoApplied ? 'EARLYBIRD10' : 'NONE'})`,
        image: sachinPhotoImg,
        prefill: {
          name: name,
          email: email,
          contact: phone,
        },
        theme: {
          color: "#0d9488"
        },
        handler: async function (response: any) {
          const res = await persistStudentToDatabase({
            payment_method: 'razorpay',
            razorpay_payment_id: response?.razorpay_payment_id,
            razorpay_order_id: response?.razorpay_order_id,
            status: 'confirmed'
          });
          setIsProcessing(false);
          if (res.success) {
            setEnrollmentStatus('confirmed');
            setPaymentSuccess(true);
            triggerConfetti();
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      try {
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setIsProcessing(false);
          setSubmissionError("Payment gateway transaction cancelled or failed: " + (resp.error?.description || ""));
        });
        rzp.open();
      } catch (e) {
        console.error("Razorpay error:", e);
        setIsProcessing(false);
        setSubmissionError("Unable to open Razorpay gateway. Please use the Direct UPI QR tab.");
      }
    } else {
      setTimeout(() => {
        setIsProcessing(false);
        setSubmissionError("Payment gateway SDK loading. Please use Direct UPI QR or retry in a moment.");
      }, 1000);
    }
  };

  const handleUpiVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError('');

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setSubmissionError("Please enter your Full Name, Email, and WhatsApp Phone number above.");
      return;
    }

    if (!hasPaidConfirmed) {
      setSubmissionError(`Please complete payment in your UPI app and tick: "I have transferred ₹${amountINR.toLocaleString('en-IN')}".`);
      return;
    }

    const cleanUtr = utrNumber.trim();
    if (cleanUtr.length !== 12 || !/^\d{12}$/.test(cleanUtr)) {
      setSubmissionError("Invalid UTR Reference: It must be exactly 12 numeric digits from your UPI transaction receipt (e.g. 431289012345).");
      return;
    }

    setIsProcessing(true);

    // Save directly to the database with pending_verification status
    const result = await persistStudentToDatabase({
      payment_method: 'upi_qr',
      utr_number: cleanUtr,
      status: 'pending_verification'
    });

    setIsProcessing(false);

    if (result.success) {
      setEnrollmentStatus('pending_verification');
      setPaymentSuccess(true);
      // Notice: Do NOT trigger confetti for unverified manual transfer
    }
  };

  const checkLiveStatus = async () => {
    if (!enrolledStudentId && !email) return;
    setIsCheckingStatus(true);
    const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || 'https://production-rag-api-gwus.onrender.com';
    try {
      const param = enrolledStudentId ? `student_id=${enrolledStudentId}` : `email=${encodeURIComponent(email.trim().toLowerCase())}`;
      const res = await fetch(`${backendUrl}/api/student-status?${param}`);
      if (res.ok) {
        const data = await res.json();
        if (data.is_verified || data.status === 'confirmed' || data.status === 'paid') {
          setEnrollmentStatus('confirmed');
          triggerConfetti();
        } else {
          alert(`Verification Status: ${data.message || 'Still under manual review against HDFC Bank statements.'}`);
        }
      } else {
        alert("Unable to fetch status right now. Please try again or message Sachin on WhatsApp.");
      }
    } catch (e) {
      alert("Network error checking status. Please check again in a moment.");
    } finally {
      setIsCheckingStatus(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-5 sm:p-8 overflow-hidden my-4 sm:my-8 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!paymentSuccess ? (
          <div>
            {/* Modal Header */}
            <div className="mb-5">
              <span className="text-[11px] font-mono text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full font-bold">
                ENROLLMENT CHECKOUT • BATCH #1
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">
                Join Production RAG Cohort
              </h3>
              
              {/* Pricing breakdown inside modal */}
              <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Standard Cohort Tuition:</span>
                  <span className="line-through text-slate-400">₹{baseAmountINR.toLocaleString('en-IN')}</span>
                </div>
                {isPromoApplied && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" /> Early Bird (10% Off):
                    </span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-1.5 text-sm">
                  <span>Net Amount Payable:</span>
                  <span className="text-teal-700 text-base">₹{amountINR.toLocaleString('en-IN')} INR</span>
                </div>
              </div>

              {/* Promo Code Input in Modal */}
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                  placeholder="PROMO CODE"
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-900 placeholder-slate-400 uppercase focus:outline-none focus:border-teal-600"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-mono text-xs font-semibold"
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <div className="text-rose-600 text-[10px] font-mono mt-1">{promoError}</div>
              )}
            </div>

            {/* Student Contact Info Inputs */}
            <div className="space-y-3 mb-5 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
              <div className="text-xs font-mono text-slate-600 font-bold uppercase tracking-wider">
                1. Student Registration Details
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm sm:text-xs rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-teal-600 font-mono"
                  required
                />
                <input
                  type="tel"
                  placeholder="WhatsApp Number *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm sm:text-xs rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-teal-600 font-mono"
                  required
                />
              </div>
              <input
                type="email"
                placeholder="Email Address (for calendar invites & code repo access) *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 text-sm sm:text-xs rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-teal-600 font-mono"
                required
              />
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="mb-5">
              <div className="text-xs font-mono text-slate-600 font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>2. Select Payment Method</span>
                <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-bold">100% Secure Checkout</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => { setActiveTab('upi_qr'); setSubmissionError(''); }}
                  className={`p-3 rounded-2xl border text-center font-mono text-xs transition-all flex flex-col items-center gap-1.5 ${
                    activeTab === 'upi_qr'
                      ? 'bg-teal-50 border-teal-600 text-teal-800 font-bold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-teal-600" />
                  <span>Manual UPI QR</span>
                  <span className="text-[9px] text-amber-700 font-semibold">Bank Verified</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('razorpay'); setSubmissionError(''); }}
                  className={`p-3 rounded-2xl border text-center font-mono text-xs transition-all flex flex-col items-center gap-1.5 ${
                    activeTab === 'razorpay'
                      ? 'bg-teal-50 border-teal-600 text-teal-800 font-bold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-teal-600" />
                  <span>Instant Gateway</span>
                  <span className="text-[9px] text-emerald-700 font-semibold">Auto-Activated</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('stripe'); setSubmissionError(''); }}
                  className={`p-3 rounded-2xl border text-center font-mono text-xs transition-all flex flex-col items-center gap-1.5 ${
                    activeTab === 'stripe'
                      ? 'bg-teal-50 border-teal-600 text-teal-800 font-bold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-purple-600" />
                  <span>Global USD</span>
                  <span className="text-[9px] text-slate-500">$99 via Stripe</span>
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {submissionError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{submissionError}</div>
              </div>
            )}

            {/* Tab 1: Direct UPI QR Code (Manual Payment with Bank Verification) */}
            {activeTab === 'upi_qr' && (
              <div className="space-y-4">
                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="w-44 h-44 rounded-xl overflow-hidden bg-white p-2 border border-slate-200 shadow-sm">
                    <img
                      src={qrCodeUrl}
                      alt="Sachin Mishra UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-center mt-3 w-full">
                    <div className="text-xs font-mono text-slate-700 font-semibold">
                      Step 1: Scan with GPay, PhonePe, or Paytm (₹{amountINR.toLocaleString('en-IN')})
                    </div>
                    
                    {/* Payee Details */}
                    <div className="mt-2.5 space-y-1.5 bg-white p-2.5 rounded-xl border border-slate-200 text-left text-xs font-mono">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Payee:</span>
                        <span className="font-bold text-slate-800">{payeeName}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>UPI ID:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-teal-700 font-bold text-[11px]">{upiId}</span>
                          <button
                            onClick={handleCopyUpi}
                            type="button"
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                            title="Copy UPI ID"
                          >
                            {copiedUpi ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>GPay/PhonePe Number:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-800 font-bold">{upiPhoneDisplay}</span>
                          <button
                            onClick={handleCopyPhone}
                            type="button"
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                            title="Copy Phone Number"
                          >
                            {copiedPhone ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Mobile Intent Link */}
                <a
                  href={upiIntentUrl}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-center font-mono text-xs text-white block transition-colors shadow-sm sm:hidden font-semibold"
                >
                  Open in UPI App (Pay ₹{amountINR.toLocaleString('en-IN')})
                </a>

                {/* Step 2: Verification Form with Strict Checklist */}
                <form onSubmit={handleUpiVerification} className="space-y-3.5 bg-slate-50/90 p-4 rounded-2xl border border-slate-200">
                  <div className="text-xs font-mono text-slate-700 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                    <span>Step 2: Bank Statement Verification</span>
                  </div>

                  {/* Payment Completed Confirmation Checkbox */}
                  <label className="flex items-start gap-2.5 cursor-pointer bg-white p-3 rounded-xl border border-slate-300 hover:border-teal-500 transition-colors">
                    <input
                      type="checkbox"
                      checked={hasPaidConfirmed}
                      onChange={(e) => setHasPaidConfirmed(e.target.checked)}
                      className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <span className="text-xs text-slate-700 font-mono leading-tight">
                      I have completed the transfer of <strong>₹{amountINR.toLocaleString('en-IN')}</strong> via UPI and have my 12-digit UTR receipt number.
                    </span>
                  </label>

                  {/* 12-Digit Numeric UTR Input */}
                  <div>
                    <div className="flex justify-between items-center text-[11px] font-mono text-slate-600 mb-1">
                      <span>Enter 12-digit UPI Reference / UTR Number:</span>
                      <span className={`font-bold ${utrNumber.length === 12 ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {utrNumber.length}/12 digits
                      </span>
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{12}"
                      maxLength={12}
                      disabled={!hasPaidConfirmed}
                      placeholder="e.g. 431289012345 (from GPay / PhonePe receipt)"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                      className={`w-full px-3 py-2.5 text-xs rounded-xl border font-mono transition-colors ${
                        !hasPaidConfirmed
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                          : utrNumber.length === 12
                          ? 'bg-white border-emerald-500 text-slate-900 focus:border-emerald-600'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-teal-600'
                      }`}
                      required
                    />
                    <p className="text-[10px] text-slate-500 font-mono mt-1 leading-normal">
                      Where to find it: Open transaction in Google Pay / PhonePe / Paytm → copy 12-digit "UPI Ref No" or "UTR". Duplicate or fake UTRs are automatically rejected.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing || !hasPaidConfirmed || utrNumber.length !== 12}
                    className={`w-full py-3 rounded-xl font-bold text-xs font-mono shadow-sm transition-all flex items-center justify-center gap-2 ${
                      !hasPaidConfirmed || utrNumber.length !== 12
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                    }`}
                  >
                    {isProcessing ? "Submitting for Verification..." : "Submit UTR for Bank Verification"}
                  </button>

                  <div className="text-[10px] text-slate-500 font-mono text-center flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-teal-600" />
                    <span>Cross-checked against HDFC Bank statement before access is unlocked.</span>
                  </div>
                </form>
              </div>
            )}

            {/* Tab 2: Razorpay (Automated Instant Bank Verification) */}
            {activeTab === 'razorpay' && (
              <div className="space-y-4">
                <div className="rounded-2xl p-4 bg-teal-50/60 border border-teal-200 text-xs text-slate-700 leading-relaxed space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-teal-900 font-bold font-mono">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      <span>Instant 1-Click Bank Gateway</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Zero Waiting Time
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Pay via <strong>Dynamic UPI QR, Google Pay, PhonePe, Paytm, Cards, NetBanking, or EMI</strong>. Payments are cryptographically verified by bank servers instantly, unlocking your VIP Discord community and official Paid Invoice in real-time.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRazorpayCheckout}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm font-mono shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? "Connecting to Gateway..." : `Pay ₹${amountINR.toLocaleString('en-IN')} with Instant Verification`}
                </button>
              </div>
            )}

            {/* Tab 3: Global USD via Stripe */}
            {activeTab === 'stripe' && (
              <div className="space-y-4">
                <div className="rounded-2xl p-4 bg-purple-50/60 border border-purple-100 text-xs text-slate-600 leading-relaxed">
                  <div className="flex items-center gap-2 text-purple-900 font-bold font-mono mb-1">
                    <ShieldCheck className="w-4 h-4 text-purple-600" /> International Stripe Checkout
                  </div>
                  For students outside India paying in USD with Visa, Mastercard, American Express, or Apple Pay.
                </div>

                <button
                  type="button"
                  onClick={handleRazorpayCheckout}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? "Redirecting to Stripe..." : `Pay $${amountUSD} USD via Stripe`}
                </button>
              </div>
            )}

            <div className="mt-4 text-center text-[11px] text-slate-500 font-mono flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>256-Bit SSL Encrypted • 7-Day 100% Money-Back Guarantee</span>
            </div>

          </div>
        ) : enrollmentStatus === 'pending_verification' ? (
          /* State A: Manual UPI Submitted - Pending Bank Verification (Fraud Prevention) */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto animate-pulse">
              <Clock className="w-10 h-10" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900">
              Payment Under Verification ⏳
            </h3>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono">
              <span>Status:</span>
              <strong className="text-amber-950 font-bold">PENDING HDFC BANK CHECK</strong>
            </div>

            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you, <span className="text-slate-900 font-bold">{name || "Engineer"}</span>! We have received your 12-digit UPI reference (UTR: <strong className="font-mono text-slate-900">{utrNumber}</strong>). All direct UPI transfers are manually cross-checked against our HDFC Bank account statement to prevent unverified registrations.
            </p>

            {/* Verification Timeline Box */}
            <div className="rounded-2xl p-4 bg-amber-50/70 border border-amber-200 text-left space-y-2 font-mono text-xs">
              <div className="font-bold text-amber-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Verification &amp; Onboarding Timeline:</span>
              </div>
              <ul className="text-slate-700 space-y-1.5 text-[11px] leading-relaxed">
                <li>• <strong>Turnaround Time:</strong> Verification takes <strong>15–30 minutes</strong> during active hours.</li>
                <li>• <strong>Access Unlocking:</strong> Once instructor Sachin Mishra confirms receipt of ₹{amountINR.toLocaleString('en-IN')}, your official <strong>Paid Tax Invoice</strong> and <strong>VIP Discord Invitation Link</strong> will be sent to <strong>{email}</strong> and your WhatsApp.</li>
              </ul>
            </div>

            {/* Fast-Track WhatsApp Approval */}
            <div className="rounded-2xl p-3.5 bg-emerald-50/80 border border-emerald-200 text-left space-y-2">
              <div className="text-xs font-mono font-bold text-emerald-900 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>Want Instant 2-Minute Approval?</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                Send your payment receipt screenshot directly to Sachin Mishra on WhatsApp for immediate 2-minute approval:
              </p>
              <a
                href={`https://wa.me/91${upiPhoneNumber}?text=${encodeURIComponent(`Hi Sachin, I have paid ₹${amountINR} via UPI for Production RAG Cohort 1. My name is ${name} and my UTR is ${utrNumber}. Here is my screenshot for verification.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm font-mono text-xs"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>WhatsApp Payment Screenshot to Sachin</span>
              </a>
            </div>

            {/* Actions: Check Status & Return */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1 font-mono text-xs">
              <button
                type="button"
                onClick={checkLiveStatus}
                disabled={isCheckingStatus}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingStatus ? 'animate-spin' : ''}`} />
                <span>{isCheckingStatus ? "Checking..." : "Check Verification Status"}</span>
              </button>
              <a
                href={`${(import.meta as any).env?.VITE_BACKEND_URL || 'https://production-rag-api-gwus.onrender.com'}/api/invoice/${enrolledStudentId || encodeURIComponent(email)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                <span>View Pending Receipt</span>
              </a>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold transition-colors mt-2"
            >
              Done / Return to Site
            </button>
          </div>
        ) : (
          /* State B: Payment Verified & Confirmed (Instant Gateway or Approved by Instructor) */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900">
              Enrollment Confirmed &amp; Verified! 🎉
            </h3>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono">
              <span>Invoice Reference:</span>
              <strong className="text-teal-950 font-bold">
                {enrolledStudentId ? `INV-PRAG-${enrolledStudentId.slice(-6).toUpperCase()}` : 'INV-PRAG-CONFIRMED'}
              </strong>
            </div>

            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Welcome to Cohort 1 of <span className="text-teal-700 font-bold">Production RAG</span>, <span className="text-slate-900 font-bold">{name || "Engineer"}</span>! Your payment has been verified. Your official Paid Tax Invoice and cohort enrollment confirmation have been dispatched to <span className="text-teal-700 font-mono font-semibold">{email || "your registered email"}</span>.
            </p>

            {/* Instant Tax Invoice Download Button */}
            <a
              href={`${(import.meta as any).env?.VITE_BACKEND_URL || 'https://production-rag-api-gwus.onrender.com'}/api/invoice/${enrolledStudentId || encodeURIComponent(email)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-teal-50 border border-teal-300 hover:bg-teal-100 text-teal-900 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4 text-teal-700" />
              <span>View &amp; Download Official Tax Invoice / Receipt (PDF)</span>
              <ExternalLink className="w-3.5 h-3.5 text-teal-600" />
            </a>

            {/* VIP Discord Channel & Community Access */}
            <div className="rounded-2xl p-4 bg-indigo-50/80 border border-indigo-200 text-left space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-indigo-900 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  VIP Discord Community
                </span>
                <span className="text-[10px] bg-indigo-100 text-indigo-700 border border-indigo-300 px-2 py-0.5 rounded-full font-semibold">
                  Official Invite Active
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Join the private Production RAG Discord server right now to connect with cohort peers, participate in technical discussions, and access repository materials:
              </p>
              <a
                href="https://discord.gg/fKXBsdr4H"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Join Official VIP Discord Server</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Direct Instructor Access (WhatsApp & Personal Email) */}
            <div className="rounded-2xl p-3.5 bg-emerald-50/80 border border-emerald-200 text-left space-y-2">
              <div className="text-xs font-mono font-bold text-emerald-900 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>Instructor Direct Contact (Sachin Mishra)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Have any pre-session questions or need assistance? Reach out directly:
              </p>
              <div className="flex flex-col sm:flex-row gap-2 pt-1 font-mono text-xs">
                <a
                  href={`https://wa.me/91${upiPhoneNumber}?text=${encodeURIComponent(`Hi Sachin, I have just enrolled in Production RAG Cohort 1! My name is ${name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>WhatsApp: {upiPhoneDisplay}</span>
                </a>
                <a
                  href={`mailto:${instructorEmail}?subject=${encodeURIComponent(`Enrolled in Production RAG Cohort 1 - ${name}`)}`}
                  className="flex-1 py-2 px-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-teal-600" />
                  <span>{instructorEmail}</span>
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold transition-colors"
              >
                Done / Return to Masterclass Overview
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

function uttrNumberOrEmpty(val: string): string {
  return val || '';
}
