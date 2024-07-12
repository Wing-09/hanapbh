type ResponseStatus =
  | "OK"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "INTERNAL_SERVER_ERROR"
  | "CONFLICT"
  | "FORBIDDEN"
  | "BAD_REQUEST"
  | "CREATED";

export default function JSONResponse<T>(
  status: ResponseStatus,
  message: string = "oops! something went wrong",
  data: T | null = null
) {
  return {
    status,
    message,
    data,
  };
}
