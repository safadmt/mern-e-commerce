import React, { useEffect,useRef, useState } from 'react'
import { Button, Col, Row, Table ,Form, Spinner} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { clearDelete, clearSortedproduct,
   clearproduct, getProducts, getProductsByPrice, 
   removeProduct ,searchProduct} from '../../reduxtoolkit/productReducer';
import { Link, useNavigate } from 'react-router-dom';
import { PageNotFound, ProductPagination } from '../globalcomponent';

function Product() {
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const searchText = useRef()

  const productsInfo = useSelector(state=> state.productInfo.products);
  const isProductLoading = useSelector(state=> state.productInfo.loading);
  const sortedProduct = useSelector(state=> state.productInfo.sortedproducts);
  const isDeleted = useSelector(state=> state.productInfo.delete);
  const producterr = useSelector((state)=> state.productInfo.error);
  const [page, setPage] = useState(1)
  const [addbtn, setAddBtn] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(null)
  const [error, setError] = useState(null);
  const [productlist, setProductList] = useState(null);
  
  useEffect(()=> {
    const info= {
      page : currentPage,
      limit : 12
    }
    dispatch(getProducts(info))
    return ()=> {
      dispatch(clearDelete())
      dispatch(clearSortedproduct())
      dispatch(clearproduct());
      
    }
  },[isDeleted,currentPage])


  useEffect(()=> {
    if(productsInfo) {
      if(productsInfo.status === 200) {
        setTotalPages(productsInfo?.data?.totalpages)
        setProductList(productsInfo?.data?.products)
      }else if(productsInfo.status === 204) {
        setError("Sorry no products created")
      }
      
    }
    if(sortedProduct) {
      if(sortedProduct.status === 200) {
        setTotalPages(productsInfo.totalPages)
        setProductList(sortedProduct.products)
      }else if(sortedProduct.status === 204) {
        setError("Sorry no products created")
      }
    }
  }, [productsInfo ,sortedProduct])

  
  useEffect(()=> {
    if(producterr) {
      if(producterr?.response?.status === 5000) {
       
        setError("Oops! , Something went wrong. Please try again later")
      }else{
        console.log(producterr)
      }
    }
  },[producterr])

  const handleDelete = (e,id)=> {
    e.preventDefault();
    if(window.confirm("Are you sure you want to delete this product ? ")) {
      dispatch(removeProduct(id))
    }
    
  }
  

  const handleSubmit = (e)=> {
    e.preventDefault();
    if(!searchText.current)
    return false;
    dispatch(searchProduct(searchText.current))
  }

  const handleProduct = (e)=> {
   
    const {value} = e.target;
    
    if(!value) return false;
    if(value === "-1" || value === "1") {
      dispatch(getProductsByPrice({value: value,page:1, limit: 12}));
    }else if(value === "3") {
      dispatch(getProducts({page:1,limit:12}))
      
    }
  }
  console.log(productlist)
  if(isProductLoading) {
    return (
      <div className='m-auto text-center pt-20'>
       <span className='text-green-700'><Spinner animation="border" variant="success" /> Loading...</span> 
        
      </div>
    )
  }else if(productlist !== undefined && productlist !== null && productlist.length > 0  ) {
  return (
    <div className='p-6'>
      <Row className='mb-2 justify-content-center'>
        <Col>
      <Form inline onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Control
              type="text"
              placeholder="Search"
              className=" mr-sm-2"
              size='sm'
              value={searchText.current}
              onChange={(e)=> searchText.current = e.target.value}
            />
          </Col>
          <Col xs="auto">
            <Button type="submit" size='sm'>Submit</Button>
          </Col>
        </Row>
      </Form>
      </Col>
          <Col md={4}>
          <Form.Select aria-label="Default select example" onChange={handleProduct}> 
      <option>Sort</option>
      <option value="1">Price low to high</option>
      <option value="-1">Price high to low</option>
      <option value="3">What's new</option>
    </Form.Select>
          </Col>
        
      </Row>
        <div>
        
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Sl.num</th>
          <th>Image</th>
          <th>Product Name</th>
          <th>Brand</th>
          <th>Category</th>
          <th>Subcategory</th>
          <th>Gender</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {productlist.map((product,index)=> {
          return <tr>
          <td>{index + 1}</td>
          <td><Link to={`/admin/products/${product._id}`}><img src={`http://localhost:5000/images/${product.filename}`} style={{width:"150px"}}/></Link></td>
          <td>{product.product_name}</td>
          <td>{product.brandInfo?.brand_name}</td>
          <td>{product.categoryInfo?.category_name}</td>
          <td>{product.subcategoryInfo.subcategory_name }</td>
          <td>{product.gender}</td>
          <td>{product.price}</td>
          <td>{product.quantity}</td>
          <td>{product.description}</td>
          <td><Button variant='primary' onClick={()=> Navigate(`/admin/product/${product._id}`)}>Edit</Button></td>
          <td><Button variant='danger' onClick={(e)=> handleDelete(e,product._id)}>Delete</Button></td>
        </tr>
        })}
        
        
      </tbody>
    </Table>
    <Row>
        <ProductPagination currentpage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages}/>
        
      </Row>
        </div>
    </div>
  )}else if(error) {
    return (
      <div className='mt-10'>
        <PageNotFound data={error}/>
      </div>
    )
  }
}

export default Product
