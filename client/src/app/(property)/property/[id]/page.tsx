"use client";

import useHTTPRequest from "@/components/hooks/useHTTPRequest";
import { Property } from "@/lib/types/data-type";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property>();

  const htp_reqest = useHTTPRequest();
  useEffect(() => {}, []);
  return <div>page</div>;
}
