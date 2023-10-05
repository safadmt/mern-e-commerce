import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserCart } from '../../reduxtoolkit/cartReducer';

function ReviewDeliveryItems({userid,orderDetails2,setOrderDetails2}) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userInfo.user)
  const productslist = useSelector(state => state.cartInfo.cartInfo)
  useEffect(() => {
    if (user) {
      console.log("hello")
      dispatch(getUserCart(userid));
    }
  }, [])
  
  if(productslist?.data?.response?.length > 0) {return (
    <div>
      <div className='flex flex-row gap-4 mb-2 ms-10'>
        
        <div className='text-2xl font-medium'>Review Delivery Items</div>
      </div>
      <div className='ms-10'>
        <div className='border-2 border-inherit grid grid-cols-1'>
          {productslist?.data?.response?.map((obj, index) => {
            return <div key={index}>
              <div className='flex flex-row gap-28 border-bottom p-6'>
                <div className=''>

                  <img src={`http://localhost:5000/images/${obj.newproducts.filename}`} style={{ height: "112px", width: "112px" }}></img>
                </div>
                <div>
                  <p>{obj.newproducts.description}</p>
                  <p>{obj.newproducts.category}</p>
                  <p>{obj.newproducts.brand}</p>
                  <div className='flex flex-row gap-2'>
                    <div><i class="fa-solid fa-indian-rupee-sign"></i></div><div><span className='font-medium'>  {obj.newproducts.price}</span></div></div>
                    <div>Quantity : {obj.products.quantity}</div>
                </div>
              </div>

            </div>
          })}
        </div>
      </div>
    </div>
  )}
}

export default ReviewDeliveryItems