import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { addNewBrand, clearBrandError, 
  clearBrands, editBrand, getAllBrand, 
  getOneBrand, removebrand, removebrandpermenant } from '../../reduxtoolkit/brandReducer';
import { Button, Col, Form } from 'react-bootstrap';
import '../../App.css';
import { clearCategoryError, getAllCategory } from '../../reduxtoolkit/categoryReducer';
import { DisplayInfo, DisplayInput, DisplaySelectForm } from '../globalcomponent';


function ManageBrand() {

  const dispatch = useDispatch()

  const brandsInfo = useSelector(state => state.brandInfo.brands);
  const categoriesInfo = useSelector(state => state.categoryInfo.categories);
  const branderror = useSelector(state => state.brandInfo.error);
  const category_error = useSelector(state => state.categoryInfo.error);
  const brandInfo = useSelector(state => state.brandInfo.brand);
  const is_Deleted = useSelector(state => state.brandInfo.deleted);
  const updated = useSelector(state => state.brandInfo.updated);
  const createdbrand = useSelector(state => state.brandInfo.createdbrand);

  const [successmsg, setSuccessMsg] = useState(null);
  const [categoryerror, setCategoryError] = useState(null);
  const [error, setError] = useState(null);
  const [brand_error, setBrandError] = useState(null);
  const [brand, setBrand] = useState(null)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPermenantDelete, setShowPermenantDelete] = useState(true);
  const [brandId,setBrandId] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editselectedCategory, setEditSelectedCategory] = useState(null);
  const [addNewbrand, setAddNewBrand] = useState({brand_name:'', category:''});

  

  const displaySuccesmsg = (data) => {
    setSuccessMsg(data);
    setTimeout(() => {
      setSuccessMsg(null)
    }, 4000);
  }

function displayErrormsg(data,setState) {
    setState(data);
    setTimeout(() => {
      setState(null)
    }, 4000);
  }

  




  useEffect(() => {
    dispatch(getAllBrand())
    return () => {
      dispatch(clearBrandError());
      dispatch(clearBrands());
      dispatch(clearCategoryError())
      setShowAddForm(false);
      setShowEditForm(false);
      setCategoryError(null);
      setBrandError(null);
    }
  }, [createdbrand, updated])

  useEffect(()=> {
    
    if(is_Deleted) {
      dispatch(getAllBrand())
      const newbrands = brands.filter(item => item._id !== brandId)
      setBrands(newbrands)
    }
  },[is_Deleted,brandId])

  useEffect(() => {
    if (createdbrand) {
      displaySuccesmsg("SubCategory added")
    }
    if (updated) {
      console.log(updated)
      displaySuccesmsg("Successfully updated")
    }
  }, [createdbrand, updated])



  useEffect(() => {
    if (brandsInfo) {
      if(brandsInfo?.status === 200) {
        setBrands(brandsInfo.data.brands)
      }else if(brandsInfo?.status === 204) {
        setBrandError("No brands were created")
      }
      
    }
    if (categoriesInfo) {
      if(categoriesInfo?.status === 200) {
        setCategories(categoriesInfo.data.categories)
      }else if(categoriesInfo?.status === 204) {
        setCategoryError("No categories were created")
      }
      
    }
  }, [brandsInfo, categoriesInfo])



  useMemo(() => {
    if (brandInfo) {
      console.log(brandInfo)
      setBrand(brandInfo.brand)
    }
  }, [brandInfo])


  useEffect(() => {
    if (branderror) {
      console.log(branderror)
      if (branderror.response?.status === 404) {
        displayErrormsg(branderror.response.data || "Sorry ! , The requested item not found", setBrandError)
      }else if(branderror.response?.status === 500) {
        displayErrormsg(branderror.response.data || "Oops ! , Something went wrong. Please try again later", setBrandError)
      }else if(branderror.response?.status === 422) {
        displayErrormsg(branderror.response?.data?.error || `Can't delete! Brand is associated 
            with products. First remove or modify products associated with this brand.`, setBrandError)
      }
    }
  }, [branderror])

  
  useEffect(()=> {
    if(category_error?.response?.status === 500) {
      setCategoryError(category_error.response?.data || "Oops! , Something went wrong")
    }
  },[category_error])


  const handleEdit = (e, brandId) => {
    e.preventDefault();
    dispatch(getAllCategory())
    dispatch(getOneBrand(brandId))
    setShowEditForm(true)
  }


  const handleDelete = (e, brandId, brandname) => {
    e.preventDefault();
    if (window.confirm(`do you want to delete this ${brandname} !`)) {
      dispatch(removebrand(brandId))
      const newbrands = brands.filter(item => item._id !== brandId)
      setBrands(newbrands)
    }
  }



  const handleEditedForm = (e) => {
    e.preventDefault();
    console.log(brand)
    const { brand_name, category } = brand;
    if (!brand_name || !category._id) return displayErrormsg("Required all field")
    const info = {
      brandId: brand._id,
      body: {
        brand_name,
        category: category._id
      }
    }
    dispatch(editBrand(info))
  }

  const handleSelectCategory = (e)=> {
    const selectedvalue = e.target.value;
    setAddNewBrand({...addNewbrand, category:selectedvalue})
    const selected_Category = categories.find(category=> category._id === selectedvalue)
    setSelectedCategory(selected_Category.category_name)
  }

  const handleEditSelectedCategory = (e)=> {
    const selectedvalue = e.target.value;
    setBrand(prevBrand => ({
      ...prevBrand,
      category: { ...prevBrand.newcategory, _id: selectedvalue }
    }))
    const selected_Category = categories.find(category=> category._id === selectedvalue)
    setEditSelectedCategory(selected_Category.category_name)
  }
  const handlePermenantDelete = (e,brandId,brandname)=> {
    e.preventDefault();
    if (window.confirm("do you want to delate " + brandname + " brand ? " +
      "if you are deleting this brand , you have to delele or change proudcts and categories " +
      "associated with this brand !")) {
      dispatch(removebrandpermenant(brandId))
      setBrandId(brandId)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(addNewbrand)
    const { brand_name, category } = addNewbrand;
    if (!brand_name && !category)
      return displayErrormsg("Field is required", setError)
    dispatch(addNewBrand(addNewbrand))
  }
  console.log(branderror)
  return (
    <div className='ms-4 mt-2'>
      
      <Col>
        <Button variant='outline-secondary' onClick={() => {
          setShowAddForm(true)
          dispatch(getAllCategory())
        }}>Add New Brand</Button>
        {error && <p className='text-warning'>{error}</p>}



        {showAddForm && <Col md={4} sm={12} className='formdivadminmanage mt-2'>
          <Form onSubmit={handleSubmit}>
            {successmsg && <p className='text-success'>{successmsg}</p>}
            {error && <p className='text-warning'>{error}</p>}
            <DisplayInput value={addNewbrand.brand_name} type={"text"} classname={"mb-2"} 
            onchange={(e) => setAddNewBrand({...addNewbrand,brand_name:e.target.value })}
              label={"Brand Name"} />
            <DisplaySelectForm error={categoryerror} mapobjvalue={"category_name"} 
            formlabel={"Category associated with"} 
            optlabel={selectedCategory}
            loopitem={categories} formselectonchange={handleSelectCategory}
              label={"Associated Cateogory"} />
            <Button variant='outline-primary' className='mt-2 inline me-2' type='submit'>Submit</Button>
            <Button variant='outline-danger' className='mt-2' onClick={() => setShowAddForm(false)}>Cancel</Button>
          </Form>
        </Col>}
      </Col>
      <div>



        {showEditForm && brand && categories && <Col md={4} sm={12} className='formdivadminmanage mt-2'>
          <Form onSubmit={handleEditedForm}>
            {successmsg && <p className='text-success'>{successmsg}</p>}
            {error && <p className='text-warning'>{error}</p>}
            <DisplayInput value={brand.brand_name} label={"Brand Name"}
             name={"brand_name"} onchange={(e) => setBrand(prevBrand => ({
              ...prevBrand,
              brand_name: e.target.value
            }))}
            />
            <DisplaySelectForm error={categoryerror} mapobjvalue={"category_name"} 
            formlabel={"Category associated with"} loopitem={categories}
              selectedvalue={brand.category?.category_name} optlabel={brand.category?.category_name || editselectedCategory}
              formselectonchange={handleEditSelectedCategory} />
            <Button variant='outline-primary' className='mt-2 inline' type='submit'>Submit</Button>
            <Button variant='outline-danger' className='ms-2 mt-2 inline' onClick={() => setShowEditForm(false)}>Cancel</Button>
          </Form>
        </Col>}

        
        {brand_error && <div className='mt-10 text-warning'>{brand_error}</div>}
        {brands?.length > 0 && <div className='mt-10'>
          <p>Brands List</p>
          {brands.map((brand, index) => {
          return <DisplayInfo keyindex={index} label={"Brand"} value={brand.brand_name}
            onEdit={(e) => handleEdit(e, brand._id)} value2={{
              label: "Associated Category",
              category: brand.newcategory.category_name
            }} isTrue={showPermenantDelete}
            onDelete={(e) => handleDelete(e, brand._id, brand.brand_name)} 
            onPermanantDelete={(e)=> handlePermenantDelete(e,brand._id,brand.brand_name)}/>
        })}
        </div>}
      </div>
    </div>
  )
}











export default ManageBrand