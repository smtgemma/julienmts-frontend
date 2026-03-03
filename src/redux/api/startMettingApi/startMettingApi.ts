import baseApi from "../baseApi";

export const startMettingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // /meeting/salesperson
    meetingSalesPerson: builder.mutation({
      query: (body) => ({
        url: "/meeting/salesperson",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Meeting"]
    })
  }),
});

export const {
  useMeetingSalesPersonMutation,
} = startMettingApi;
