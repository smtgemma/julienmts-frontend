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

    // meeting company representitives 
    meetingCompanyRepresentitive: builder.mutation({
      query: (body) => ({
        url: `/meeting/company/:companyId/representatives`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Meeting"],
    }),
  }),
});

export const {
  useMeetingSalesPersonMutation,
  useMeetngCompanyMutation,
  useMeetingCompanyRepresentitiveMutation,
} = startMettingApi;
