export function RoleBadge({ role }: { role: "owner" | "admin" | "member" }) {
  const styles =
    role === "owner"
      ? "bg-brand text-white"
      : role === "admin"
        ? "bg-accent text-white"
        : "bg-surface text-foreground border border-border";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles}`}>
      {role}
    </span>
  );
}
