import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Form, useNavigate, useParams } from "react-router-dom";
import { clearproduct, getOneproduct, viewProduct } from "../reduxtoolkit/productReducer";
import { Button, Spinner } from "react-bootstrap";
import { addToCart } from "../reduxtoolkit/cartReducer";
import ReviewRatingForm from "../component/viewproduct/ReviewRatingForm";
import ReviewsList from "../component/viewproduct/ReviewsList";
import { StarRating } from "../component/globalcomponent";
  
const ViewProduct = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const productloading = useSelector(state=> state.productInfo.loading);
  const product = useSelector(state => state.productInfo.product);
  
  const user = useSelector(state => state.userInfo.user);
  const { id } = useParams();
  useEffect(() => {
    dispatch(getOneproduct(id))
    return () => {
      dispatch(clearproduct())
    }
  }, [])

  const addTocart = (e, productid, proprice) => {
    e.preventDefault();
    if (user) {
      const info = {
        proid: productid,
        price: proprice,
        userid: user._id
      }
      console.log(info)
      dispatch(addToCart(info))
    } else {
      Navigate('/login')
    }

  }

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
            <Button variant="primary" onClick={(e) => addTocart(e, product?._id, product?.price)}>Add to Cart</Button>
          </div>
        </div>
        <div className="reviewsandratings border-t-4 m-4 md:flex">
          <div className="sm:w-12/12 md:w-4/12">
          <h5 className="ms-6 mt-2">Reviews and Ratings</h5>
          <ReviewRatingForm productId={id}/>
          </div>
          <div className="scrollreviewlist md:ms-4 md:w-8/12 px-8 pt-4 border h-96 border-4 mt-2 rounded mr-2 md:overflow-y-scroll">
            <ReviewsList productId={id}/>
          </div>
        </div>

      </div>
    )
  }
}

export default ViewProduct;