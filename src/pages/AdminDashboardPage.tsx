import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Users, FileText, Trash2, Shield,
  Search, Loader2, UserCheck, Clock, AlertCircle,
  XCircle, CreditCard, ChevronDown, RefreshCw, Stethoscope,
  Mail, KeyRound, ShieldCheck, LogOut, Eye, EyeOff,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useNavigate } from "react-router-dom";
import { admin } from "@/services/api";
import { toast } from "@/hooks/use-toast";

const ADMIN_SESSION_KEY = "medannot_admin_session";

interface AdminStats {
  totalUsers: number;
  signupsLast30Days: number;
  totalPatients: number;
  totalAnnotations: number;
  byStatus: Record<string, number>;
}

interface AdminUser {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  subscription_status: string;
  stripe_customer_id: string | null;
  created_at: string;
  patient_count: number;
  annotation_count: number;
}

const STATUS_LABELS: Record<string, { label: string; color: string; icon: typeof UserCheck }> = {
  active: { label: "Actif", color: "text-green-400 bg-green-500/20 border-green-500/30", icon: UserCheck },
  trialing: { label: "Essai", color: "text-cyan-400 bg-cyan-500/20 border-cyan-500/30", icon: Clock },
  pending_payment: { label: "En attente", color: "text-orange-400 bg-orange-500/20 border-orange-500/30", icon: CreditCard },
  past_due: { label: "Impaye", color: "text-red-400 bg-red-500/20 border-red-500/30", icon: AlertCircle },
  canceled: { label: "Resilie", color: "text-gray-400 bg-gray-500/20 border-gray-500/30", icon: XCircle },
  unpaid: { label: "Impaye", color: "text-red-400 bg-red-500/20 border-red-500/30", icon: AlertCircle },
  none: { label: "Aucun", color: "text-gray-400 bg-gray-500/20 border-gray-500/30", icon: XCircle },
};

const DEFAULT_STATUS = { label: "Inconnu", color: "text-gray-400 bg-gray-500/20 border-gray-500/30", icon: XCircle };

type Step = "checking" | "login" | "code" | "dashboard";

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  // Auth flow state
  const [step, setStep] = useState<Step>("checking");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");

  // 2FA code state
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeError, setCodeError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Dashboard state
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // On mount: check for existing admin session
  useEffect(() => {
    document.title = "Admin | MedAnnot";

    const checkSession = async () => {
      const savedToken = localStorage.getItem(ADMIN_SESSION_KEY);
      if (savedToken) {
        try {
          const { valid } = await admin.checkSession(savedToken);
          if (valid) {
            setStep("dashboard");
            return;
          }
        } catch {
          // ignore
        }
        localStorage.removeItem(ADMIN_SESSION_KEY);
      }
      setStep("login");
    };

    checkSession();
  }, []);

  // ====== Step 1: Login (email + password) ======
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoginLoading(true);
    setLoginError("");
    try {
      const result = await admin.login(email.trim(), password);
      setMaskedEmail(result.email);
      setStep("code");
      toast({ title: "Code envoye par email" });
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (error: any) {
      setLoginError(error.message || "Erreur de connexion");
    } finally {
      setLoginLoading(false);
    }
  };

  // ====== Step 2: 2FA code verification ======
  const handleCodeInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...codeDigits];
    newDigits[index] = value.slice(-1);
    setCodeDigits(newDigits);
    setCodeError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newDigits.join("");
    if (fullCode.length === 6) {
      handleVerifyCode(fullCode);
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCodeDigits(pasted.split(""));
      handleVerifyCode(pasted);
    }
  };

  const handleVerifyCode = async (code: string) => {
    setCodeLoading(true);
    setCodeError("");
    try {
      const { token } = await admin.verifyCode(code);
      localStorage.setItem(ADMIN_SESSION_KEY, token);
      setStep("dashboard");
      toast({ title: "Acces autorise" });
    } catch (error: any) {
      setCodeError(error.message || "Code invalide");
      setCodeDigits(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } finally {
      setCodeLoading(false);
    }
  };

  const handleResendCode = async () => {
    setCodeLoading(true);
    setCodeError("");
    try {
      await admin.login(email.trim(), password);
      toast({ title: "Nouveau code envoye" });
      setCodeDigits(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (error: any) {
      setCodeError(error.message || "Erreur lors du renvoi");
    } finally {
      setCodeLoading(false);
    }
  };

  // ====== Dashboard data ======
  const loadData = useCallback(async () => {
    try {
      const [statsData, usersData] = await Promise.all([
        admin.getStats(),
        admin.getUsers(),
      ]);
      setStats(statsData);
      setUsers(usersData);
    } catch (error: any) {
      if (error.status === 403 || error.status === 401) {
        localStorage.removeItem(ADMIN_SESSION_KEY);
        setStep("login");
        toast({ title: "Session expiree", variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (step === "dashboard") {
      loadData();
    }
  }, [step, loadData]);

  const handleUpdateStatus = async (userId: string, newStatus: string) => {
    setActionLoading(userId);
    try {
      await admin.updateUser(userId, { subscription_status: newStatus });
      await loadData();
      toast({ title: "Statut mis a jour" });
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setActionLoading(userId);
    try {
      await admin.deleteUser(userId);
      setShowDeleteConfirm(null);
      await loadData();
      toast({ title: "Utilisateur supprime" });
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setStep("login");
    setEmail("");
    setPassword("");
    setCodeDigits(["", "", "", "", "", ""]);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = !searchQuery ||
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || u.subscription_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // ============ CHECKING SESSION ============
  if (step === "checking") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-white/50 text-sm">Verification...</p>
        </div>
      </div>
    );
  }

  // ============ LOGIN + CODE SCREENS ============
  if (step === "login" || step === "code") {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-blue-900/70 to-teal-900/60" />
        </div>

        <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-8">
              <Logo size="lg" />
            </div>

            <Card className="bg-slate-800/70 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardContent className="p-8">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-red-400" />
                  </div>
                </div>

                <h1 className="text-xl font-bold text-white text-center mb-2">
                  Administration
                </h1>

                {step === "login" ? (
                  <>
                    <p className="text-white/50 text-sm text-center mb-6">
                      Connectez-vous avec un compte administrateur.
                    </p>

                    <form onSubmit={handleLogin} className="space-y-4">
                      {/* Email */}
                      <div>
                        <label className="block text-white/60 text-xs font-medium mb-1.5">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setLoginError(""); }}
                            placeholder="admin@example.com"
                            className="pl-10 bg-slate-700/50 border-white/10 text-white placeholder:text-white/30 h-11"
                            autoFocus
                            required
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-white/60 text-xs font-medium mb-1.5">Mot de passe</label>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
                            placeholder="••••••••"
                            className="pl-10 pr-10 bg-slate-700/50 border-white/10 text-white placeholder:text-white/30 h-11"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {loginError && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <p className="text-red-400 text-sm text-center">{loginError}</p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={loginLoading || !email.trim() || !password}
                        className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-medium py-5 gap-2"
                      >
                        {loginLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Shield className="w-4 h-4" />
                        )}
                        Se connecter
                      </Button>
                    </form>
                  </>
                ) : (
                  <>
                    <p className="text-white/50 text-sm text-center mb-6">
                      Verification en deux etapes
                    </p>

                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-cyan-300 text-sm font-medium">Code envoye !</p>
                          <p className="text-cyan-300/60 text-xs mt-1">
                            Un code a 6 chiffres a ete envoye a <span className="font-mono text-cyan-300">{maskedEmail}</span>. Il expire dans 10 minutes.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Code input */}
                    <div className="flex justify-center gap-2 mb-6" onPaste={handleCodePaste}>
                      {codeDigits.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => { inputRefs.current[i] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleCodeInput(i, e.target.value)}
                          onKeyDown={(e) => handleCodeKeyDown(i, e)}
                          className={`w-12 h-14 text-center text-xl font-bold rounded-xl border bg-slate-700/50 text-white focus:outline-none focus:ring-2 transition-all ${
                            codeError
                              ? "border-red-500/50 focus:ring-red-500/30"
                              : "border-white/15 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                          }`}
                        />
                      ))}
                    </div>

                    {codeError && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                        <p className="text-red-400 text-sm text-center">{codeError}</p>
                      </div>
                    )}

                    {codeLoading && (
                      <div className="flex justify-center mb-4">
                        <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => { setStep("login"); setCodeDigits(["", "", "", "", "", ""]); setCodeError(""); }}
                        className="text-white/40 hover:text-white/70 text-xs transition-colors"
                      >
                        Changer d'email
                      </button>
                      <button
                        onClick={handleResendCode}
                        disabled={codeLoading}
                        className="text-white/40 hover:text-white/70 text-xs transition-colors"
                      >
                        Renvoyer le code
                      </button>
                    </div>
                  </>
                )}

                {/* Back to site */}
                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                  <button
                    onClick={() => navigate("/")}
                    className="text-white/30 hover:text-white/60 text-xs transition-colors"
                  >
                    Retour au site
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ============ DASHBOARD ============
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-blue-900/70 to-teal-900/60" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/15 bg-slate-800/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="md" />
            <div className="hidden sm:flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              <Shield className="w-3 h-3" />
              Admin
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={handleAdminLogout}
            className="text-white/70 hover:text-white hover:bg-white/10 gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Deconnexion</span>
          </Button>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard Admin</h1>
            <p className="text-white/50 text-sm mt-1">Vue d'ensemble de MedAnnot</p>
          </div>
          <Button
            variant="outline"
            onClick={loadData}
            className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Users} label="Utilisateurs" value={stats.totalUsers} sub={`+${stats.signupsLast30Days} ce mois`} color="cyan" />
            <StatCard icon={UserCheck} label="Abonnes actifs" value={(stats.byStatus.active || 0) + (stats.byStatus.trialing || 0)} sub={`${stats.byStatus.trialing || 0} en essai`} color="green" />
            <StatCard icon={Stethoscope} label="Patients" value={stats.totalPatients} sub="Total enregistres" color="blue" />
            <StatCard icon={FileText} label="Annotations" value={stats.totalAnnotations} sub="Total creees" color="teal" />
          </div>
        )}

        {/* Status Breakdown */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {Object.entries(STATUS_LABELS).map(([key, config]) => {
              const count = stats.byStatus[key] || 0;
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => setStatusFilter(statusFilter === key ? "all" : key)}
                  className={`p-3 rounded-xl border transition-all text-left ${
                    statusFilter === key
                      ? "bg-white/10 border-white/30"
                      : "bg-slate-800/50 border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-3.5 h-3.5 ${config.color.split(' ')[0]}`} />
                    <span className="text-xs text-white/50">{config.label}</span>
                  </div>
                  <span className="text-xl font-bold text-white">{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Users Table */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border border-white/10">
          <CardContent className="p-0">
            <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-4 py-3 text-xs font-medium text-white/50 uppercase tracking-wide">Utilisateur</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-white/50 uppercase tracking-wide hidden md:table-cell">Statut</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-white/50 uppercase tracking-wide hidden lg:table-cell">Patients</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-white/50 uppercase tracking-wide hidden lg:table-cell">Annotations</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-white/50 uppercase tracking-wide hidden sm:table-cell">Inscription</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-white/50 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => {
                    const statusConfig = STATUS_LABELS[u.subscription_status] || DEFAULT_STATUS;
                    const StatusIcon = statusConfig.icon;

                    return (
                      <tr key={u.user_id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <span className="text-white font-medium text-sm">{u.full_name || "Sans nom"}</span>
                            <br />
                            <span className="text-white/40 text-xs">{u.email}</span>
                          </div>
                          <div className="md:hidden mt-1">
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${statusConfig.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${statusConfig.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="text-white/70 text-sm">{u.patient_count}</span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="text-white/70 text-sm">{u.annotation_count}</span>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-white/50 text-xs">
                            {new Date(u.created_at).toLocaleDateString('fr-CH')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <div className="relative group">
                              <Button variant="ghost" size="sm" disabled={actionLoading === u.user_id} className="text-white/50 hover:text-white hover:bg-white/10 h-8 px-2 text-xs gap-1">
                                {actionLoading === u.user_id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><span>Statut</span><ChevronDown className="w-3 h-3" /></>}
                              </Button>
                              <div className="absolute right-0 top-full mt-1 bg-slate-800 border border-white/15 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[140px]">
                                {["active", "trialing", "pending_payment", "canceled"].map((s) => (
                                  <button key={s} onClick={() => handleUpdateStatus(u.user_id, s)} className={`w-full text-left px-3 py-2 text-xs hover:bg-white/10 transition-colors first:rounded-t-lg last:rounded-b-lg ${u.subscription_status === s ? "text-cyan-400" : "text-white/70"}`}>
                                    {STATUS_LABELS[s]?.label || s}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {showDeleteConfirm === u.user_id ? (
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(u.user_id)} disabled={actionLoading === u.user_id} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 px-2 text-xs">
                                  {actionLoading === u.user_id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirmer"}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(null)} className="text-white/50 hover:text-white hover:bg-white/10 h-8 px-2 text-xs">
                                  Annuler
                                </Button>
                              </div>
                            ) : (
                              <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(u.user_id)} className="text-white/30 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 p-0">
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-white/40">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>Aucun utilisateur trouve</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: typeof Users;
  label: string;
  value: number;
  sub: string;
  color: "cyan" | "green" | "blue" | "teal";
}) {
  const colors = {
    cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20",
    green: "from-green-500/20 to-green-500/5 border-green-500/20",
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/20",
    teal: "from-teal-500/20 to-teal-500/5 border-teal-500/20",
  };
  const iconColors = {
    cyan: "text-cyan-400 bg-cyan-500/20",
    green: "text-green-400 bg-green-500/20",
    blue: "text-blue-400 bg-blue-500/20",
    teal: "text-teal-400 bg-teal-500/20",
  };

  return (
    <Card className={`bg-gradient-to-br ${colors[color]} border backdrop-blur-sm`}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconColors[color]}`}>
            <Icon className="w-4.5 h-4.5" />
          </div>
          <span className="text-white/60 text-xs font-medium uppercase tracking-wide">{label}</span>
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-white">{value.toLocaleString('fr-CH')}</div>
        <div className="text-xs text-white/40 mt-1">{sub}</div>
      </CardContent>
    </Card>
  );
}
