import { baseApi } from "@/redux/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["currentUser"],
    }),

    signOut: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["currentUser"],
    }),
  }),
});

export const { useLoginMutation, useSignOutMutation } = authApi;
