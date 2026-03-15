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
        url: `/meeting/company/${id}`,
        method: "GET",
      }),
      providesTags: ["MyAccount"],
    }),

  }),
});

export const {
  useMyAccountListQuery,
  useSingleAccountDetailsQuery,
} = myAccountApi;
