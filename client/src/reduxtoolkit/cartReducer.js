import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const addToCart = createAsyncThunk('api/addtocart',(info,{rejectWithValue})=> {
    const {userid, proid, price} = info;
    return new Promise((resolve, reject)=> {
        axios.post(`http://localhost:5000/user/addtocart/${userid}` ,{proid:proid,price:price},{withCredentials:true
    }).then(response=> {
        resolve(response.data)
    })
    .catch(err=> {
            reject(rejectWithValue(err));
    })})
})

const getUserCart = createAsyncThunk('api/getusercart ', (userid,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.get(`http://localhost:5000/user/cartproduct/${userid}`,{withCredentials:true})
    .then(response=> {
        resolve({data: response.data, status: response.status})
    })
    .catch(err=> {
        console.log(err)
        reject(rejectWithValue(err));})})
});
const changeProductqty = createAsyncThunk('api/changeProductqty', (details,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        const {userid, price, productid, productqty,value} = details
        const proinfo = {proid:productid, price:price,productqty:productqty, value:value}
        axios.put(`http://localhost:5000/user/incordecproductqty/${userid}`,proinfo,{withCredentials:true})
    .then(response=> {
        resolve(response.data)
    })
    .catch(err=> {
        reject(rejectWithValue(err));})})
})
const getCartCount = createAsyncThunk('api/cartcount', (userid,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.get(`http://localhost:5000/user/cartcount/${userid}`, {withCredentials:true})
    .then(response=> {
        resolve(response.data)
    })
    .catch(err=> {
        reject(rejectWithValue(err));})})
})

const removeProductfromCart = createAsyncThunk('api/removeProductfromCart', (details,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        const {userid, productid, price, quantity} = details;
        const productinfo = {productid: productid, price:price, quantity: quantity}
        axios.put(`http://localhost:5000/user/removecartproduct/${userid}`,{productinfo}, {withCredentials:true})
    .then(response=> {
        resolve(response.data)
    })
    .catch(err=> {
        reject(rejectWithValue(err));})})
})

const cartInfoReducer = createSlice({
    name: 'cart',
    initialState: {
        loading: false,
        cartInfo: {},
        productqty : null,
        deleted: null,
        cartCount: 0,
        error: null
    },
    reducers: {
        clearCartcount: (state, action)=> {
            state.cartCount = null
        },
        clearCarterr: (state, action)=> {
            state.error = null
        },
        clearCartInfo: (state, action)=> {
            state.cartInfo = {}
        }
    },
    extraReducers: (builder)=> {
        builder
            .addCase(addToCart.pending, (state, action)=> {
                state.loading = true;
            })
            .addCase(addToCart.fulfilled, (state, action)=> {
                state.loading = false;
                state.cartInfo = action.payload;
                
            })
            .addCase(addToCart.rejected, (state, action)=> {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getUserCart.pending, (state, action)=> {
                state.loading = true;
            })
            .addCase(getUserCart.fulfilled, (state, action)=> {
                state.loading = false;
                state.cartInfo = action.payload;
                
            })
            .addCase(getUserCart.rejected, (state, action)=> {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getCartCount.pending, (state, action)=> {
                state.loading = true;
            })
            .addCase(getCartCount.fulfilled, (state, action)=> {
                state.loading = false;
                state.cartCount = action.payload;
                
            })
            .addCase(getCartCount.rejected, (state, action)=> {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(changeProductqty.pending, (state, action)=> {
                state.loading = true;
            })
            .addCase(changeProductqty.fulfilled, (state, action)=> {
                state.loading = false;
                state.productqty = action.payload;
                
            })
            .addCase(changeProductqty.rejected, (state, action)=> {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(removeProductfromCart.pending, (state, action)=> {
                state.loading = true;
            })
            .addCase(removeProductfromCart.fulfilled, (state, action)=> {
                state.loading = false;
                state.deleted = action.payload;
                
            })
            .addCase(removeProductfromCart.rejected, (state, action)=> {
                state.loading = false;
                state.error = action.payload;
            })

    }
})
export const {clearCartcount,clearCarterr} = cartInfoReducer.actions;
export {addToCart, getUserCart,getCartCount,changeProductqty,removeProductfromCart}
export default cartInfoReducer.reducer;