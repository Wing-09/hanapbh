import HostingHeader from "@/components/page/hosting/header/HostingHeader";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HostingHeader />
      {children}
    </>
  );
}
