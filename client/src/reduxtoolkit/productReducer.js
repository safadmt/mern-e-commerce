import React from 'react'
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';

const createProduct = createAsyncThunk('api/postdata' , (datainfo,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.post("http://localhost:5000/admin/product", datainfo, {
        headers: {"Content-Type": "multipart/formdata"}
    }).then(response=> {
        resolve(response.data)
    }).catch(err=> {
        
        reject(rejectWithValue(err.response));
    })})
})

const editProduct = createAsyncThunk('api/editProduct' , (productInfo,{rejectWithValue})=> {
    const {formdata, id} = productInfo
    return new Promise((resolve, reject)=> {

        axios.put(`http://localhost:5000/admin/product/${id}`, formdata, {
        headers: {"Content-Type": "multipart/formdata"},withCredentials:true
    }).then(response=> {
        resolve({data: response.data , status: response.status})
    }).catch(err=> {
        
        reject(rejectWithValue(err.response));
    })})
})

const getProducts = createAsyncThunk('api/getProducts',(info,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        
        axios.post(`http://localhost:5000/admin/products`,info, {
            headers : {"Content-Type": "application/json"}
        })
    .then(response=> {
       
        resolve({data: response.data , status: response.status})
    })
    .catch(err=> {
        reject(rejectWithValue(err.response));
    })})
})

const getOneproduct = createAsyncThunk('api/getOneproduct',(id,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.get(`http://localhost:5000/admin/product/${id}`)
    .then(response=> {
        console.log(response.data)
        resolve(response.data)
    })
    .catch(err=> {
        reject(rejectWithValue(err.response));
    })})
})

const removeProduct = createAsyncThunk('api/remove-product',(id,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.delete(`http://localhost:5000/admin/product/${id}`)
    .then(response=> {
        console.log(response.data)
        resolve(response.data)
    })
    .catch(err=> {
        reject(rejectWithValue(err.response));
    })})
})

const searchProduct = createAsyncThunk('api/search-products',(searchText,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        
        axios.post("http://localhost:5000/admin/product/search",{searchText}, {
            headers : {"Content-Type": "application/json"}
        })
    .then(response=> {
        resolve({data: response.data , status: response.status})
    })
    .catch(err=> {
        reject(rejectWithValue(err.response));
    })})
})

const getProductsByPrice = createAsyncThunk('api/getProductsByPrice',(info,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        
        axios.post("http://localhost:5000/admin/sort-product",info, {
            headers : {"Content-Type": "application/json"}
        })
    .then(response=> {
        resolve({data: response.data , status: response.status})
    })
    .catch(err=> {
        reject(rejectWithValue(err.response));
    })})
})

const getFilteredProducts = createAsyncThunk('api/filtered-product', (info,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.get(`http://localhost:5000/admin/filter-products`,{withCredentials:true, params: info})
        .then(response=> {
            resolve({data: response.data , status: response.status})
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})
const dataInfoSlice = createSlice({
    name: 'product',
    initialState: {
        products: {},
        filteredproducts: {},
        sortedproducts : null,
        product: null,
        update : null,
        delete : null,
        error: null,
        loading: false
    },
    reducers: {
        clearProducts: (state,action)=> {
            state.products = {}
        },
        clearproduct : (state, action)=> {
            state.product = null
        },
        clearUpdate : (state, action)=> {
            state.update = null
        },

        clearDelete : (state, action)=> {
            state.delete = null
        },
        clearProductError : (state, action)=> {
            state.error = null
        },
        clearSortedproduct : (state, action) => {
            state.sortedproducts = null
        },
        clearFilteredProduct : (state, action) => {
            state.filteredproducts = {}
        }
       
    },
    extraReducers: (builder)=> {
        builder
            .addCase(createProduct.pending,(state)=> {
                state.loading = true
            })
            .addCase(createProduct.fulfilled, (state,action)=> {
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(createProduct.rejected, (state,action)=> {
                state.loading = false
                state.error = action.payload
            })
            .addCase(getProducts.pending,(state,action)=> {
                state.loading = true
            })
            .addCase(getProducts.fulfilled,(state,action)=> {
                state.loading = false
                state.products = action.payload
            })
            .addCase(getProducts.rejected, (state, action)=> {
                state.loading = false
                state.error = action.payload
            })
            .addCase(getOneproduct.pending,(state,action)=> {
                state.loading = true
            })
            .addCase(getOneproduct.fulfilled,(state,action)=> {
                state.loading = false
                state.product = action.payload
            })
            .addCase(getOneproduct.rejected, (state, action)=> {
                state.loading = false
                state.error = action.payload
            })
            .addCase(editProduct.pending,(state,action)=> {
                
                state.loading = true
            })
            .addCase(editProduct.fulfilled,(state,action)=> {
                state.loading = false
                state.update = action.payload
            })
            .addCase(editProduct.rejected, (state, action)=> {
                state.loading = false
                state.error = action.payload
            })
            .addCase(removeProduct.pending,(state,action)=> {
                state.loading = true
            })
            .addCase(removeProduct.fulfilled,(state,action)=> {
                state.loading = false
                state.delete = action.payload
            })
            .addCase(removeProduct.rejected, (state, action)=> {
                state.loading = false
                state.error = action.payload
            })
            .addCase(searchProduct.pending,(state,action)=> {
                state.loading = true
            })
            .addCase(searchProduct.fulfilled,(state,action)=> {
                state.loading = false
                state.products = action.payload
            })
            .addCase(searchProduct.rejected, (state, action)=> {
                state.loading = false
                state.error = action.payload
            })
            .addCase(getProductsByPrice.pending,(state,action)=> {
                state.loading = true
            })
            .addCase(getProductsByPrice.fulfilled,(state,action)=> {
                state.loading = false
                state.sortedproducts = action.payload
            })
            .addCase(getProductsByPrice.rejected, (state, action)=> {
                state.loading = false
                state.error = action.payload
            })
            .addCase(getFilteredProducts.pending,(state,action)=> {
                state.loading = true
            })
            .addCase(getFilteredProducts.fulfilled,(state,action)=> {
                state.loading = false
                state.filteredproducts = action.payload
            })
            .addCase(getFilteredProducts.rejected, (state, action)=> {
                state.loading = false
                state.error = action.payload
            })
    }
})
export const {clearProducts, clearproduct,clearUpdate, clearDelete, 
            clearProductError, clearSortedproduct,clearFilteredProduct} = dataInfoSlice.actions
            
export {createProduct , getProducts, getOneproduct ,editProduct,
     removeProduct, searchProduct, getProductsByPrice, getFilteredProducts}

export default dataInfoSlice.reducer;