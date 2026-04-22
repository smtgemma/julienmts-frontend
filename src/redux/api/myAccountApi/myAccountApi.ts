import baseApi from "../baseApi";

export const myAccountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // get my account list 
    myAccountList: builder.query({
      query: () => ({
        url: "/meeting/company",
        method: "GET",
      }),
      providesTags: ["MyAccount"],
    }),
    // get single acount details 
    singleAccountDetails: builder.query({
      query: (id: string) => ({
        url: `/meeting/company/${id}/account-details`,
        method: "GET",
      }),
      providesTags: ["MyAccount"],
    }),

    // conversation history api for summery button 
    conversationHistory: builder.query({
      query: ({ meeting_id, session_id }) => ({
        url: `/meeting/${meeting_id}/history?session_id=${session_id}`,
        method: "GET",
      }),
    }),

    // conversation recording api for replay button 
    // conversationRecording: builder.query({
    //   query: ({ meeting_id, session_id }) => ({
    //     url: `/meeting/${meeting_id}/recording?session_id=${session_id}`,
    //     method: "GET",
    //   }),
    // }),

    // conversation insights api for insights button 
    conversationInsights: builder.query({
      query: ({ meeting_id, session_id }) => ({
        url: `/meeting/${meeting_id}/analytics?session_id=${session_id}`,
        method: "GET",
      }),
    }),

  }),
});

export const {
  useMyAccountListQuery,
  useSingleAccountDetailsQuery,
  useConversationHistoryQuery,
  // useConversationRecordingQuery,
  useConversationInsightsQuery,
} = myAccountApi;
