import { Link } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Lock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { getProfile } from "@/api/auth";
import type { User } from "@/types";

export function Profile() {
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ["profile"], queryFn: () => getProfile(), retry: 1 });
  const user = data?.data as User | undefined;

  if (isLoading) {
    return (
      <div className="container-page py-10">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="shimmer h-24 rounded-2xl" />
          <div className="shimmer h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 ring-1 ring-red-200"><AlertCircle size={26} /></div>
        <h2 className="text-xl font-bold text-foreground">Profile not available</h2>
        <Link to="/login" className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700">
          <ArrowLeft size={16} /> Login again
        </Link>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Profile updated successfully");
      refetch();
    }, 700);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Password changed successfully");
    }, 700);
  };

  const inputClass = "h-11 w-full rounded-xl border border-border bg-muted/30 px-4 text-sm outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100";

  return (
    <div className="bg-mesh min-h-full">
      <div className="container-page py-10">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground"><ArrowLeft size={14} /> Shop</Link>
          <span>/</span>
          <span className="font-medium text-foreground">Profile</span>
        </nav>

        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-foreground">My profile</h1>

          <div className="mb-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="mt-6 space-y-4 border-t border-border pt-6">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-foreground">Full name</label>
                <input id="name" type="text" defaultValue={user.name} value={name || user.name} onChange={(e) => setName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-foreground">Email address</label>
                <input id="email" type="email" value={user.email} disabled className={`${inputClass} cursor-not-allowed bg-muted text-muted-foreground`} />
              </div>
              <button type="submit" disabled={saving} className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
                {saving ? "Saving..." : "Save changes"}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground"><Lock size={18} className="text-indigo-600" /> Change password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="mb-1.5 block text-sm font-semibold text-foreground">Current password</label>
                <input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
              </div>
              <div>
                <label htmlFor="newPassword" className="mb-1.5 block text-sm font-semibold text-foreground">New password</label>
                <input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
              </div>
              <button type="submit" disabled={saving} className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
                {saving ? "Changing..." : "Change password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
