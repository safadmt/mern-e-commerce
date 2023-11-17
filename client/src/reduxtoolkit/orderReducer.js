import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const verifyPayment = createAsyncThunk('api/verifypayment', (info,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.post(`http://localhost:5000/user/payment/verify-payment/`,info, {
            headers: {"Content-Type" : "application/json"},withCredentials:true
        })
        .then(response=> {
            console.log(response.data)
            resolve(response.data)
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})

const removeOrder = createAsyncThunk('api/remove-order', (orderid,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.delete(`http://localhost:5000/user/order/remove-order/${orderid}`, {withCredentials:true})
        .then(response=> {
            resolve(response.data)
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})

const getuserOrders = createAsyncThunk('api/orders', (orderid,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.get(`http://localhost:5000/user/orders/${orderid}`, {withCredentials:true})
        .then(response=> {
            console.log(response.data)
            resolve(response.data)
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})

const getOneOrder = createAsyncThunk('api/get-one-orders', (orderid,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.get(`http://localhost:5000/user/order/${orderid}`, {withCredentials:true})
        .then(response=> {
            resolve({data: response.data , status: response.status})
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})


const getOneOrderforadmin = createAsyncThunk('api/get-one-orders-admin', (orderid,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.get(`http://localhost:5000/admin/orders/${orderid}`, {withCredentials:true})
        .then(response=> {
            resolve({data: response.data , status: response.status})
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})

const getAllOrders = createAsyncThunk('api/get-all-orders', (info,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.post(`http://localhost:5000/admin/orders`,info,{
            headers: {"Content-Type": "application/json"},withCredentials:true})
        .then(response=> {

            resolve({data: response.data , status: response.status})
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})

const submitOrder = createAsyncThunk('api/submit-order', (orderinfo,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        const {userid, info} = orderinfo
        axios.post(`http://localhost:5000/user/orders/create/${userid}`,info,{
            headers: {"Content-Type": "application/json"},withCredentials:true})
        .then(response=> {
            resolve(response.data)
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})
const getFilteredOrders = createAsyncThunk('api/filtered-orders', (info,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.get(`http://localhost:5000/admin/filter-orders`,{withCredentials:true, params: info})
        .then(response=> {
            resolve(response.data)
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})

const searchOrders = createAsyncThunk('api/search-orders',(searchText,{rejectWithValue})=> {
    const params = new URLSearchParams(searchText)
    return new Promise((resolve, reject)=> {
        axios.get(`http://localhost:5000/admin/orders/search?${params}`)
    .then(response=> {
        console.log(response)
        resolve({data: response.data , status: response.status})
    })
    .catch(err=> {
        reject(rejectWithValue(err.response));
    })})
})

const OrderInfoSlice = createSlice({
    name: 'Orders',
    initialState: {
        loading: false,
        orders: {},
        payment_status : null,
        order: null,
        filteredOrders: [],
        error : null,

    },
    reducers: {
        clearError: (state, action) => {
            state.error = null
        },
        clearOrders: (state, action) => {
            state.orders = {}
        },
        clearOrder: (state, action) => {
            state.order = null
        },
        clearOrderError: (state, action) => {
            state.error = null
        },
        clearPaymentStatus: (state, action) => {
            state.payment_status = null
        },
        
    },
    extraReducers: (builder)=> {
        builder
            .addCase(verifyPayment.pending,(state)=> {
                state.loading = true
            })
            .addCase(verifyPayment.fulfilled, (state,action)=> {
                state.loading = false;
                state.payment_status = action.payload;
            })
            .addCase(verifyPayment.rejected, (state,action)=> {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(removeOrder.pending,(state)=> {
                state.loading = true
            })
            .addCase(removeOrder.fulfilled, (state,action)=> {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(removeOrder.rejected, (state,action)=> {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(getuserOrders.pending,(state)=> {
                state.loading = true
            })
            .addCase(getuserOrders.fulfilled, (state,action)=> {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(getuserOrders.rejected, (state,action)=> {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(getOneOrder.pending,(state)=> {
                state.loading = true
            })
            .addCase(getOneOrder.fulfilled, (state,action)=> {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(getOneOrder.rejected, (state,action)=> {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(getAllOrders.pending,(state)=> {
                state.loading = true
            })
            .addCase(getAllOrders.fulfilled, (state,action)=> {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(getAllOrders.rejected, (state,action)=> {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(getFilteredOrders.pending,(state)=> {
                state.loading = true
            })
            .addCase(getFilteredOrders.fulfilled, (state,action)=> {
                state.loading = false;
                state.filteredOrders = action.payload;
            })
            .addCase(getFilteredOrders.rejected, (state,action)=> {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(submitOrder.pending,(state)=> {
                state.loading = true
            })
            .addCase(submitOrder.fulfilled, (state,action)=> {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(submitOrder.rejected, (state,action)=> {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(searchOrders.pending,(state)=> {
                state.loading = true
            })
            .addCase(searchOrders.fulfilled, (state,action)=> {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(searchOrders.rejected, (state,action)=> {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(getOneOrderforadmin.pending,(state)=> {
                state.loading = true
            })
            .addCase(getOneOrderforadmin.fulfilled, (state,action)=> {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(getOneOrderforadmin.rejected, (state,action)=> {
                state.loading = false;
                state.error = action.payload
            })
    }
})

export const {clearError,clearOrders, clearOrderError,clearOrder,clearPaymentStatus} = OrderInfoSlice.actions
export {verifyPayment, removeOrder,getuserOrders, 
    getOneOrder ,getAllOrders, getFilteredOrders, submitOrder, searchOrders, getOneOrderforadmin}
export default OrderInfoSlice.reducer;