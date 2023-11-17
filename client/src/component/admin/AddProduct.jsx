import React, { useState , useEffect, useMemo} from 'react'
import { useDispatch ,useSelector} from 'react-redux';
import {createProduct } from '../../reduxtoolkit/productReducer';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { DisplayCheckbox, DisplayInput, DisplaySelectForm } from '../globalcomponent';
import { clearCategories, getAllCategory } from '../../reduxtoolkit/categoryReducer';
import { clearBrands, getAllBrand } from '../../reduxtoolkit/brandReducer';
import { clearSubcategories, getallsubcategory } from '../../reduxtoolkit/subcategoryReducer';

function AddProduct() {
  
 
  const dispatch = useDispatch()


  const productInfo = useSelector(state=> state.productInfo.product);
  const categoryInfo = useSelector(state=> state.categoryInfo.categories);
  const brandInfo = useSelector(state=> state.brandInfo.brands);
  const subcategoryInfo = useSelector(state=> state.subcategoryInfo.subcategories);

  const categoryError = useSelector(state=> state.categoryInfo.error);
  const brandError = useSelector(state=> state.brandInfo.error);
  const subcategoryError = useSelector(state=> state.subcategoryInfo.error);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [radio, setRadio] = useState('')
  const [product,setProduct] = useState({category:'',subcategory:'',
   product_name:'',description:'',brand:'',price:'',file: {},quantity:''});

  const [error, setError] = useState(null)
  const [brand_error , setBrandError] = useState(null);
  const [subcategory_error , setSubCategoryError] = useState(null);
  const [category_error , setCategoryError] = useState(null);
  const [successmsg, setSuccessMsg] = useState(null);
  

  const DisplayError = (data)=> {
    setError(data)
    setTimeout(() => {
      setError(null);
    }, 3000);
  }
   
  const DisplaySuccessMsg = (data)=> {
    setSuccessMsg(data)
    setTimeout(() => {
      setSuccessMsg(null);
    }, 3000)
  }

  useEffect(()=> {
    dispatch(getAllBrand())
    dispatch(getAllCategory());
    dispatch(getallsubcategory());
    
    return ()=> {
      dispatch(clearCategories());
      dispatch(clearSubcategories());
      dispatch(clearBrands());
    }
  },[])


  useEffect(()=> {
    if(productInfo) {
      
      DisplaySuccessMsg("Product added successfully")
       //Clear the form field after success
      setProduct({category:'',subcategory:'',
      product_name:'',description:'',brand:'',price:'',file: {},quantity:''})
      setRadio(null)
    }
  },[productInfo])

  useMemo(()=> {
    if(brandError?.response?.status === 204 || categoryError?.response?.status === 204 || 
      subcategoryError?.response?.status === 404) {
        console.log(brandError,categoryError,subcategoryError)
      }else{
        console.log(brandError,categoryError,subcategoryError)
      }
  },[brandError,categoryError,subcategoryError])


  useMemo(()=> {
    
    if(brandInfo) {
      if(brandInfo?.status === 200) {
        setBrands(brandInfo.data.brands)
      }else if(brandInfo?.status === 204) {
        setBrandError("No brands were created")
      }
    }
    if(categoryInfo) {
      if(categoryInfo?.status === 200) {
        setCategories(categoryInfo.data?.categories)
      }else if(categoryInfo?.status === 204) {
        // if no categories in the database
        setCategoryError({status: 204, error: "No categories were created."})
      }
    }
    if(subcategoryInfo) {
      if(subcategoryInfo?.status === 200) {
        setSubCategories(subcategoryInfo.data?.subcategories)
      }else if(subcategoryInfo?.status === 204) {
        setSubCategoryError({status : 204, error: "No subcategories were created"})
      }
    }
    
  },[categoryInfo,brandInfo, subcategoryInfo])


  useMemo(() => {
    if(brandError?.response?.status === 500) {
      setBrandError(brandError?.response.data || "Oops!, Something went wrong. Please try again later")
    }
  }, [brandError])

  useMemo(() => {
    if(categoryError?.response?.status === 500) {
      setCategoryError(categoryError?.response.data || "Oops!, Something went wrong. Please try again later")
    }
  }, [categoryError])

  useMemo(() => {
    if(subcategoryError?.response?.status === 500) {
      setCategoryError(subcategoryError?.response.data || "Oops!, Something went wrong. Please try again later")
    }
  }, [subcategoryError])
  
  const handleChange = (e)=> {  
    
    const {name, value} = e.target;
    setProduct({...product, [name]:value})
  }
  const handleSubmit = (e)=> {
    e.preventDefault();
    
    console.log(radio)
    console.log(product)
    let {category,subcategory, product_name,description,brand,price,file,quantity} = product
    
    if(!category || !brand || !price || !quantity || !radio || !file || !subcategory) {
    
      DisplayError("Require all field")
    }else if(file.type !== "image/jpeg" && file.type !== "image/webp") {
      
      DisplayError("Select an image file only")
    } else {
    const formdata = new FormData();
    formdata.append('product_name', product_name)
    formdata.append('category',category);
    formdata.append('subcategory', subcategory);
    formdata.append('description',description);
    formdata.append('brand',brand);
    formdata.append('price',price);
    formdata.append('quantity',quantity);
    formdata.append('gender',radio);
    formdata.append('filename',file);
    dispatch(createProduct(formdata))
    
    }
  }
  
  
    return (
    <div>
    
      <Col md={8} className='m-auto mt-2 mb-4'>
      <Form onSubmit={handleSubmit}>

      <DisplayInput label={"Product Name"} value={product.product_name} 
      classname={"mb-3"} type={"text"} 
        name={"product_name"} onchange={handleChange}/>
        
        <DisplaySelectForm error={category_error} selectedvalue={product.category} 
        mapobjvalue={"category_name"} formlabel={"Category"} 
        optlabel={"Select Category"} loopitem={categories} 
        name={"category"} formselectonchange={handleChange}/>

        <DisplaySelectForm error={subcategory_error} selectedvalue={product.subcategory} 
        mapobjvalue={"subcategory_name"} formlabel={"Subcategory"} 
        optlabel={"Select Subcategories"} loopitem={subcategories} 
        name={"subcategory"} formselectonchange={handleChange}/>

        <DisplaySelectForm error={brand_error} selectedvalue={product.brand} 
        mapobjvalue={"brand_name"} formlabel={"Brand"} 
        optlabel={"Select Brand"} loopitem={brands} name={"brand"} 
        formselectonchange={handleChange}/>
        
        <DisplayInput value={product.price} label={"Price"} classname={"mb-3"} type={"number"} 
        name={"price"} onchange={handleChange}/>

        <DisplayInput value={product.quantity} label={"Quantity"} classname={"mb-3"} type={"number"} 
        name={"quantity"} onchange={handleChange}/>
      
      <Form.Label>Gender</Form.Label>
      <Row style={{maxWidth:"300px"}}>
      <DisplayCheckbox type={"radio"} label={"Men"} value={"Men"} 
      onchange={e=> setRadio(e.target.value)} name={"gender"} checked={radio === "Men"}/>
      
      <DisplayCheckbox type={"radio"} label={"Women"} value={"Women"} 
      onchange={e=> setRadio(e.target.value)} name={"gender"} checked={radio === "Women"}/>
      
      </Row>
      <DisplayInput value={product.description} label={"Description"} classname={"mb-3 mt-2"} as={"textarea"} 
        name={"description"} rows={3} onchange={handleChange}/>
      
      <DisplayInput label={"Product Image"} classname={"mb-3"} 
        name={"file"} type={"file"} 
        onchange={(e)=> setProduct({...product, [e.target.name]:e.target.files[0]})}/>
      
      <Button type='submit' variant='outline-primary'>Submit</Button>
    </Form>
        {successmsg && <Alert variant='success' className='mt-2 mb-4'>{successmsg}</Alert>}
        {error && <Alert variant='danger'className='mt-2 mb-4' >{error}</Alert>}
    </Col>
      
    </div>
  )
 
  
}



export default AddProduct
