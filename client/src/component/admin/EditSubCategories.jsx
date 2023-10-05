import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { DisplayInput, DisplaySelectForm } from '../globalcomponent';
import { Button, Col, Form } from 'react-bootstrap';
import { clearSubcategoryError, clearSubcategoryupdated, editsubcategory, getonesubcategory } from '../../reduxtoolkit/subcategoryReducer';
import { useNavigate, useParams } from 'react-router-dom';
import { clearCategories, clearCategoryError, getAllCategory } from '../../reduxtoolkit/categoryReducer';

function EditSubCategories() {

    const dispatch = useDispatch();
    const Navigate = useNavigate();
    const {subcategoryId} = useParams();
    const categoriesInfo = useSelector(state => state.categoryInfo.categories);
    const subcategoryInfo = useSelector(state => state.subcategoryInfo.subcategory);
    const updated = useSelector(state => state.subcategoryInfo.updated);
    const subcategoryError = useSelector(state => state.subcategoryInfo.error);

    const [categoryerror, setCategoryError] = useState(null)
    const [subcategoryerror, setSubcategoryError] = useState(null)
    const [subcategory, setSubCategory] = useState(null);
    const [selectcategory, setSelectCategory] = useState("")
    const [categories, setCategories] = useState([]);
    
    const [successmsg, setSuccessMsg] = useState(null)
    const [error, setError] = useState(null)
    const [showForm, setShowForm] = useState(true);

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

    useEffect(()=> {
        dispatch(getonesubcategory(subcategoryId))
        dispatch(getAllCategory());
        return ()=> {
            dispatch(clearCategories());
            dispatch(clearSubcategoryError);
            dispatch(clearCategoryError);
            setSubcategoryError(null);
            setCategoryError(null);
            dispatch(clearSubcategoryupdated())
            setError(null);
            setCategoryError(null);
            setSubcategoryError(null);
        }
    }, [])

    useEffect(()=> {}, [

    ])


    useEffect(()=> {
        if(categoriesInfo) {
            if(categoriesInfo?.status === 200) {
              setCategories(categoriesInfo.data?.categories)
            }else if(categoriesInfo?.status === 204) {
              setCategoryError({status : 204, error: "No categories were created"})
            }
            
          }
    },[categoriesInfo])

    useMemo(() => {
        if (subcategoryInfo) {
          
          setSubCategory({subcategory_name:subcategoryInfo.data?.subcategory_name, _id: subcategoryInfo.data?._id})
          setSelectCategory(subcategoryInfo.data?.newcategory)
          setShowForm(true)
        }
      }, [subcategoryInfo])

    useEffect(()=> {
      if(updated) {
        displaySuccesmsg("Updated successfully")
      }
        
    },[updated])
    
    useEffect(() => {
        if (subcategoryError) {
          console.log(subcategoryError)
          if (subcategoryError.response?.status === 500) {
            setSubcategoryError({status: 500, error:subcategoryError.response.data ||
               "Oops!, Something went wrong. Please try again later"})
          }else if (subcategoryError.response?.status === 404) {
            setSubcategoryError({status: 404 , error: subcategoryError.response.data ||
               "Sorry, The requested subcategory not found"})
          }
        }
      }, [subcategoryError])


      function submitChanges(e, subcategoryId) {
        e.preventDefault()
        
        if (!subcategory.subcategory_name || !selectcategory._id) 
        return displayErrormsg({status: 'auth',error:"Please fill the field"})
        const info = {
          subcategoryId: subcategoryId,
          subcategoryInfo: {
            subcategory_name: subcategory.subcategory_name,
            category: selectcategory._id
          }
        }
        dispatch(editsubcategory(info))
      }
      const handleChange = (e)=> {
        const { value} = e.target;
        setSelectCategory(prevState=> ({
          ...prevState,
          _id: value 
        }))       
      }
      
    if(showForm && subcategory && selectcategory &&  categories.length > 0 ) {
return (

    <div className='md:w-6/12 sm:w-12'>
        <div><Button className='ms-4 mt-4 mb-4' variant='primary' onClick={()=> Navigate(`/admin/sub-category`)}>Back to</Button></div>
        <Col className='editFormcategory mb-4' md={12} sm={12}>
          
          <Form onSubmit={(e) => submitChanges(e, subcategory?._id)}>
            {successmsg && <p className='text-success'>{successmsg}</p>}
            {error && <p className='text-warning'>{error}</p>}
            
            <DisplayInput type={"text"} classname={"mb-2"} 
            value={subcategory?.subcategory_name} 
            onchange={(e) => setSubCategory({ ...subcategory, subcategory_name: e.target.value })}
              label={"Subcategory Name"} />
            
            <DisplaySelectForm 
            error={categoryerror?.status === 500 || categoryerror?.status === 204 ? categoryerror?.error : null} 
            mapobjvalue={"category_name"} formlabel={"Category associated with"} optlabel={selectcategory?.category_name} selectedvalue={selectcategory?._id}
             name="_id" loopitem={categories} formselectonchange={handleChange}/>

            <Button variant='outline-primary' className='mt-2 inline' type='submit'>Submit Changes</Button>
            <Button variant='outline-primary' className='mt-2 ms-2 inline' type='button'
              onClick={()=> Navigate(`/admin/sub-category`)}>Cancel</Button>
          </Form>
        </Col>
    </div>
  )
    }else if(subcategoryerror?.status === 500 || subcategoryerror?.status === 404) {
        return (
            <div className='mt-10 text-center font-medium'>
                <div>{subcategoryerror?.error}</div>
            </div>
        )
    }
    
}

export default EditSubCategories