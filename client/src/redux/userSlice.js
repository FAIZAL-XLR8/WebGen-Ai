import { createSlice } from "@reduxjs/toolkit";

const userSlice=createSlice({
    name:"user",
    initialState:{
        userData:null
    },
    reducers:{
        //inside are the actions which has to be exported so that
        //we can dispatch using these actions
        setUserData:(state,action)=>{
          state.userData=action.payload
        }
    }

})

export const {setUserData}=userSlice.actions
export default userSlice.reducer //exported the reducer to be used in store