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

    // meeting company representitive for crate representitive id 
    meetingCompanyRepresentitive: builder.mutation({
      query: ({ companyId, participants }) => ({
        url: `/meeting/company/${companyId}/representatives`,
        method: "POST",
        body: participants,
      }),
      invalidatesTags: ["Meeting"],
    }),

    // create meeting api  for meeting_id 
    createMeetingId: builder.mutation({
      query: (body) => ({
        url: "/meeting/create", 
        method: "POST",
        body,
      }),
      invalidatesTags: ["Meeting"],
    }),

    // after finishing the meeting call this api 
    updateMeeting: builder.mutation({
      query: ({meetingId, playload}) => ({
        url: `/meeting/${meetingId}/status`,
        method: "PATCH",
        body: playload,
      }),
    }),

  }),
});

export const {
  useMeetingSalesPersonMutation,
  useMeetngCompanyMutation,
  useMeetingCompanyRepresentitiveMutation,
  useCreateMeetingIdMutation,
  useUpdateMeetingMutation,
} = startMettingApi;
