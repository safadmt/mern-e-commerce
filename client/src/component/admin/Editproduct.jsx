import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { clearProductError, clearUpdate, clearproduct, editProduct, getOneproduct } from '../../reduxtoolkit/productReducer';
import { Col, Form, Row ,Alert , Button} from 'react-bootstrap';
import { clearCategories, clearCategoryError, getAllCategory } from '../../reduxtoolkit/categoryReducer';
import { clearSubcategories, clearSubcategoryError, getallsubcategory } from '../../reduxtoolkit/subcategoryReducer';
import { clearBrandError, clearBrands, getAllBrand } from '../../reduxtoolkit/brandReducer';
import { DisplaySelectForm, PageNotFound } from '../globalcomponent';

function Editproduct() {
    const dispatch = useDispatch();
    const {productid} = useParams();

    const productLoading = useSelector(state=> state.productInfo.loading);
    const productInfo = useSelector(state=> state.productInfo.product);
    const categoryInfo = useSelector(state=> state.categoryInfo.categories);
    const brandInfo = useSelector(state=> state.brandInfo.brands);
    const subcategoryInfo = useSelector(state=> state.subcategoryInfo.subcategories);
    const isUpdated = useSelector(state=> state.productInfo.update);

    const productError = useSelector(state=> state.productInfo.error);
    const subcategoryError = useSelector(state => state.subcategoryInfo.error);
    const brandError = useSelector(state => state.brandInfo.error);
    const categoryError = useSelector(state=> state.categoryInfo.error)

    const [file, setFile] = useState(null);
    const [isFiletrue, setIsFileTrue] = useState(false);
    const [changedFile, setChangedFile] = useState(null);
    const [product, setProduct] = useState({})
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [error, setError] = useState(null);
    const [branderror, setBrandError] = useState(null);
    const [subcategoryerror, setSubcategoryError] = useState(null);
    const [categoryerror, setCategoryError] = useState(null)
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
      dispatch(getOneproduct(productid))  
      
      
      return ()=> {
        dispatch(clearproduct());
        dispatch(clearCategories());
        dispatch(clearSubcategories());
        dispatch(clearBrands());
        dispatch(clearBrandError());
        dispatch(clearCategoryError());
        dispatch(clearSubcategoryError());
        dispatch(clearProductError())
      }
    },[])
    
    useEffect(()=> {
      if(isUpdated) {
        DisplaySuccessMsg("Product updated successfully")
        
      }
      return ()=> {
        dispatch(clearUpdate())
      }
    },[isUpdated])

    useEffect(()=> {
        if(categoryInfo) {
          
          if(categoryInfo?.status === 200) {
            console.log(categoryInfo)
            setCategories(categoryInfo?.data?.categories);
          }else if(categoryInfo?.status === 204) {
            setCategoryError("No categories created")
          }
        }
        
        if(brandInfo) {
          if(brandInfo?.status === 200) {
            setBrands(brandInfo?.data?.brands);
          }else if(brandInfo?.status === 204) {
            setBrandError('No brands created')
          }
        }
        
        if(subcategoryInfo) {
            if(subcategoryInfo?.status === 200) {
              setSubCategories(subcategoryInfo?.data?.subcategories)
            }else if(subcategoryInfo?.status === 204) {
              setSubcategoryError('No subcategories created')
            }
        }
        

        if(productInfo) {
            const {product_name,brandInfo, categoryInfo,subcategoryInfo, 
              gender, price ,quantity, description,_id} = productInfo
            setProduct({brandInfo,categoryInfo,subcategoryInfo,product_name,
              gender,price,quantity, description,_id}) 
        } 
    },[productInfo, categoryInfo, brandInfo, subcategoryInfo])
    
    useEffect(()=> {

      if (productError) {
        if(productError.response?.status === 404) {
          setError({status: 404, error : productError.response?.data || 'Page not found'})
        }
    }
      if (subcategoryError?.response?.status === 500) {
        setSubcategoryError('Oops! , Something went wrong.')
      }


      if (brandError?.response?.status === 500) {
        setBrandError('Oops! , Something went wrong.')
       
      }
  
      if(categoryError?.response?.status === 500) {
        setCategoryError("Oops!, Something went wrong.")
      } 
    } ,[productError ,brandError, categoryError,subcategoryError])

    const handleFormSelectChange = (e,keyitem)=>  {
      
      const {name, value} = e.target;
      console.log(name,value)
      setProduct(prevState=> ({
        ...prevState,
        [keyitem] : {...prevState[keyitem] , _id: value}
      }))
    }

    const handleChange = (e)=> {

      const {name, value} = e.target;
      console.log(name, value)
      setProduct({...product, [name]:value})
    }


    const handleRadioChange = (e)=> {
      if(e.target.checked) {
        setProduct({...product, gender:e.target.value})
      }
    } 


    const handleFileChage = (e)=> {
      const currentFile= e.target.files[0]
      if(currentFile) {
        setFile(currentFile);
        const filereader = new FileReader()
        filereader.onload = ()=> {
          setChangedFile(filereader.result);
        }
        filereader.readAsDataURL(currentFile)
        setIsFileTrue(true)
      }else{
        setIsFileTrue(false);
        setChangedFile(null);
      }
    }

    const handleSubmit = (e, id)=> {
      e.preventDefault()

      const {brandInfo,categoryInfo,subcategoryInfo,product_name,
        gender,price,quantity, description} = product;
      if(!brandInfo || !brandInfo._id ||  !categoryInfo || 
        !categoryInfo._id || !gender || !quantity || !price || 
         !subcategoryInfo || !subcategoryInfo._id) {
        return DisplayError({status: 'auth', error: 'Required all field'});
      }else if(!description && !product_name) {
        return DisplayError({status: 'auth', error: 'Required porduct name or description'});
      }
      const formdata = new FormData();
    formdata.append('product_name' , product_name)
    formdata.append('category',categoryInfo._id);
    formdata.append('subcategory', subcategoryInfo._id)
    formdata.append('description',description);
    formdata.append('brand',brandInfo._id);
    formdata.append('price',price);
    formdata.append('quantity',quantity);
    formdata.append('gender',gender);
    formdata.append('filename',file);
      const productInfo = {
        formdata,
        id
      }
      dispatch(editProduct(productInfo))
    }


  if(productLoading) {
    return (
      <div className='m-auto text-center pt-20'>
        <button  className="text-green-700" disabled>
        <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24"></svg>
        Loading...
        </button>
      </div>
    )
  }else if(product &&
    product._id &&
    product.categoryInfo &&
    product.subcategoryInfo &&
    product.brandInfo) {
        return (
    <div>
      
       
        <Col md={8} className='m-auto mt-2 mb-4'>
        
      <Form onSubmit={(e)=> handleSubmit(e,product?._id)}>

      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Product_name</Form.Label>
        <Form.Control type="text" name='product_name' 
        value={product?.product_name} onChange={handleChange}/>
      </Form.Group>

        <DisplaySelectForm error={categoryerror} selectedvalue={product?.categoryInfo?._id} 
        mapobjvalue={"category_name"} formlabel={"Category"} 
        optlabel={product?.categoryInfo?.category_name ? product?.categoryInfo?.category_name : 
          "Select Category"} loopitem={categories} 
        name={"category"} formselectonchange={(e)=> handleFormSelectChange(e,"categoryInfo")}
        currentvalue={product?.categoryInfo?._id}/>

        <DisplaySelectForm error={subcategoryerror} selectedvalue={product?.subcategoryInfo._id} 
        mapobjvalue={"subcategory_name"} formlabel={"Subcategory"} 
        optlabel={product?.subcategoryInfo?.subcategory_name ? 
          product?.subcategoryInfo?.subcategory_name :"Select Subcategories"} 
          loopitem={subcategories} currentvalue={product?.subcategoryInfo?._id}
        name={"subcategory"} formselectonchange={(e)=> handleFormSelectChange(e,"subcategoryInfo")}/>

        <DisplaySelectForm error={branderror} selectedvalue={product?.brandInfo._id} 
        mapobjvalue={"brand_name"} formlabel={"Brand"} 
        optlabel={product?.brandInfo?.brand_name ? product?.brandInfo?.brand_name :
          "Select Brand"} loopitem={brands} name={"brand"} 
        formselectonchange={(e)=> handleFormSelectChange(e,"brandInfo")} 
        currentvalue={product?.brandInfo?._id}/>

      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Price</Form.Label>
        <Form.Control type="Number" name='price' value={product?.price} onChange={handleChange}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Quantity</Form.Label>
        <Form.Control type="Number" name='quantity' value={product?.quantity} onChange={handleChange}/>
      </Form.Group>
      <Form.Label>Gender</Form.Label>
      <Row style={{maxWidth:"300px"}}>
      <Col><Form.Check type="radio" label="Mens" 
      value="mens" onChange={handleRadioChange} name='gender'/></Col>
      <Col><Form.Check type='radio' label="Womens" value="womens" 
      onChange={handleRadioChange} name='gender'/></Col>
      <Col><Form.Check type='radio' label="Kids" value="kids" 
      onChange={handleRadioChange} name='gender'/></Col>
      </Row>
      <Form.Group className="mb-3 mt-2" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" name='description' value={product?.description} onChange={handleChange} rows={3} />
      </Form.Group>
      
      <Row>
        {isFiletrue ? <Col c><img src={changedFile}/></Col> :
        <Col sm={12} md={6}><img src={`http://localhost:5000/images/${productInfo?.filename}`}/></Col>}
      </Row>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Product Image</Form.Label>
        <Form.Control type="file" name='filename' 
        onChange={handleFileChage}/>
      </Form.Group>
      <Button type='submit' variant='outline-primary'>Submit</Button>
    </Form>
      {successmsg && <Alert variant='success'>{successmsg}</Alert>}
        {error?.status === 'auth' && <Alert variant='danger'>{error?.error}</Alert>}
    </Col>
    </div>
  )
}else if(error?.status === 404) {
  return (
    <div>
      <PageNotFound data={error?.error}/>
    </div>
  )
}
}

export default Editproduct