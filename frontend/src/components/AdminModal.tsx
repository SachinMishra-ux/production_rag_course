import React, { useState, useEffect } from 'react';
import { X, Users, Download, RefreshCw, CheckCircle2, Shield, Search, Database, ExternalLink } from 'lucide-react';
import { fetchAllStudents, BACKEND_URL, StudentRecord } from '../api';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    const data = await fetchAllStudents();
    setStudents(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.utr_number && s.utr_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.phone && s.phone.includes(searchTerm))
  );

  const totalRevenue = students.reduce((acc, s) => acc + (s.amount_inr || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
              <Database className="w-3.5 h-3.5 text-teal-600" /> LIVE MONGODB ATLAS ROSTER
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              Instructor Student Dashboard
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Live registration records synced directly from MongoDB Atlas cluster.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
              title="Refresh Roster"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center">
            <div className="text-xs font-semibold text-slate-500">Total Enrolled</div>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">{students.length} / 35</div>
          </div>
          <div className="bg-teal-50/60 rounded-2xl p-4 border border-teal-200 text-center">
            <div className="text-xs font-semibold text-teal-800">Seats Remaining</div>
            <div className="text-2xl font-black text-teal-700 font-mono mt-1">{Math.max(0, 35 - students.length)}</div>
          </div>
          <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200 text-center">
            <div className="text-xs font-semibold text-emerald-800">Collected Tuition</div>
            <div className="text-2xl font-black text-emerald-700 font-mono mt-1">₹{totalRevenue.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, UTR..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-teal-500 text-slate-800"
            />
          </div>

          <a
            href={`${BACKEND_URL}/api/export-students-csv`}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Spreadsheet</span>
          </a>
        </div>

        {/* Students Table */}
        <div className="flex-1 overflow-y-auto border border-slate-200 rounded-2xl">
          {isLoading ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-teal-600" />
              Loading records from MongoDB Atlas...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              {searchTerm ? "No students matching your search." : "No student enrollments registered yet. New payments will appear here instantly!"}
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Payment Info</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s, idx) => (
                  <tr key={s.id || idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{s.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{s.id?.slice(-8)}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="text-slate-700">{s.email}</div>
                      <div className="text-[11px] text-teal-700 font-mono">{s.phone}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      ₹{s.amount_inr?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 uppercase">
                        {s.payment_method}
                      </span>
                      {s.utr_number && (
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                          UTR: <span className="font-semibold text-slate-800">{s.utr_number}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {s.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-400 font-mono whitespace-nowrap">
                      {s.created_at ? new Date(s.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div>Cluster: <span className="font-mono text-slate-600">productionrag.xpcr24m.mongodb.net</span></div>
          <a
            href={`${BACKEND_URL}/docs`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium"
          >
            <span>Open FastAPI Swagger Docs</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
};
