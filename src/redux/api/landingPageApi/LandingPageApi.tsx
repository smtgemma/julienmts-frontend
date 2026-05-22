
import baseApi from "../baseApi";

export const landingPageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        //  support contact
        postSupportContact: builder.mutation({
            query: (body) => ({
                url: "/support/contact/public",
                method: "POST",
                body,
            }),
        }),
        // Newsletter Subscribe 
        postNewsletterSubscribe: builder.mutation({
            query: (body) => ({
                url: "/newsletter/subscribe",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { usePostSupportContactMutation, usePostNewsletterSubscribeMutation } = landingPageApi;
