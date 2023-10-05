import React, { useEffect, useMemo, useRef , useState} from 'react'
import { Col, Form,Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addNewCategory, clearCategories,
   clearCreatedCategory, clearCategoryError, 
   editcategory, getAllCategory, getOneCategory,
    removecateogry, 
    removecategorypermenant} from '../../reduxtoolkit/categoryReducer';
import '../../App.css'
import { DisplayInfo, DisplayInput } from '../globalcomponent';

function ManageCategories() {
  const dispatch = useDispatch()
  const categoriesInfo = useSelector(state=> state.categoryInfo.categories);
  const categoryInfo = useSelector(state=> state.categoryInfo.category);
  const is_Deleted = useSelector(state=> state.categoryInfo.deleted);
  const updated = useSelector(state=> state.categoryInfo.updated);
  const createdCategory = useSelector(state=> state.categoryInfo.createdcategory);
  const categoryError = useSelector(state=> state.categoryInfo.error);
  const [newCategory, setNewCategory]= useState({category_name:''});
  const [successmsg, setSuccessMsg] = useState(null);
  const [error, setError] = useState(null)
  const [category, setCategory] = useState(null);
  const [categoryId, setcategoryId] = useState(null);
  const [categories, setCategories] = useState(null)
  const [showForm, setShowForm] =  useState(null)
  const [showAddForm, setShowAddForm] = useState(false);
  const [showpermentdeletebutton] = useState(true)

  const displaySuccesmsg = (data) => {
    setSuccessMsg(data);
    setTimeout(() => {
      setSuccessMsg(null)
    }, 4000);
  }

  function displayErrormsg (data) {
    setError(data);
    setTimeout(() => {
      setError(null)
    }, 4000);
  }
  useEffect(()=> {
    dispatch(getAllCategory())

    return ()=> {
      dispatch(clearCategoryError());
      dispatch(clearCategories())
      dispatch(clearCreatedCategory())
      setShowAddForm(false)
      setShowForm(false)
    }
  }, [createdCategory,is_Deleted,updated, categoryId])


  useEffect(()=> {
    if(createdCategory){
      dispatch(clearCreatedCategory())
      displaySuccesmsg("Category added")
    }
    if(updated) {
      displaySuccesmsg("Category Updated")
    }
  },[createdCategory,updated])

  useMemo(()=> {
    if(categoriesInfo?.status === 200) {
      setCategories(categoriesInfo.data?.categories)
    }else if(categoriesInfo?.status === 204) {
      // if no categories in the database
      setError({status: 204, error: "No categories were created."})
    }
  },[categoriesInfo])

  useEffect(()=> {
    if(categoryError) {
      if(categoryError.response?.status === 404){
        displayErrormsg({status: 404, error: categoryError.response.data || "Sorry , The requested Category not found"})
      }else if(categoryError.response?.status === 500) {
        displayErrormsg({status: 500, error: categoryError.response?.data || 'Oops!, Something went wrong. Please try again later'})
      }else if(categoryError.response?.status === 422) {
        displayErrormsg({status: 422,error:categoryError.response.data || 'Cannot delete this category , because its associated with products'})
      }
    }
  }, [categoryError])


  useMemo(()=> {
    // getting one category for edit
   
    if(categoryInfo){

      setCategory(categoryInfo)
      
    }
  },[categoryInfo])


  const handleEdit = (e,categoryId) => {
    e.preventDefault();
    dispatch(getOneCategory(categoryId))
    setShowForm(true)
  }
  const handleDelete = (e,categoryId,categoryname) => {
    if(window.confirm("do you want to delate " +categoryname+" category ? " +
    "if you are deleting this category , you have to delele or change proudcts and subcategories " +
    "associated with this category !")) {
      const newcategories = categories.filter(item=> item._id !== categoryId)
      setCategories(newcategories)
      dispatch(removecateogry(categoryId))
    } 
    
  }
  function submitChanges (e,categoryId) {
    e.preventDefault()
   
    if(!category.category_name) return displayErrormsg({status: 'auth', error:"Please fill the field"})
    const info = {
      categoryId: categoryId,
      categoryInfo: {
        category_name : category.category_name
      }
  }
    dispatch(editcategory(info))
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    
    const {category_name} = newCategory
    if(!category_name) return displayErrormsg({status:'auth', error: "Required field"})
    dispatch(addNewCategory({category_name: category_name}))
  }

  const handlePermenantDelete = (e,categoryId, categoryname)=> {
    e.preventDefault();
    if(window.confirm(`do you want delete this ${categoryname} category permenantly`)) {
      dispatch(removecategorypermenant(categoryId))
      setcategoryId(categoryId)
    }
  }

  return (
    <div className='ms-4 mt-2'>
        <Col>
        <Button variant='outline-secondary' onClick={()=> setShowAddForm(true)}>Create New Category</Button>
       { showAddForm && <Col md={4} sm={12}>
          <Form onSubmit={handleSubmit}>
            {successmsg && <p className='text-success'>{successmsg}</p>}
            {error?.status === 'auth' && <p className='text-warning'>{error.error}</p>}
            <DisplayInput value={newCategory.category_name} onchange={(e) => setNewCategory({...newCategory, category_name: e.target.value})}
         label={"Category Name"}/>
       
            <Button variant='outline-primary' className='mt-2 inline' type='submit'>Submit</Button>
            <Button variant='outline-primary' className='mt-2 ms-2 inline' type='submit'
            onClick={()=> setShowAddForm(false)}>Cancel</Button>
          </Form>
        </Col>}
      </Col>
<Col md={6} className='mt-4'>
    <h5 className='mb-4'>Category List</h5>
      {showForm && category && <Col className='editFormcategory mb-4' md={12} sm={12}>
        
          <Form onSubmit={(e)=> submitChanges(e,category._id)}>
            {successmsg && <p className='text-success'>{successmsg}</p>}
            {error?.status === 'auth' && <p className='text-warning'>{error.error}</p>}
            <DisplayInput value={category.category_name} onchange={(e) => setCategory({...category, category_name:e.target.value}) }
         label={"Category Name"}/>
            
            <Button variant='outline-primary' className='mt-2 inline' type='submit'>Submit Changes</Button>
            <Button variant='outline-primary' className='mt-2 ms-2 inline' type='submit' 
            onClick={()=> setShowForm(false)}>Cancel</Button>
          </Form>
        </Col>}
       {error && (error.status === 422 || error.status === 500 || error.status === 204) && 
       <div className='mt-10 text-danger'>{error.error}</div>}
      {categories?.length > 0 && categories.map((category, index) => {
        return <DisplayInfo 
        onPermanantDelete={(e)=> handlePermenantDelete(e,category._id,category.category_name)} 
        isTrue={showpermentdeletebutton} keyindex={index} label={"Category"} value={category.category_name}
          onEdit={(e) => handleEdit(e, category._id)} 
          onDelete={(e) => handleDelete(e, category._id,category.category_name)} />
         
      })}
       </Col>
    </div>
  )
}




export default ManageCategories