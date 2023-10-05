import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {  clearSubcategories, clearSubcategoryError, clearSubcategorydeleted, clearcreatedSubcategory, createSubcategory, editsubcategory, getallsubcategory, getonesubcategory, removeSubcategory, removesubcategorypermenant } from '../../reduxtoolkit/subcategoryReducer';
import { Button, Col, Form } from 'react-bootstrap';
import { getAllCategory } from '../../reduxtoolkit/categoryReducer';
import { DisplayInfo, DisplayInput, DisplaySelectForm } from '../globalcomponent';
import EditSubCategories from './EditSubCategories';
import { useNavigate } from 'react-router-dom';

function ManageSubCategories() {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const subcategoriesInfo = useSelector(state => state.subcategoryInfo.subcategories);
  const categoriesInfo = useSelector(state => state.categoryInfo.categories);
  const is_Deleted = useSelector(state => state.subcategoryInfo.deleted);
  const createdsubcategory = useSelector(state => state.subcategoryInfo.createdsubcategory);
  const subcategoryError = useSelector(state => state.subcategoryInfo.error);
  const categoryError = useSelector(state=> state.categoryInfo.error);
  const [sub_category, setSub_category] = useState({subcategory_name: '', category: ''});
  const [selectedCategoryname, setSelectedCateogoryName] = useState('')
  const [successmsg, setSuccessMsg] = useState(null);
  const [error, setError] = useState(null)
  const [categoryerror, setCategoryError] = useState(null)
  const [subcategoryerror, setSubcategoryError] = useState(null)
  const [subcategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showPermenantDltebtn] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false);



  const displaySuccesmsg = (data) => {
    setSuccessMsg(data);
    setTimeout(() => {
      setSuccessMsg(null)
    }, 4000);
  }

  function displayErrormsg(data) {
    setError(data);
    setTimeout(() => {
      setError(null)
    }, 4000);
  }

  useEffect(() => {
    dispatch(getallsubcategory())
    dispatch(clearcreatedSubcategory())

    return ()=> {
      dispatch(clearSubcategoryError())
      setSubCategories([])
      dispatch(clearSubcategories())
      setShowAddForm(false);
      dispatch(clearSubcategorydeleted())
    }
  }, [createdsubcategory, is_Deleted])

  useEffect(()=> {
    if(subcategoriesInfo) {
      if(subcategoriesInfo?.status === 200) {
        setSubCategories(subcategoriesInfo.data?.subcategories)
      }else if(subcategoriesInfo?.status === 204) {
        setSubcategoryError({status : 204, error: "No subcategories were created"})
      }
      
    }
    if(categoriesInfo) {
      if(categoriesInfo?.status === 200) {
        setCategories(categoriesInfo.data?.categories)
      }else if(categoriesInfo?.status === 204) {
        setCategoryError({status : 204, error: "No categories were created"})
      }
      
    }
  },[subcategoriesInfo,categoriesInfo])


  useEffect(() => {
    if (createdsubcategory) {
      displaySuccesmsg("SubCategory added")
    }
   
  }, [createdsubcategory])

  useEffect(() => {
    if (subcategoryError) {
      console.log(subcategoryError)
      if (subcategoryError.response?.status === 500) {
        setSubcategoryError({status: 500, error:subcategoryError.response.data ||
           "Oops!, Something went wrong. Please try again later"})
      }else if (subcategoryError.response?.status === 404) {
        setSubcategoryError({status: 404 , error: subcategoryError.response.data ||
           "Sorry, The requested subcategory not found"})
      }else if (subcategoryError.response?.status === 422) {
        setSubcategoryError({status: 422,error: subcategoryError.response.data ||
           "Cannot delete. First remove or modify products associated with this subcategory"})
           setTimeout(() => {
            setSubcategoryError(null)
           }, 5000);
      }
    }
  }, [subcategoryError])

  useEffect(() => {
    if (categoryError) {
      console.log(categoryError)
      if (categoryError.response?.status === 500) {
        setCategoryError({status: 500, error: categoryError.response.data ||
           "Oops!, Something went wrong. Please try again later"})
      }
    }
  }, [categoryError])

  
  const handleDelete = (e, subcategoryId, subcategoryname) => {
    if (window.confirm("do you want to delate " + subcategoryname + " subcategory ? " +
      "if you are deleting this category , you have to delele or change proudcts and subcategories " +
      "associated with this category !")) {
        
      dispatch(removeSubcategory(subcategoryId))
      const newsubcategories = subcategories.filter(item=> item._id !== subcategoryId)
      setSubCategories(newsubcategories)
    }

  }

  const handlePermenantDelete = (e,subcategoryId,subcategoryname)=> {
    e.preventDefault();
    if (window.confirm("do you want to delate " + subcategoryname + " brand ? " +
      "if you are deleting this brand , you have to delele or change proudcts and categories " +
      "associated with this brand !")) {
      dispatch(removesubcategorypermenant(subcategoryId))
     
    }
  }

  const handleSelectCategory = (e)=> {
    const selectedValue = e.target.value
    setSub_category({...sub_category, category : e.target.value})
    const selectedcategory = categories.find(item=> item._id === selectedValue);
    setSelectedCateogoryName(selectedcategory.category_name)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
   
    const { subcategory_name,category } = sub_category
    if (!subcategory_name || !category) return displayErrormsg({status : 'auth',error: "Require all field"})
    dispatch(createSubcategory(sub_category))
    setSub_category({subcategory_name: '', category:''})
  }
  


  return (
    <div className='ms-4 mt-2'>
      <Col>
        <Button variant='outline-secondary' className='mb-2' 
        onClick={() => {setShowAddForm(true)
        dispatch(getAllCategory())}}>Create New SubCategory</Button>
        {showAddForm && categories?.length > 0 && <Col md={4} sm={12}>
          <Form onSubmit={handleSubmit}>
            {successmsg && <p className='text-success'>{successmsg}</p>}
            {error === 'Subcategories not created' ? null : <p className='text-warning'>{error}</p>}


            <DisplayInput value={sub_category.subcategory_name} 
            classname={"mb-2"} type={"text"} 
            onchange={(e)=> setSub_category({...sub_category, subcategory_name : e.target.value})}
            label={"Category Name"} name={"subcategory_name"}/>
            
            <DisplaySelectForm optlabel={selectedCategoryname} mapobjvalue={"category_name"} formlabel={"Category associated with"} 
            loopitem={categories} name={"category"}
            formselectonchange={handleSelectCategory}/>
            
            <Button variant='outline-primary' className='mt-2 inline' type='submit'>Submit</Button>
            <Button variant='outline-primary' className='mt-2 ms-2 inline' type='submit'
              onClick={() => setShowAddForm(false)}>Cancel</Button>
          </Form>
        </Col>}
        {error === 'Subcategories not created'&&  <p className='text-warning'>{error}</p>}
      </Col>
      
      {subcategories?.length > 0 && <Col md={8} className='mt-4'>
          
        <h5 className='mb-4'>Subcategory List</h5>
        
        
        {(subcategoryerror?.status === 500 || subcategoryerror?.status === 204) && 
        <div>{subcategoryerror.error}</div>}
        {subcategories?.length > 0 && subcategories.map((subcategory, index) => {
          return <DisplayInfo isTrue={showPermenantDltebtn} keyindex={index} label={"Subcategory"} value={subcategory?.subcategory_name}
            onEdit={(e) =>  Navigate(`/admin/sub-category/edit/${subcategory._id}`)} 
            value2={{label:"Category associated",category: subcategory?.category?.category_name}}
            onDelete={(e) => handleDelete(e, subcategory?._id, subcategory?.category?.category_name)}
            onPermanantDelete={(e)=> handlePermenantDelete(e,subcategory._id,subcategory.brand_name)} />

        })}
      </Col>}
    </div>
  )
}


export default ManageSubCategories