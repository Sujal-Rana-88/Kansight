import { Sidebar } from "../components/sidebar";
import { Navbar } from "../components/navbar";
import { AuthGuard } from "./auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen w-full">
        <div className="flex min-h-screen w-full">
          <Sidebar />
          <div className="flex flex-1 flex-col">
            <Navbar title="Analytics Workspace" />
            <main className="flex-1 px-6 py-6">{children}</main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
