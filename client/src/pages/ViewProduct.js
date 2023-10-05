import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom";
import { clearproduct, getOneproduct, viewProduct } from "../reduxtoolkit/productReducer";
import { Button } from "react-bootstrap";
import { addToCart } from "../reduxtoolkit/cartReducer";
const ViewProduct = ()=> {
    const dispatch = useDispatch();
    const Navigate = useNavigate();
    const product = useSelector(state=> state.productInfo.product);
    const user = useSelector(state=> state.userInfo.user);
    const {id} = useParams();
    useEffect(()=> {
        dispatch(getOneproduct(id))
        return ()=> {
          dispatch(clearproduct())
        }
    },[])
    
    const addTocart = (e,productid,proprice)=> {
        e.preventDefault();
        if(user) {
          const info = {
          proid: productid,
          price: proprice,
          userid: user._id
          }
          console.log(info)
          dispatch(addToCart(info))
        }else{
          Navigate('/login')
        }
        
      }

    if(product){return (
        <div className="ml-8 grid grid-cols-2 gap-20">
            <div><img src={`http://localhost:5000/images/${product?.filename}`} style={{width:"500px"}}/></div>
            <div className="space-y-2">
                <p className="font-medium">{product?.brandInfo?.brand_name}</p>
                <p>{product?.product_name ? product.product_name : product?.description } For {product?.gender}</p>
                <p className="font-medium"><i class="fa-solid fa-indian-rupee-sign"></i> : {product?.price}</p>
                <Button variant="primary" onClick={(e)=> addTocart(e,product?._id,product?.price)}>Add to Cart</Button>
            </div>
        </div>
    )}
}

export default ViewProduct;