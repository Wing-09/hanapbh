import { ServerResponse } from "@/lib/types/server-response";
import { useToast } from "../ui/use-toast";

type R = {
  /**
   *  Sends a POST request to the specified path with the provided body.
   * @param path - The path on which the request is sent. The `server domain` is `unnecessary`.
   * @param body - The body of the http request
   * @returns {Promise<ServerResponse>} - An `object` containing `status`, `message` and, `data`
   * @see {@link ServerResponse} - For the type structure
   * @example
   *  const http_request = useHTTPRequest()
   *  const {status , message, data} = await http_request.POST("/v1/user", { id: 123 })
   *  // or
   *  const { POST } = useHTTPRequest()
   *  const {status , message, data} = await POST("/v1/user", { id: 123 })
   */
  POST: (path: string, body: any) => Promise<ServerResponse>;
  /**
   * Sends a GET request to the specified URL with optional query parameters.
   * @param {string} path - The path on which the request is sent. The `server domain` is `unnecessary`.
   * @param {Record<string,any>} [query_params] - `(optional)` the query parameter of the url represented as an object
   * @returns {Promise<ServerResponse>} - An `object` containing `status`, `message` and, `data`
   * @see {@link ServerResponse} - For the type structure
   * @example
   *  const http_request = useHTTPRequest()
   *  const {status , message, data} = await http_request.GET("/v1/user")
   *  // the path will become /v1/user?id=123
   *  const {status , message, data} = await http_request.GET("/v1/user", { id: 123 })
   *  // or
   *  const { GET } = useHTTPRequest()
   *  const {status , message, data} = await GET("/v1/user", { id: 123 })
   *  // the path will become /v1/user?id=123
   *  const {status , message, data} = await GET("/v1/user", { id: 123 })
   */
  GET: (
    path: string,
    query_params?: Record<string, any>
  ) => Promise<ServerResponse>;
  /**
   *  Sends a PATCH request to the specified path with the provided body.
   * @param path - The path on which the request is sent. The `server domain` is `unnecessary`.
   * @param body - The body of the http request
   * @returns {Promise<ServerResponse>} - An `object` containing `status`, `message` and, `data`
   * @see {@link ServerResponse} - For the type structure
   * @example
   *  const http_request = useHTTPRequest()
   *  const {status , message, data} = await http_request.PATCH("/v1/user", { id: 123 })
   *  // or
   *  const { PATCH } = useHTTPRequest()
   *  const {status , message, data} = await PATCH("/v1/user", { id: 123 })
   */
  PATCH: (path: string, body: any) => Promise<ServerResponse>;
  /**
   *  Sends a PATCH request to the specified path with the provided body.
   * @param path - The path on which the request is sent. The `server domain` is `unnecessary`.
   * @param body - The body of the http request
   * @throws {Error} - Will throw an `error` if the `url` does not start with `/`
   * @returns {Promise<ServerResponse>} - An `object` containing `status`, `message` and, `data`
   * @see {@link ServerResponse} - For the type structure
   * @example
   *  const http_request = useHTTPRequest()
   *  const {status , message, data} = await http_request.DELETE("/v1/user", { id: 123 })
   *  // or
   *  const { DELETE } = useHTTPRequest()
   *  const {status , message, data} = await DELETE("/v1/user", { id: 123 })
   */
  DELETE: (path: string, body: any) => Promise<ServerResponse>;
};

/**
 * Custom hook to simplify HTTP requests for `POST`, `GET`, `PATCH`, and `DELETE` methods.
 *
 * @returns {R} An object of function that represent each methods: `POST` ,`GET` ,`PATCH` ,`DELETE`
 *
 */

export default function useHTTPRequest(): R {
  const server_url = process.env.NEXT_PUBLIC_SERVER!;
  if (!server_url)
    throw new Error("NEXT_PUBLIC_SERVER is missing from your .env.local file");

  const { toast } = useToast();

  function pathChecker(path: string) {
    if (!path.startsWith("/")) throw new Error("url must start with /");
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

  async function POST<T>(path: string, body: T): Promise<ServerResponse> {
    try {
      pathChecker(path);

      const response = await fetch(server_url + path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      return await responseJSON(response);
    } catch (error) {
      throw error;
    }
  }
  async function GET(
    path: string,
    query_params?: Record<string, any>
  ): Promise<ServerResponse> {
    try {
      pathChecker(path);
      let request = path;
      if (query_params)
        request += "?" + new URLSearchParams(query_params).toString();

      const response = await fetch(server_url + request);

      return await responseJSON(response);
    } catch (error) {
      throw error;
    }
  }

  async function PATCH<T>(path: string, body: T): Promise<ServerResponse> {
    try {
      pathChecker(path);

      const response = await fetch(server_url + path, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      return await responseJSON(response);
    } catch (error) {
      throw error;
    }
  }

  async function DELETE<T>(path: string, body: T): Promise<ServerResponse> {
    try {
      pathChecker(path);

      const response = await fetch(server_url + path, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
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
