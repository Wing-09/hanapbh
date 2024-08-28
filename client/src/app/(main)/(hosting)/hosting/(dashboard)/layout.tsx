import HostingAside from "@/components/page/hosting/aside/HostingAside";
import HostingHeader from "@/components/page/hosting/header/HostingHeader";
import { Suspense } from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <div className="grow bg-muted/40">
        <HostingAside />
        <div className="flex flex-col sm:pl-14">
          <HostingHeader />
          {children}
        </div>
      </div>
    </Suspense>
  );
}
