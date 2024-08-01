import { ServerResponse } from "@/lib/types/server-response";
import { useToast } from "../ui/use-toast";

export default function useHTTPRequest() {
  const server_url = process.env.NEXT_PUBLIC_SERVER!;
  if (!server_url)
    throw new Error("NEXT_PUBLIC_SERVER is missing from your .env.local file");

  const { toast } = useToast();

  function urlChecker(url: string) {
    if (!url.startsWith("/")) throw new Error("url must start with /");
  }

  async function responseJSON(response: Response): Promise<ServerResponse> {
    try {
      const response_json = (await response.json()) as ServerResponse;

      if (response_json.status !== "OK" && response_json.status !== "CREATED") {
        toast({
          description: response_json.message,
        });
      }

      return response_json;
    } catch (error) {
      throw error;
    }
  }
  async function POST<T>(url: string, data: T) {
    try {
      urlChecker(url);

      const response = await fetch(server_url + url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return await responseJSON(response);
    } catch (error) {
      throw error;
    }
  }

  async function GET(url: string, search_params?: Record<string, any>) {
    try {
      urlChecker(url);
      let request = url;
      if (search_params)
        request += "?" + new URLSearchParams(search_params).toString();

      const response = await fetch(server_url + request);

      return await responseJSON(response);
    } catch (error) {
      throw error;
    }
  }

  async function PATCH<T>(url: string, data: T) {
    try {
      urlChecker(url);

      const response = await fetch(server_url + url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return await responseJSON(response);
    } catch (error) {
      throw error;
    }
  }
  async function DELETE<T>(url: string, data: T) {
    try {
      urlChecker(url);

      const response = await fetch(server_url + url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return await responseJSON(response);
    } catch (error) {
      throw error;
    }
  }

  return {
    POST,
    GET,
    PATCH,
    DELETE,
  };
}
