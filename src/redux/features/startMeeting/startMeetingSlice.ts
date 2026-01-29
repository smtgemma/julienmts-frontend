import { createSlice } from "@reduxjs/toolkit";
import { ProductValue } from "@/interfaces/global";


const initialState: {
    stateMeeting: ProductValue | {}
} = {
    stateMeeting: {}
}
 
const StartMeetingSlice = createSlice({
    name: "startMeeting",
    initialState,
    reducers: {
        // first step 
        setProductValue: (state, action) => {
            console.log(action, "=======================")
            state.stateMeeting = action.payload
        }
    }
})

export const {setProductValue} = StartMeetingSlice.actions;
export default StartMeetingSlice.reducer;