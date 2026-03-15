import { createSlice } from "@reduxjs/toolkit";
import { StartMeetingState } from "@/interfaces/global";


// Initial State
const initialState: StartMeetingState = {
    product: null,
    participants: [],
    companyData: null,
    payloadData: null,
};


const StartMeetingSlice = createSlice({
    name: "startMeeting",
    initialState,
    reducers: {
        // first step 
        setProductValue: (state, action) => {
            // console.log(action, "=======================setProductValue")
            state.product = action.payload
        },
        // second step 
        setCompanyData: (state, action) => {
            // console.log(action, "=====================setCompanyData")
            state.companyData = action.payload
        },

        //third step 
        setParticipantsValue: (state, action) => {
            // console.log(action, "=======================setParticipantsValue")
            state.participants = action.payload
        },

        // meeting payload 
        setMeetingPayload: (state, action) => {
            console.log(action, "===============================meeting payload")
            state.payloadData = action.payload;
        },
    }
})

export const { setProductValue, setParticipantsValue, setCompanyData, setMeetingPayload } = StartMeetingSlice.actions;
export default StartMeetingSlice.reducer;