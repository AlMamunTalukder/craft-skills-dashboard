import {
  type BaseQueryFn,
  createApi,
  type FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { tagTypes } from "./tagTypes";

export const URL = import.meta.env.VITE_API_URL;
export const baseURL = import.meta.env.VITE_API_URL;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  credentials: "include",
});

const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs | string,
  unknown,
  unknown
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const errorData = (result.error as any).data;

    if (errorData?.statusCode === 400 && errorData?.errors) {
      const { fieldErrors = {}, formErrors = [] } = errorData.errors;

      // Convert fieldErrors object to a single string
      const fieldErrorMessages = Object.entries(fieldErrors)
        .map(([key, messages]) => {
          if (Array.isArray(messages)) {
            return `${key}: ${messages.join(", ")}`;
          }
          return `${key}: ${String(messages)}`;
        })
        .join("; ");

      const combinedMessage = [
        errorData.message || "Validation failed",
        ...formErrors,
        fieldErrorMessages,
      ]
        .filter(Boolean)
        .join(". ");

      return {
        error: {
          ...result.error,
          data: {
            message: combinedMessage,
          },
        },
      };
    }

    return result;
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: tagTypes,
  endpoints: () => ({}),
});
