import { Property } from "./data-type";

export type ServerResponse = {
  status:
    | "OK"
    | "UNAUTHORIZED"
    | "NOT_FOUND"
    | "INTERNAL_SERVER_ERROR"
    | "CONFLICT"
    | "FORBIDDEN"
    | "BAD_REQUEST"
    | "CREATED"
    | "OUT_OF_BOUND";

  message: string;
  data: unknown; // the data is left to be `unknown` for developer to use `as`
};

export type GOOGLENearbyPropertyResponse = {
  result: Property[];
  google_next_page_token: string;
};
