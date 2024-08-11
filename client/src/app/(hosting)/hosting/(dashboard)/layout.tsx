import HostingAside from "@/components/page/hosting/aside/HostingAside";
import HostingHeader from "@/components/page/hosting/header/HostingHeader";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grow flex min-h-screen bg-muted/40">
      <HostingAside />
      <div className="grow">
        <HostingHeader />
        {children}
      </div>
    </div>
  );
}
