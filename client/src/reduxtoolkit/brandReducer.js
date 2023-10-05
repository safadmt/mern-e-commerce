import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const addNewBrand = createAsyncThunk('api/addnewbrand', (info,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.post(`http://localhost:5000/admin/add-brand`,info, {
            headers: {"Content-Type" : "application/json"},withCredentials:true
        })
        .then(response=> {
            
            resolve(response.data)
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})

const removebrand = createAsyncThunk('api/remove-brand', (brandId,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.delete(`http://localhost:5000/admin/brand/${brandId}`, {withCredentials:true})
        .then(response=> {
            resolve(response.data)
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})

const removebrandpermenant = createAsyncThunk('api/remove-brand-permenent', (brandId,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.delete(`http://localhost:5000/admin/brand/perment-delete/${brandId}`, {withCredentials:true})
        .then(response=> {
            resolve({data: response.data , status: response.status})
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})

const getOneBrand = createAsyncThunk('api/get-brand', (brandId,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.get(`http://localhost:5000/admin/brand/${brandId}`, {withCredentials:true})
        .then(response=> {
            resolve(response.data)
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})

const getAllBrand = createAsyncThunk('api/get-brands', (brandId,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.get(`http://localhost:5000/admin/get-brands`, {withCredentials:true})
        .then(response=> {
            resolve({data: response.data , status: response.status})
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})

const editBrand = createAsyncThunk('api/edit-brand', (info,{rejectWithValue})=> {
    const {brandId, body} = info
    return new Promise((resolve, reject)=> {
        axios.put(`http://localhost:5000/admin/brand/${brandId}`,body ,{
            headers: {"Content-Type": "application/json"}, withCredentials:true})
        .then(response=> {
            resolve({data: response.data , status: response.status})
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})

const brandInfoSlice = createSlice({
    name: "Brand",
    initialState : {
        loading: false,
        brands: {},
        createdbrand: null,
        deleted: null,
        updated: null,
        brand: null,
        error: null,
    },
    reducers: {
        clearBrands: (state,action)=> {
            state.brands = {}
        },
        clearBrandError: (state,action)=> {
            state.error = null
        }
    },
    extraReducers: (builder)=> {
        builder
            .addCase(addNewBrand.pending, (state,action)=> {
                state.loading = true
            })
            .addCase(addNewBrand.fulfilled, (state,action)=> {
                state.loading= false;
                state.createdbrand = action.payload
            })
            .addCase(addNewBrand.rejected, (state,action)=> {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(removebrand.pending, (state,action)=> {
                state.loading = true
            })
            .addCase(removebrand.fulfilled, (state,action)=> {
                state.loading = false
                state.deleted = action.payload
            })
            .addCase(removebrand.rejected, (state,action)=> {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(getOneBrand.pending, (state,action)=> {
                state.loading = true
            })
            .addCase(getOneBrand.fulfilled, (state,action)=> {
                state.loading = false
                state.brand = action.payload
            })
            .addCase(getOneBrand.rejected, (state,action)=> {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(getAllBrand.pending, (state,action)=> {
                
                state.loading = true
            })
            .addCase(getAllBrand.fulfilled, (state,action)=> {
                state.loading = false
                state.brands = action.payload
            })
            .addCase(getAllBrand.rejected, (state,action)=> {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(editBrand.pending, (state,action)=> {
                state.loading = true
            })
            .addCase(editBrand.fulfilled, (state,action)=> {
                state.loading = false
                state.updated = action.payload
            })
            .addCase(editBrand.rejected, (state,action)=> {
                state.loading = false;
                state.error = action.payload

            })
            .addCase(removebrandpermenant.pending, (state,action)=> {
                state.loading = true
            })
            .addCase(removebrandpermenant.fulfilled, (state,action)=> {
                state.loading = false
                state.deleted = action.payload
            })
            .addCase(removebrandpermenant.rejected, (state,action)=> {
                state.loading = false;
                state.error = action.payload
            })
    }

})
export const {clearBrands,clearBrandError} = brandInfoSlice.actions;
export {addNewBrand, removebrand, getOneBrand,getAllBrand,editBrand, removebrandpermenant};
export default brandInfoSlice.reducer;