import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearProductError, clearProducts,
  getFilteredProducts, getProducts, getProductsByPrice
} from '../../reduxtoolkit/productReducer'
import { addToCart, clearCarterr, getCartCount } from '../../reduxtoolkit/cartReducer'
import { Button, Col, Row, Form, Spinner } from 'react-bootstrap';
import '../../App.css'
import FilterProudcts from './FilterProudcts'
import { PageNotFound, ProductPagination } from '../globalcomponent'
import { clearCategories, clearCategoryError, getAllCategory } from '../../reduxtoolkit/categoryReducer'
import { clearSubcategories, clearSubcategoryError, getallsubcategory } from '../../reduxtoolkit/subcategoryReducer'
import { clearBrandError, clearBrands, getAllBrand } from '../../reduxtoolkit/brandReducer'



function GetPosts() {


  const location = useLocation();
  const Navigate = useNavigate();
  const dispatch = useDispatch()


  const cartInfo = useSelector(state => state.cartInfo.cartInfo)
  const user = useSelector(state => state.userInfo.user)
  const loadingProduct = useSelector(state => state.productInfo.loading);
  const loadingCategory = useSelector(state => state.categoryInfo.loading);
  const loadingSubategory = useSelector(state => state.subcategoryInfo.loading);
  const loadingBrand = useSelector(state => state.brandInfo.loading);
  const product = useSelector((state) => state.productInfo.products);
  const sortedProduct = useSelector((state) => state.productInfo.sortedproducts);
  const filteredProduct = useSelector(state => state.productInfo.filteredproducts);
  const producterr = useSelector((state) => state.productInfo.error);
  const categoryInfo = useSelector(state => state.categoryInfo.categories);
  const subcategoryInfo = useSelector(state => state.subcategoryInfo.subcategories);
  const brandInfo = useSelector(state => state.brandInfo.brands);


  const categoryError = useSelector(state => state.categoryInfo.error);
  const subcategoryError = useSelector(state => state.subcategoryInfo.error);
  const brandError = useSelector(state => state.brandInfo.error);
  const cartError = useSelector((state) => state.cartInfo.error);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [productslist, setProductList] = useState([]);
  const [totalPages, setTotalPages] = useState(null)
  const [currentpage, setCurrentPage] = useState(1)
  const [sortedvalue, setSortedValue] = useState(null)
  const [brandloading, setBrandLoaing] = useState(true);
  const [categoryloading, setCategoryLoaing] = useState(true);
  const [subcategoryloading, setSubcategoryLoaing] = useState(true);

  const [error, setError] = useState(null);
  const [product_error, setProductError] = useState(null);
  const [category_error, setCategoryError] = useState(null);
  const [subcategory_error, setSubcategoryError] = useState(null);
  const [brand_error, setBrandError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();


  const [filterName, setFilterName] = useState({
    category: [],
    subcategory: [],
    brand: [],
    price: "",
    gender: []
  })

  const [filters, setFilters] = useState({
    category: [],
    subcategory: [],
    brand: [],
    price: "",
    gender: []
  })


  const [filterGender, setFilterGender] = useState([
    { _id: 'Men', gender: 'Men', label: 'Mens', checked: false },
    { _id: 'Women', gender: 'Women', label: 'Womens', checked: false }
  ]);

  const [filterPrice, setFilterPrice] = useState([
    { _id: "", price: '', label: 'Unselect' },
    { _id: "lt 1000", price: 'Below 1000', label: 'Below 1000' },
    { _id: "gt 1000 lt 2000", price: '1000 to 2000', label: '1000 to 2000' },
    { _id: "gt 2000", price: '2000 +', label: '2000 +' }
  ]);


  const clearError = () => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }


  const retieveSearchParams = () => {
    const searchString = location.search;
    const searchquery = new URLSearchParams(searchString);
    const decode = decodeURIComponent(searchquery.toString().replace(/\+/g, ' '))
    const valuePattern = /(?:^|&)([^&=]*)=([^&]*)/g;

    // Initialize the result object
    const resultObject = {};

    // Iterate through the matches in the query string
    let match;
    while ((match = valuePattern.exec(decode))) {
      const [, key, value] = match;
      // Split the value by % to extract individual values
      const values = value ? value.split("%") : [];
      resultObject[key] = values;
    }
    return resultObject;
  }

  //Displaying error messages
  function dispalyError(data) {
    setError(data)
    setTimeout(() => {
      setError(null)
    }, 3000);
  }

  useEffect(() => {
    dispatch(getAllCategory());
    dispatch(getallsubcategory());
    dispatch(getAllBrand());

    return () => {
      dispatch(clearProducts());
      dispatch(clearProductError());
      dispatch(clearCategories());
      dispatch(clearSubcategories());
      dispatch(clearBrands());
      dispatch(clearBrandError());
      dispatch(clearCategoryError());
      dispatch(clearSubcategoryError());

    }
  }, [])

//checkbox checked true or false based on the url search query
  const handleSetCheckboxes = (state, setState, item, itemname) => {
    const searchparam = retieveSearchParams()
    let filteredId = [];
    const newState = state?.map(state => {
      if (searchparam && searchparam[item] && searchparam[item].includes(state[itemname])) {
        filteredId.push(state._id)
        return { ...state, checked: true }
      } else {
        return { ...state, checked: false }
      }
    })
    return { newState, filteredId }
  }


  useEffect(() => {

    const searchparam = retieveSearchParams()
    let categoryids = []
    let subcategoryIds = []
    let brandIds = []
    let genderIds = []
    let brand_detils = []
    let subcategory_detils = []
    let cateogry_details = []
    let priceid = ""
    let pricename = ""
    if (categoryInfo) {

      if (categoryInfo?.status === 200) {
        const category_info = handleSetCheckboxes(categoryInfo?.data?.categories,

          setCategories, "category", "category_name")

        categoryids = category_info.filteredId
        cateogry_details = category_info.newState
      } else if (categoryInfo?.status === 204) {
        setCategoryError("No categories created yet")
      }

    }
    if (subcategoryInfo) {

      if (subcategoryInfo?.status === 200) {
        const subcategory_info = handleSetCheckboxes(subcategoryInfo?.data?.subcategories,
          setSubCategories, "subcategory", "subcategory_name")

        subcategoryIds = subcategory_info.filteredId
        subcategory_detils = subcategory_info.newState
      } else if (subcategoryInfo?.status === 204) {
        setSubcategoryError("No subcategories created yet")
      }
    }
    if (brandInfo) {

      if (brandInfo?.status === 200) {
        const brand_info = handleSetCheckboxes(brandInfo?.data?.brands, setBrands, "brand", "brand_name")

        brandIds = brand_info.filteredId;
        brand_detils = brand_info.newState
      } else if (brandInfo?.status === 204) {
        setBrandError("No brands created yet")
      }

    }
    let gender_details = filterGender.map(item => {
      if (searchparam?.gender?.length > 0 && searchparam?.gender.includes(item.gender)) {
        genderIds.push(item._id)
        item.checked = true;
      }
      return item;
    })
    setFilterGender(gender_details)


    filterPrice.map(price => {
      if (searchparam?.price?.includes(price.price)) {
        priceid = price._id
        pricename = price.price
      }
    })
    setCategories(cateogry_details);
    setSubCategories(subcategory_detils);
    setBrands(brand_detils)

    if (searchparam?.category?.length > 0 || searchparam?.brand?.length > 0
      || searchparam?.subcategory?.length > 0 || searchparam?.price?.length > 0
      || searchparam?.gender?.length > 0) {
      setFilterName({
        category: searchparam?.category?.length > 0 ? searchparam.category : [],
        subcategory: searchparam?.subcategory?.length > 0 ? searchparam.subcategory : [],
        brand: searchparam?.brand?.length > 0 ? searchparam.brand : [],
        gender: searchparam?.gender?.length > 0 ? searchparam.gender : [],
        price: pricename
      })
    }
    setFilters({
      category: categoryids,
      subcategory: subcategoryIds,
      brand: brandIds,
      price: priceid,
      gender: genderIds
    })

    setBrandLoaing(false);
    setCategoryLoaing(false);
    setSubcategoryLoaing(false);


  }, [categoryInfo, subcategoryInfo, brandInfo]);


  useEffect(() => {
    // const {category, subcategory,brand, price ,gender} = filterName;
    // if(category.length > 0 || subcategory.length > 0 || brand.length > 0 
    //   || price !== "" || gender.length > 0) {
        setSearchParams({
      category: filterName.category.join("%"),
      brand: filterName.brand.join("%"),
      subcategory: filterName.subcategory.join("%"),
      price: filterName.price,
      gender: filterName.gender.join("%")
    })
      // }
    
  }, [filterName])


  useEffect(() => {
    
    if (filters.category.length > 0 || filters.brand.length > 0 ||
      filters.gender.length > 0 || filters.subcategory.length > 0 ||
      filters.price !== "") {

      const info = {
        page: currentpage,
        limit: 12,
        filteredItems: filters
      }
      dispatch(getFilteredProducts(info))
    } else if (sortedvalue) {
      dispatch(getProductsByPrice({ value: sortedvalue, page: currentpage, limit: 12 }))
    } else {
      dispatch(getProducts({ page: currentpage, limit: 12 }))
    }
  }, [filters, currentpage])


  useMemo(() => {
    if (filteredProduct?.status === 200) {
      setProductList(filteredProduct?.data?.products)
      setTotalPages(filteredProduct?.data?.totalpages)
    } else if (filteredProduct?.status === 204) {
      setProductError({ status: 404, error: "No products matched for you filter" })
    }
  }, [filteredProduct])


  useMemo(() => {
    if (product) {

      if (product?.status === 200) {
        setProductList(product?.data?.products)
        setTotalPages(product?.data?.totalpages)
      } else if (product?.status === 204) {
        setProductError({ status: 204, error: "No products created in the database" })
      }
    }
  }, [product])


  useMemo(() => {

    if (sortedProduct) {
      if (sortedProduct?.status === 200) {
        setProductList(sortedProduct?.data?.products)
        setTotalPages(sortedProduct?.data?.totalpages)
      } else if (sortedProduct?.status === 204) {
        setProductError({ status: 204, error: "No products created in the database" })
      }

    }


  }, [sortedProduct])


  useMemo(() => {
    if (user) {
      dispatch(getCartCount(user._id))
    }

  }, [cartInfo]);


  useEffect(() => {

    if (categoryError?.response?.status === 500) {
      setCategoryError(categoryError?.response?.data || 'Oops!, Something went wrong. Please try again later')
    }


    if (subcategoryError?.response?.status === 500) {
      setSubcategoryError(subcategoryError?.response?.data ||
        'Oops!, Something went wrong. Please try again later')
    }

    if (brandError?.response?.status === 500) {
      dispalyError(brandError?.response?.data ||
        'Oops!, Something went wrong. Please try again later')
    }

    if (producterr?.request?.status === 500) {
      setProductError({ status: 500, error: producterr?.response?.data || 'Oops!, Something went wrong. Please try again later' })
    }

  }, [categoryError, subcategoryError, brandError, producterr])

  useEffect(() => {

    if (cartError?.response?.status == 404) {
      setError(cartError.response.data);
      clearError();
      dispatch(clearCarterr());
    }

  }, [cartError])



  const addTocart = (e, productid, proprice) => {
    e.preventDefault();
    if (user) {
      const info = {
        proid: productid,
        price: proprice,
        userid: user._id
      }
      dispatch(addToCart(info))
    } else {
      Navigate('/login')
    }

  }


  const handleProduct = (e) => {

    const { value } = e.target;

    if (!value) return false;
    if (value === "-1" || value === "1") {
      setSortedValue(value)
      dispatch(getProductsByPrice({ value: value, page: 1, limit: 12 }));
    } else if (value === "3") {
      dispatch(getProducts({ page: 1, limit: 12 }))

    }
  }


  const handleCheckboxChange = (e, checkboxindex, filterstatekey,
    filteritem, filterState, setfilterState, filtereditemname) => {
    const { checked } = e.target;
    const updateStatus = [...filterState];
    setSortedValue(null)
    updateStatus[checkboxindex].checked = !updateStatus[checkboxindex].checked;
    setfilterState(updateStatus);
    if (checked) {
      setFilterName(prevState => ({
        ...prevState,
        [filterstatekey]: [...prevState[filterstatekey],
        filteritem[filtereditemname]]
      }))
      setFilters(prevState => ({
        ...prevState,
        [filterstatekey]: [...prevState[filterstatekey], filteritem._id]
      }))
      setCurrentPage(1)
    } else {
     
      setFilterName(prevState => ({
        ...prevState,
        [filterstatekey]: prevState[filterstatekey].filter(value => value !== filteritem[filtereditemname])
          
      }))
      setFilters(prevState => ({
        ...prevState,
        [filterstatekey]: prevState[filterstatekey].filter(value => value !== filteritem._id)
          
      }))

      setCurrentPage(1)
    }
  };

  const handleClearFilter = () => {

    const updatedBrands = brands.map(brand => ({ ...brand, checked: false }));
    const updateCategory = categories.map(category => ({ ...category, checked: false }))
    const updateSubcategory = subcategories.map(subcategory => ({ ...subcategory, checked: false }))
    const updateGender = filterGender.map(gender => ({ ...gender, checked: false }))
    setBrands(updatedBrands)
    setCategories(updateCategory);
    setSubCategories(updateSubcategory);
    setFilterGender(updateGender)

    setFilterName({
      category: [],
      subcategory: [],
      brand: [],
      price: "",
      gender: []
    })
    setFilters({
      category: [],
      subcategory: [],
      brand: [],
      price: "",
      gender: []
    })

    setCurrentPage(1)
  }


  const handleSelectPrice = (e, item) => {
    const { value } = e.target;
    setSortedValue(null)
    setFilterName(prevState => ({
      ...prevState,
      price: item.price
    }))
    setFilters(prevState => ({
      ...prevState,
      price: value
    }))
    setCurrentPage(1)
  }

  if (loadingBrand || loadingCategory || loadingSubategory || brandloading || categoryloading
    || subcategoryloading) {
    return (
      <div className='m-auto text-center pt-20'>
        <span className='text-green-700'><Spinner animation="border" variant="success" /> Loading...</span>

      </div>
    )
  } else if (product_error?.status === 500 && product_error?.status === 204) {
    return (
      <div className='m-auto text-center pt-20'>
        <PageNotFound data={product_error.error} />
      </div>)
  } else {
    return (
      <div className='mt-4 ms-2 mb-8' style={{ minWidth: '320px' }}>
        <div>
          <div className='displayhomepage'>
            {error && <p className='text-danger m-auto'>{error}</p>}

            {brands.length > 0 &&
              categories.length > 0 && subcategories.length > 0 && <div className='displayPrdouctandfilter'>

                <FilterProudcts handleFilterPrice={handleSelectPrice} clearFilter={handleClearFilter}
                  handlechekcbox={handleCheckboxChange}
                  category_error={category_error} brand_error={brand_error}
                  subcategory_error={subcategory_error}
                  brands={brands} setBrands={setBrands}
                  categories={categories} setCategories={setCategories} subcategories={subcategories}
                  setSubCategories={setSubCategories} filterGender={filterGender}
                  setFilterGender={setFilterGender} filterPrice={filterPrice} />
              </div>}
            {product_error?.status === 404 ? <div className='m-auto text-center pt-20'>
              <span className='text-red-700'>{product_error?.error}</span>

            </div> :
              <div className='displayproductshomediv'>
                <Row className='justify-content-end'>

                  <Col md={4} className='float-right me-8'>
                    <Form.Select aria-label="Default select example" onChange={handleProduct}>
                      <option>Sort</option>
                      <option value="1">Price low to high</option>
                      <option value="-1">Price high to low</option>
                      <option value="3">What's new</option>
                    </Form.Select>
                  </Col>
                </Row>
                {loadingProduct ?
                  <div className='m-auto text-center pt-20'>
                    <span className='text-green-700'><Spinner animation="border" variant="success" /> Loading...</span>

                  </div> : productslist && productslist.length > 0 && productslist?.map((product, index) => {

                    return <div key={index} style={{ maxWidth: "219px" }} className='displayproduct ms-2'>

                      <Row className='displayproductshomeimage'>

                        <Link to={`/products/${product._id}`}><img src={`http://localhost:5000/images/${product?.filename}`}
                          className='productImageHome' alt='product_image' /></Link>
                      </Row>

                      <Row>
                        <Col className='' style={{ maxHeight: '20px', overflow: 'hidden' }}>
                          {product?.product_name ? product.product_name : product?.description}</Col>
                      </Row>
                      <Row className='flex pt-2 m-auto' style={{ maxWidth: "219px" }}>
                        <Col className='pt-1 font-medium'><i className="fa-solid fa-indian-rupee-sign"></i> {product.price}</Col>
                        <Button variant='primary' onClick={(e) => addTocart(e, product._id, product.price)}>Add to Cart</Button >
                      </Row>
                    </div>
                  })}

              </div>}

          </div>
          <ProductPagination getSearchParams={retieveSearchParams} currentpage={currentpage}
              setCurrentPage={setCurrentPage} totalPages={totalPages} setTotalPages={setTotalPages}
              filters={filters} />

        </div>
      </div>
    )
  }
}

export default GetPosts
