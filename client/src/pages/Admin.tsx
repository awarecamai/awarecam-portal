import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { Users, Activity, Shield, CheckCircle, XCircle, ChevronDown, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

type AdminTab = "users" | "activity";

const roleColors: Record<string, string> = {
  admin: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  reseller: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  integrator: "bg-teal-500/15 text-teal-400 border-teal-500/30",
  end_user: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

const portalRoles = ["reseller", "integrator", "end_user", "admin"] as const;

export default function Admin() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<AdminTab>("users");
  const [search, setSearch] = useState("");

  const portalRole = (user as any)?.portalRole || "end_user";

  // Redirect non-admins
  if (portalRole !== "admin") {
    navigate("/dashboard");
    return null;
  }

  const usersQuery = trpc.users.list.useQuery();
  const activityQuery = trpc.activity.list.useQuery({ limit: 100 });
  const updateRoleMutation = trpc.users.updateRole.useMutation({
    onSuccess: () => { usersQuery.refetch(); toast.success("Role updated"); },
    onError: () => toast.error("Failed to update role"),
  });
  const updateStatusMutation = trpc.users.updateStatus.useMutation({
    onSuccess: () => { usersQuery.refetch(); toast.success("Status updated"); },
    onError: () => toast.error("Failed to update status"),
  });

  const filteredUsers = (usersQuery.data || []).filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
    );
  });

  return (
    <PortalLayout>
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {t("admin.title")}
          </h1>
          <p className="text-muted-foreground">Manage users, roles, and monitor resource access activity.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", value: usersQuery.data?.length || 0, icon: Users, color: "text-primary" },
            { label: "Resellers", value: usersQuery.data?.filter(u => (u as any).portalRole === "reseller").length || 0, icon: Shield, color: "text-blue-400" },
            { label: "Integrators", value: usersQuery.data?.filter(u => (u as any).portalRole === "integrator").length || 0, icon: Shield, color: "text-teal-400" },
            { label: "Activity Events", value: activityQuery.data?.length || 0, icon: Activity, color: "text-orange-400" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="p-4 rounded-xl border border-border bg-card flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <Icon className={cn("w-4 h-4", stat.color)} />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border pb-0">
          {([
            { key: "users", label: t("admin.users"), icon: Users },
            { key: "activity", label: t("admin.activity"), icon: Activity },
          ] as { key: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all -mb-px",
                activeTab === key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-card border-border"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => usersQuery.refetch()}>
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </Button>
            </div>

            {usersQuery.isLoading ? (
              <div className="text-center py-12 text-muted-foreground text-sm">Loading users...</div>
            ) : (
              <div className="rounded-xl border border-border overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("admin.role")}</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("admin.status")}</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("admin.lastActive")}</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("admin.actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-10 text-muted-foreground text-sm">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const pRole = (u as any).portalRole || "end_user";
                        const isActive = (u as any).isActive !== false;
                        const initials = (u.name || "U").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
                        return (
                          <tr key={u.id} className="hover:bg-secondary/30 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                                    {initials}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="text-sm font-medium text-foreground">{u.name || "—"}</div>
                                  <div className="text-xs text-muted-foreground">{u.email || "—"}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className={cn("text-xs capitalize", roleColors[pRole])}>
                                {pRole.replace("_", " ")}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className={cn("flex items-center gap-1.5 text-xs font-medium", isActive ? "text-teal-400" : "text-red-400")}>
                                {isActive ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                {isActive ? "Active" : "Inactive"}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">
                              {u.lastSignedIn ? new Date(u.lastSignedIn).toLocaleDateString() : "—"}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-xs gap-1">
                                    {t("admin.actions")} <ChevronDown className="w-3 h-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {t("admin.assignRole")}
                                  </div>
                                  {portalRoles.map((role) => (
                                    <DropdownMenuItem
                                      key={role}
                                      className={cn("text-xs", pRole === role && "text-primary")}
                                      onClick={() => updateRoleMutation.mutate({ userId: u.id, portalRole: role })}
                                    >
                                      {pRole === role && "✓ "}{role.replace("_", " ")}
                                    </DropdownMenuItem>
                                  ))}
                                  <div className="border-t border-border my-1" />
                                  <DropdownMenuItem
                                    className={cn("text-xs", isActive ? "text-destructive focus:text-destructive" : "text-teal-400 focus:text-teal-400")}
                                    onClick={() => updateStatusMutation.mutate({ userId: u.id, isActive: !isActive })}
                                  >
                                    {isActive ? t("admin.deactivate") : t("admin.activate")}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">Last 100 access events across all users</p>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => activityQuery.refetch()}>
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </Button>
            </div>

            {activityQuery.isLoading ? (
              <div className="text-center py-12 text-muted-foreground text-sm">Loading activity...</div>
            ) : (
              <div className="rounded-xl border border-border overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resource</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(activityQuery.data || []).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-10 text-muted-foreground text-sm">
                          No activity recorded yet
                        </td>
                      </tr>
                    ) : (
                      (activityQuery.data || []).map((log: any) => {
                        const actionColors: Record<string, string> = {
                          view_doc: "text-blue-400",
                          chat_message: "text-primary",
                          login: "text-teal-400",
                        };
                        return (
                          <tr key={log.id} className="hover:bg-secondary/30 transition-colors">
                            <td className="px-4 py-3 text-sm text-foreground">
                              User #{log.userId}
                            </td>
                            <td className="px-4 py-3">
                              <span className={cn("text-xs font-medium", actionColors[log.action] || "text-muted-foreground")}>
                                {log.action?.replace("_", " ")}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate">
                              {log.resourceTitle || log.resourceId || "—"}
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">
                              {log.createdAt ? new Date(log.createdAt).toLocaleString() : "—"}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
