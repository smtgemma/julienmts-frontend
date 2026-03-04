import baseApi from "../baseApi";

export const startMettingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // /meeting/salesperson for create sales id
    meetingSalesPerson: builder.mutation({
      query: (body) => ({
        url: "/meeting/salesperson",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Meeting"]
    }),

    // meeting company for crete compoany id
    meetngCompany: builder.mutation({
      query: (body) => ({
        url: "/meeting/company",   
        method: "POST",
        body,
      }),
      invalidatesTags: ["Meeting"],
    }),

    // // meeting company representitives 
    // meetingCompanyRepresentitive: builder.mutation({
    //   query: ({companyId, payload}) => ({
    //     url: `/meeting/company/${companyId}/representatives`,
    //     method: "POST",
    //     body: payload,
    //   }),
    //   invalidatesTags: ["Meeting"],
    // }),
    meetingCompanyRepresentitive: builder.mutation({
  query: ({ companyId, participants }) => ({
    url: `/meeting/company/${companyId}/representatives`,
    method: "POST",
    body: participants, // ✅ send array directly, not wrapped in an object
  }),
}),
  }),
});

export const {
  useMeetingSalesPersonMutation,
  useMeetngCompanyMutation,
  useMeetingCompanyRepresentitiveMutation,
} = startMettingApi;
