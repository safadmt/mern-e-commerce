import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const addNewCategory = createAsyncThunk('api/add-new-category', (info,{rejectWithValue})=> {
    console.log("info", info)
    return new Promise((resolve, reject)=> {
        axios.post(`http://localhost:5000/admin/add-category`,info, {
            headers: {"Content-Type" : "application/json"},withCredentials: true
        })
        .then(response=> {
           
            resolve({data: response.data , status: response.status})
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})

const removecateogry = createAsyncThunk('api/remove-category', (categoryId,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.delete(`http://localhost:5000/admin/category/${categoryId}` ,{withCredentials:true})
        .then(response=> {
            
            resolve({data: response.data , status: response.status})
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})

const getOneCategory = createAsyncThunk('api/getonecategory', (categoryId,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.get(`http://localhost:5000/admin/category/${categoryId}` ,{withCredentials:true})
        .then(response=> {
            resolve(response.data)
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})

const editcategory = createAsyncThunk('api/editcategory', (info,{rejectWithValue})=> {
    const {categoryId, categoryInfo} = info
    return new Promise((resolve, reject)=> {
        axios.put(`http://localhost:5000/admin/category/${categoryId}`,categoryInfo,{
            headers: {"Content-Type": "application/json"}, withCredentials:true})
        .then(response=> {
            resolve({data: response.data , status: response.status})
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})

const getAllCategory = createAsyncThunk('api/get-all-category', (categoryId,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.get(`http://localhost:5000/admin/categories` ,{withCredentials:true})
        .then(response=> {
            
            resolve({data: response.data , status: response.status})
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})


const removecategorypermenant = createAsyncThunk('api/remove-category-permenent', (categoryId,{rejectWithValue})=> {
    return new Promise((resolve, reject)=> {
        axios.delete(`http://localhost:5000/admin/category/permenant-delete/${categoryId}`, {withCredentials:true})
        .then(response=> {
            resolve({data: response.data , status: response.status})
        })
        .catch(err=> {
            reject(rejectWithValue(err))
        })
    })
})


const categoryInfoSlice = createSlice({
    name: 'Category',
    initialState: {
        loading: false,
        categories: {},
        category: null,
        createdcategory: null,
        deleted: null,
        updated: null,
        error: null
    },
    reducers: {
        clearCreatedCategory: (state, action) => {
            state.createdcategory = null
        },
        clearCategories: (state, action) => {
            state.categories = {}
        },
        clearCategoryError: (state, action) => {
            state.error = null
        },
        clearCategorydeletd: (state, action) => {
            state.deleted = null
        }
    },
    extraReducers: (builder)=> {
        builder
        .addCase(addNewCategory.pending, (state, action)=> {
            state.loading = true;
        })
        .addCase(addNewCategory.fulfilled, (state, action)=> {
            state.loading = false;
            state.createdcategory = action.payload;
            
        })
        .addCase(addNewCategory.rejected, (state, action)=> {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(removecateogry.pending, (state, action)=> {
            state.loading = true;
        })
        .addCase(removecateogry.fulfilled, (state, action)=> {
            state.loading = false;
            state.deleted = action.payload;
            
        })
        .addCase(removecateogry.rejected, (state, action)=> {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(getOneCategory.pending, (state, action)=> {
            state.loading = true;
        })
        .addCase(getOneCategory.fulfilled, (state, action)=> {
            state.loading = false;
            state.category = action.payload;
            
        })
        .addCase(getOneCategory.rejected, (state, action)=> {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(getAllCategory.pending, (state, action)=> {
            state.loading = true;
        })
        .addCase(getAllCategory.fulfilled, (state, action)=> {
            state.loading = false;
            state.categories = action.payload;
            
        })
        .addCase(getAllCategory.rejected, (state, action)=> {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(editcategory.pending, (state, action)=> {
            state.loading = true;
        })
        .addCase(editcategory.fulfilled, (state, action)=> {
            state.loading = false;
            state.updated = action.payload;
            
        })
        .addCase(editcategory.rejected, (state, action)=> {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(removecategorypermenant.pending, (state, action)=> {
            state.loading = true;
        })
        .addCase(removecategorypermenant.fulfilled, (state, action)=> {
            state.loading = false;
            state.deleted = action.payload;
            
        })
        .addCase(removecategorypermenant.rejected, (state, action)=> {
            state.loading = false;
            state.error = action.payload;
        })
        
    }
})
export const {clearCreatedCategory,clearCategorydeletd, clearCategories,clearCategoryError} = categoryInfoSlice.actions
export {addNewCategory,removecateogry,getOneCategory,getAllCategory,editcategory, removecategorypermenant};
export default categoryInfoSlice.reducer;