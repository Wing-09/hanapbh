import { Lodging } from "./data-type";

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
  data: unknown;
};

export type NearbyLodgingResponse = {
  result: Lodging[];
  google_next_page_token: string;
};
