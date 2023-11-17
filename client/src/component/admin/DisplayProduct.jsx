import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { clearproduct, getOneproduct } from "../../reduxtoolkit/productReducer";
import ReviewsList from "../viewproduct/ReviewsList";
import { StarRating } from "../globalcomponent";
  
const DisplayProduct = () => {
  const dispatch = useDispatch();
  const productloading = useSelector(state=> state.productInfo.loading);
  const product = useSelector(state => state.productInfo.product);
  
  
  const { productid } = useParams();
  useEffect(() => {
    dispatch(getOneproduct(productid))
    return () => {
      dispatch(clearproduct())
    }
  }, [])

  

  if(productloading){
    return (
      <div className='m-auto text-center pt-20'>
        <span className='text-green-700'><Spinner animation="border" variant="success" /> Loading...</span>

      </div>
    )
  }else if (product) {

  return (
    <div id="viewproduct" className="pb-4">
        <div className="sm:flex ml-8 md:grid grid-cols-2 mt-4 gap-20">
          <div><img src={`http://localhost:5000/images/${product?.filename}`} style={{ width: "390px" }} /></div>
          <div className="space-y-2">
            <p className="font-medium">{product?.brandInfo?.brand_name}</p>
            <p>{product?.product_name ? product.product_name : product?.description} For {product?.gender}</p>
            {product.rating && <div><StarRating rating={product.rating}/></div>}
            <p className="font-medium"><i class="fa-solid fa-indian-rupee-sign"></i> : {product?.price}</p>
          </div>
        </div>
        <div className="border-t-4 m-4">
          
          <h5 className="ms-6 mt-2">Reviews and Ratings</h5>
          
          <div className="scrollreviewlist md:ms-4 md:w-8/12 px-8 pt-4 border h-96 border-4 mt-2 rounded mr-2 md:overflow-y-scroll">
            <ReviewsList productId={productid}/>
          </div>
        </div>

      </div>
  )
  }
}

export default DisplayProduct