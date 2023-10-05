import { createAsyncThunk, createSlice   } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";





const registerUser = createAsyncThunk('api/registeruser', (userinfo,{rejectWithValue})=> {
    return new Promise((resolve,reject)=> {
        axios.post('http://localhost:5000/user/register', userinfo,{
        headers: {"Content-Type": 'application/json'}
    })
    .then(response=> {
        resolve(response.data)
    })
    .catch(err=> {
        const {data, status, statusText} = err.response
            const error = {
                data: data,
                status: status,
                statusText: statusText
            }
            reject(rejectWithValue(error));
    })})
})

const loginUser = createAsyncThunk('api/loginuser', (userinfo, {rejectWithValue})=> {
    return new Promise((resolve, reject) => {
        axios
          .post('http://localhost:5000/user/login', userinfo, {
            headers: { 'Content-Type': 'application/json' }
          })
          .then(response => {
            
            resolve(response.data);
          })
          .catch(err => {
            
            reject(rejectWithValue(err));
          });
      });
})

const auth = createAsyncThunk('api/userauth', (thunkapi, {rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.get("http://localhost:5000/user/auth", {withCredentials:true})
        .then(response=> {
            resolve(response.data)
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})

const getAllUsers = createAsyncThunk('api/getalluser', (thunkapi, {rejectWithValue})=> {
    return new Promise((resolve,reject)=> {
        axios.get('http://localhost:5000/user/')
    .then(response=> {
        console.log("user response",response)
        resolve(response.data)
    })
    .catch(err=> reject(rejectWithValue(err.response))
    )})
})

const getUser = createAsyncThunk('api/getuser', (id,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.get(`http://localhost:5000/user/${id}`,{withCredentials:true})
    .then(response=> {
        resolve(response.data)
    })
    .catch(err=> reject(rejectWithValue(err.response)))})
})

const getTotalprice = createAsyncThunk('api/getTotalprice', (userid,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.get(`http://localhost:5000/user/carttotalprice/${userid}`,{withCredentials:true})
    .then(response=> {
        resolve(response.data)
    })
    .catch(err=> reject(rejectWithValue(err.response)))})
})

const editUser = createAsyncThunk('api/edituser', (userdata,{rejectWithValue})=> {
    const {userid,info} = userdata 
    return new Promise((resolve, reject)=> {
        axios.put(`http://localhost:5000/user/${userid}`, info,{
        headers: {"Content-Type": 'application/json'},withCredentials: true
    })
    .then(response=> {
        resolve(response.data)
    })
    .catch(err=> reject(rejectWithValue(err.response)))})
})
const userLogout = createAsyncThunk('api/logout', (thunkapi, {rejectWithValue})=>{
    return new Promise((resolve, reject)=> {
        axios.get('http://localhost:5000/user/logout', {
        withCredentials: true
    }).then(response=> {
        
        resolve(response.data)
    }).catch(err=> reject(rejectWithValue(err.response)))})
})

const userInfoSlice = createSlice({
    
    name: 'User',
    initialState: {
        loading: false,
        users: [],
        user: "",
        editresponse: null,
        auth: null,
        carttotalamount: null,
        error: null
    },
    reducers: {
        currentUser: (state, action)=> {
            state.user = JSON.parse(localStorage.getItem('user'))
        },
        clearUsererr: (state, action)=> {
            state.error = null
        }
    },
    extraReducers: (builder)=> {
        builder
            .addCase(registerUser.pending, (state)=> {
                state.loading = true
            })
            .addCase(registerUser.fulfilled, (state, action)=> {
                
                    state.loading = false;
                    state.error = null;
                    state.user = action.payload.user
                    Cookies.set('token', action.payload.token)
            })
            .addCase(registerUser.rejected, (state, action)=> {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(loginUser.pending, (state)=> {
                state.loading = true
            })
            .addCase(loginUser.fulfilled, (state, action)=> {
                    state.loading = false;
                    state.error = null
                    state.user = action.payload.user
                    Cookies.set('token', action.payload.token)
            })
            .addCase(loginUser.rejected, (state, action)=> {
                
                    state.loading = false;
                 state.error = action.payload
            })
            .addCase(getUser.pending, (state)=> {
                state.loading = true
            })
            .addCase(getUser.fulfilled, (state, action)=> {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(getUser.rejected, (state, action)=> {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(userLogout.pending, (state)=> {
                state.loading = true
            })
            .addCase(userLogout.fulfilled, (state, action)=> {
                state.loading = false;
                state.user = "";
                localStorage.removeItem('user');
            })
            .addCase(userLogout.rejected, (state, action)=> {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(auth.pending, (state)=> {
                state.loading = true
            })
            .addCase(auth.fulfilled, (state, action)=> {
                state.loading = false;
                state.auth = action.payload;
                
            })
            .addCase(auth.rejected, (state, action)=> {
                state.loading = false;
                state.error = action.payload
                localStorage.removeItem('user')
            })
            .addCase(getTotalprice.pending, (state)=> {
                state.loading = true
            })
            .addCase(getTotalprice.fulfilled, (state, action)=> {
                state.loading = false;
                state.carttotalamount = action.payload;
                
            })
            .addCase(getTotalprice.rejected, (state, action)=> {
                state.loading = false;
                state.error = action.payload
                
            })
            .addCase(getAllUsers.pending, (state)=> {
                state.loading = true
            })
            .addCase(getAllUsers.fulfilled, (state, action)=> {
                state.loading = false;
                state.users = action.payload;
                
            })
            .addCase(getAllUsers.rejected, (state, action)=> {
                state.loading = false;
                state.error = action.payload
                
            })
            .addCase(editUser.pending, (state)=> {
                state.loading = true
            })
            .addCase(editUser.fulfilled, (state, action)=> {
                state.loading = false;
                state.user = action.payload;
                
            })
            .addCase(editUser.rejected, (state, action)=> {
                state.loading = false;
                state.error = action.payload
                
            })
            
    }
})


export const {currentUser,clearUsererr} = userInfoSlice.actions
export {registerUser, loginUser,editUser, getUser,getAllUsers, userLogout,auth, getTotalprice}
export default userInfoSlice.reducer;