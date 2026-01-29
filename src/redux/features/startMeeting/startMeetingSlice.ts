import { createSlice } from "@reduxjs/toolkit";
import { startMeeting } from "@/interfaces/global";


const initialState: {
    stateMeeting: startMeeting | null
} = {
    stateMeeting: null
}
 
const StartMeetingSlice = createSlice({
    name: "startMeeting",
    initialState,
    reducers: {
        firstStep: (state, action) => {
            state.stateMeeting = action.payload.startMeeting
        }
    }
})

export const {firstStep} = StartMeetingSlice.actions;
export default StartMeetingSlice.reducer;