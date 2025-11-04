import { baseApi } from "@/redux/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    currentUser: builder.query({
      query: () => ({
        url: "/users/profile",
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["currentUser"],
    }),
  }),
});

export const { useCurrentUserQuery } = userApi;
