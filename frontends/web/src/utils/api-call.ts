"use server";
import type { paths } from "public/data/api";
import { SERVER_API_URL } from "~/constants/api";

type Path = keyof paths;
type PathMethod<T extends Path> = keyof paths[T];
export type PossibleResponses<
  T extends Path,
  M extends PathMethod<T>,
> = "responses" extends keyof paths[T][M]
  ? keyof paths[T][M]["responses"]
  : never;

export type RequestBody<
  P extends Path,
  M extends PathMethod<P>,
> = paths[P][M] extends {
  requestBody: Record<string | number, any>;
}
  ? paths[P][M]["requestBody"]["content"]["application/json"]
  : undefined;

export type RequestParams<
  P extends Path,
  M extends PathMethod<P>,
> = paths[P][M] extends {
  parameters: any;
}
  ? paths[P][M]["parameters"]["query"]
  : undefined;

export type OkResponseType<
  P extends Path,
  M extends PathMethod<P>,
> = paths[P][M] extends {
  responses: {
    200: { content: { "application/json": any } };
  };
}
  ? paths[P][M]["responses"][200]["content"]["application/json"]
  : undefined;

export type ResponseType<
  P extends Path,
  M extends PathMethod<P>,
  Status extends number,
> = paths[P][M] extends {
  responses: {
    [key in Status]: { content: { "application/json": any } };
  };
}
  ? paths[P][M]["responses"][Status]["content"]["application/json"]
  : undefined;
export type UnauthorizedResponseType<
  P extends Path,
  M extends PathMethod<P>,
> = paths[P][M] extends {
  responses: {
    401: { content: { "application/json": any } };
  };
}
  ? paths[P][M]["responses"][401]["content"]["application/json"]
  : undefined;

interface ApiCallProps<P extends Path, M extends PathMethod<P>> {
  url: P;
  method?: M;
  params?: RequestParams<P, M>;
  body?: RequestBody<P, M>;
}
export const apiCall = async <P extends Path, M extends PathMethod<P>>({
  url,
  params,
  method = "get" as M,
  body,
}: ApiCallProps<P, M>): Promise<OkResponseType<P, M>> => {
  const baseUrl = new URL(`${SERVER_API_URL}${String(url)}`);
  const stringBody = body ? JSON.stringify(body) : undefined;

  const createParams = (parameters: Record<string, string | string[]>) => {
    const searchParams = new URLSearchParams();

    for (const key in parameters) {
      const notInUrlParams = [
        "body",
        "headers",
        "method",
        "mode",
        "credentials",
        "cache",
        "redirect",
        "referrer",
        "integrity",
        "keepalive",
        "signal",
        "window",
      ];

      if (notInUrlParams.includes(key)) {
        continue;
      }
      // if its array we need to add each element separately
      if (Array.isArray(parameters[key])) {
        for (const element of parameters[key]) {
          searchParams.append(key, element);
        }
      } else {
        searchParams.append(key, parameters[key]!);
      }
    }
    return searchParams;
  };

  let uri = baseUrl.toString();
  if (params) {
    uri = `${baseUrl}?${
      createParams(params as Record<string, string | string[]>).toString
    }`;
  }
  const mayBody = (method: M) => {
    const bodyMethods = ["post", "put", "patch"];
    const hasBody = bodyMethods.includes(method.toString());
    if (hasBody) {
      return { body: stringBody };
    }
  };
  const init = {
    method: method as string,
    headers: {
      "Content-Type": "application/json",
    },
    ...mayBody(method),
  };
  const res = await fetch(uri, init);
  const statusCode = res.status;
  if (statusCode >= 400) {
    const error = await res.json();
    throw error;
  }
  const json = await res.json();
  return json as OkResponseType<P, M>;
};
