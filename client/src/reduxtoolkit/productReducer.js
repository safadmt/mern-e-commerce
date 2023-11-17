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

const addReview = createAsyncThunk('api/review',(details,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        const {userid, productId, review} = details
        axios.post(`http://localhost:5000/user/product-review/${productId}`,{userid,review}, {
            headers : {"Content-Type": "application/json"},withCredentials: true
        })
    .then(response=> {
       
        resolve({data: response.data , status: response.status})
    })
    .catch(err=> {
        reject(rejectWithValue(err.response));
    })})
})

const addRating = createAsyncThunk('api/add-rating',(details,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        const {userid, productId, rating} = details
        axios.post(`http://localhost:5000/user/product-rating/${productId}`,{userid,rating}, {
            headers : {"Content-Type": "application/json"},withCredentials: true
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

const getProductReviews = createAsyncThunk('api/product-reviews', (productId,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.get(`http://localhost:5000/user/product-reviews/${productId}`,{withCredentials:true})
        .then(response=> {
            resolve(response.data)
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})

const getProductAverageRating = createAsyncThunk('api/product/average-rating',(id,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.get(`http://localhost:5000/user/product/average-rating/${id}`)
    .then(response=> {
       
        resolve(response.data)
    })
    .catch(err=> {
        reject(rejectWithValue(err.response));
    })})
})

const dataInfoSlice = createSlice({
    name: 'product',
    initialState: {
        products: {},
        filteredproducts: {},
        sortedproducts : null,
        product: null,
        update : null,
        reviews : null,
        review: null,
        successrating: null,
        rating: null,
        delete : null,
        error: null,
        averagerating: null,
        loadingreview: false,
        loadingrating: false,
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
        },
        clearReview : (state, action) => {
            state.review = null
        },
        clearRating : (state, action) => {
            state.rating = null
        },
        clearSuccessRating : (state, action) => {
            state.successrating = null
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
            .addCase(addReview.pending,(state,action)=> {
                state.loadingreview = true
            })
            .addCase(addReview.fulfilled,(state,action)=> {
                state.loadingreview = false
                state.review = action.payload
            })
            .addCase(addReview.rejected, (state, action)=> {
                state.loadingreview = false
                state.error = action.payload
            })
            .addCase(addRating.pending,(state,action)=> {
                state.loadingrating = true
            })
            .addCase(addRating.fulfilled,(state,action)=> {
                state.loadingrating = false
                state.rating = action.payload
            })
            .addCase(addRating.rejected, (state, action)=> {
                state.loadingrating = false
                state.error = action.payload
            })
            .addCase(getProductReviews.pending,(state,action)=> {
                state.loadingreview = true
            })
            .addCase(getProductReviews.fulfilled,(state,action)=> {
                state.loadingreview = false
                state.reviews = action.payload
            })
            .addCase(getProductReviews.rejected, (state, action)=> {
                state.loadingreview = false
                state.error = action.payload
            })
            .addCase(getProductAverageRating.pending,(state,action)=> {
                state.loadingrating = true
            })
            .addCase(getProductAverageRating.fulfilled,(state,action)=> {
                state.loadingrating = false
                state.averagerating = action.payload
            })
            .addCase(getProductAverageRating.rejected, (state, action)=> {
                state.loadingrating = false
                state.error = action.payload
            })
    }
})
export const {clearProducts, clearproduct,clearUpdate, clearDelete, 
            clearProductError, clearSortedproduct,clearFilteredProduct,
        clearRating, clearReview, clearSuccessRating} = dataInfoSlice.actions
            
export {createProduct , getProducts, getOneproduct ,editProduct,
     removeProduct, searchProduct, getProductsByPrice, getFilteredProducts,addRating, addReview,
    getProductReviews,getProductAverageRating}

export default dataInfoSlice.reducer;