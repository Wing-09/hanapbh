"use client";

import useHTTPRequest from "@/components/hooks/useHTTPRequest";
import { Property } from "@/lib/types/data-type";
import { ServerResponse } from "@/lib/types/server-response";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property>();
  const [response_status, setResponseStatus] =
    useState<ServerResponse["status"]>();

  const http_request = useHTTPRequest();

  useEffect(() => {
    async function getProperty() {
      const { data, status } = await http_request.GET("/v1/property/" + params.id);

      setResponseStatus(status);
      if (status !== "OK") return;

      setProperty(data as Property);
    }

    getProperty();
  }, []);

  if (response_status !== "OK") return null;

  return <p>{params.id}</p>;
}
