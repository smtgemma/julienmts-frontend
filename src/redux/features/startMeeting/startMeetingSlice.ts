import { createSlice } from "@reduxjs/toolkit";
import { StartMeetingState } from "@/interfaces/global";



// Initial State
const initialState: StartMeetingState = {
    product: null,
    participants: [],
};


const StartMeetingSlice = createSlice({
    name: "startMeeting",
    initialState,
    reducers: {
        // first step 
        setProductValue: (state, action) => {
            console.log(action, "=======================")
            state.product = action.payload
        },
        // second step 
        setParticipantsValue: (state, action) => {
            console.log(action, "=======================")
            state.participants = action.payload
        }
    }
})

export const { setProductValue, setParticipantsValue } = StartMeetingSlice.actions;
export default StartMeetingSlice.reducer;