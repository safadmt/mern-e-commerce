import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const createSubcategory = createAsyncThunk('api/create-subcategory', (info,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.post(`http://localhost:5000/admin/add-sub-category/`,info, {
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

const removeSubcategory = createAsyncThunk('api/remove-subcategory', (subcategoryId,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.delete(`http://localhost:5000/admin/sub-category/${subcategoryId}`, {withCredentials:true})
        .then(response=> {
            
            resolve({data: response.data , status: response.status})
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})

const getonesubcategory = createAsyncThunk('api/get-subcategory', (subcategoryId,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.get(`http://localhost:5000/admin/sub-category/${subcategoryId}`, {withCredentials:true})
        .then(response=> {
            
            resolve({data: response.data , status: response.status})
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})

const getallsubcategory = createAsyncThunk('api/get-subcategories', (subcategoryId,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.get(`http://localhost:5000/admin/sub-categories`, {withCredentials:true})
        .then(response=> {
           
            resolve({data: response.data , status: response.status})
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})

const editsubcategory = createAsyncThunk('api/edit-brand', (info,{rejectWithValue})=> {
    const {subcategoryId, subcategoryInfo} = info;
    return new Promise((resolve, reject)=> {
        axios.put(`http://localhost:5000/admin/subcategory/${subcategoryId}`,subcategoryInfo, {
            headers: {"Content-Type":"application/json"},withCredentials:true})
        .then(response=> {
            
            resolve({data: response.data , status: response.status})
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})

const removesubcategorypermenant = createAsyncThunk('api/remove-subcategory-permenent', (subcategoryId,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.delete(`http://localhost:5000/admin/subcategory/permenant-delete/${subcategoryId}`, {withCredentials:true})
        .then(response=> {
            resolve({data: response.data , status: response.status})
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})

const subCategoryInfoSlice = createSlice({
    name: 'Brand',
    initialState: {
        loading: false,
        subcategories: {},
        subcategory: null,
        createdsubcategory: null,
        deleted: null,
        updated: null,
        error: null
    },
    reducers: {
        clearcreatedSubcategory: (state, action)=> {
            state.createdsubcategory = null;
        },
        clearSubcategories: (state,action)=> {
            state.subcategories = {}
        },
        clearSubcategoryError: (state,action)=> {
            state.error = null
        },
        clearSubcategoryupdated: (state,action)=> {
            state.updated = null
        },
        clearSubcategorydeleted: (state,action)=> {
            state.deleted = null
        }
    },
    extraReducers: (builder)=> {
        builder
            .addCase(createSubcategory.pending,(state)=> {
                state.loading = true
            })
            .addCase(createSubcategory.fulfilled, (state,action)=> {
                state.loading = false;
                state.createdsubcategory = action.payload;
            })
            .addCase(createSubcategory.rejected, (state,action)=> {
                state.loading = false;
                state.error = action.payload
            }) 
            .addCase(removeSubcategory.pending,(state)=> {
                state.loading = true
            })
            .addCase(removeSubcategory.fulfilled, (state,action)=> {
                state.loading = false;
                state.deleted = action.payload;
            })
            .addCase(removeSubcategory.rejected, (state,action)=> {
                state.loading = false;
                state.error = action.payload
            }) 
            .addCase(getonesubcategory.pending,(state)=> {
                state.loading = true
            })
            .addCase(getonesubcategory.fulfilled, (state,action)=> {
                state.loading = false;
                state.subcategory = action.payload;
            })
            .addCase(getonesubcategory.rejected, (state,action)=> {
                state.loading = false;
                state.error = action.payload
            }) 
            .addCase(getallsubcategory.pending,(state)=> {
                state.loading = true
            })
            .addCase(getallsubcategory.fulfilled, (state,action)=> {
                state.loading = false;
                state.subcategories = action.payload;
            })
            .addCase(getallsubcategory.rejected, (state,action)=> {
                state.loading = false;
                state.error = action.payload
            }) 
            .addCase(editsubcategory.pending,(state)=> {
                state.loading = true
            })
            .addCase(editsubcategory.fulfilled, (state,action)=> {
                state.loading = false;
                state.updated = action.payload;
            })
            .addCase(editsubcategory.rejected, (state,action)=> {
                state.loading = false;
                state.error = action.payload
            }) 
            .addCase(removesubcategorypermenant.pending,(state)=> {
                state.loading = true
            })
            .addCase(removesubcategorypermenant.fulfilled, (state,action)=> {
                state.loading = false;
                state.deleted = action.payload;
            })
            .addCase(removesubcategorypermenant.rejected, (state,action)=> {
                state.loading = false;
                state.error = action.payload
            }) 
    }

})
export const {clearcreatedSubcategory,clearSubcategories,
    clearSubcategorydeleted,clearSubcategoryupdated,clearSubcategoryError} = subCategoryInfoSlice.actions;
export {createSubcategory,removesubcategorypermenant, removeSubcategory, getonesubcategory, getallsubcategory, editsubcategory}
export default subCategoryInfoSlice.reducer

