
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { json } from "react-router-dom";

const loginAdmin = createAsyncThunk('api/login-admin', (adminInfo, {rejectWithValue})=> {
    return new Promise((resolve, reject) => {
        axios
          .post('http://localhost:5000/admin/login', adminInfo, {
            headers: { 'Content-Type': 'application/json' },withCredentials: true
          })
          .then(response => {
            console.log(response.data)
            resolve(response.data);
          })
          .catch(err => {
            
            reject(rejectWithValue(err));
          });
      });
});

const adminInfoSlice = createSlice({
    name: 'admin',
    initialState: {
        loading : false,
        admin: null,
        error: null
    },
    reducers: {
        clearAdmin: (state, action)=> {
            state.admin = null
        },
        clearError : (state, action)=> {
            state.error = null
        },
        currentAdmin : (state, action)=> {
            state.admin = JSON.parse(localStorage.getItem('admin'))
        },
        adminLogout: (state, action) => {
            Cookies.remove('token')
            localStorage.removeItem('admin');
            state.admin = null;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(loginAdmin.pending, (state)=> {
            state.loading = true
        })
        .addCase(loginAdmin.fulfilled, (state, action)=> {
            
                state.loading = false;
                state.error = null;
                state.admin = action.payload.admin
                Cookies.set('token', action.payload.token)
        })
        .addCase(loginAdmin.rejected, (state, action)=> {
            state.loading = false;
            state.error = action.payload
        })
    }
})

export const {clearAdmin, clearError, currentAdmin, adminLogout} = adminInfoSlice.actions
export {loginAdmin}
export default adminInfoSlice.reducer;