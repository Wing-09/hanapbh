import HostingAside from "@/components/page/hosting/aside/HostingAside";
import HostingHeader from "@/components/page/hosting/header/HostingHeader";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <HostingAside />
      <div className="flex flex-col sm:pl-14">
        <HostingHeader />
        {children}
      </div>
    </div>
  );
}
