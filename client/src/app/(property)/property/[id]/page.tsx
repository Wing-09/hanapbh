"use client";

import useHTTPRequest from "@/components/hooks/useHTTPRequest";
import { Property } from "@/lib/types/data-type";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property>();
  const router = useRouter()
  const http_request = useHTTPRequest();
  useEffect(() => {
    async function getProperty() {
      const {  } = await http_request.DELETE("/");
    }
    router.push()
  }, []);
  return <div>page</div>;
}
