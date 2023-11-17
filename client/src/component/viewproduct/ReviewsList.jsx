import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getProductReviews } from '../../reduxtoolkit/productReducer';
import { StarRating } from '../globalcomponent';
import { Spinner } from 'react-bootstrap';

function ReviewsList({productId}) {
  const dispatch = useDispatch();

  const user = useSelector(state => state.userInfo.user);
  const loadingreview = useSelector(state=> state.productInfo.loadingreview);
  const reviewratings = useSelector(state => state.productInfo.reviews);
  const review = useSelector(state=> state.productInfo.review);
  const rating = useSelector(state=> state.productInfo.rating);
  useEffect(()=> {
    console.log("Hello")
    dispatch(getProductReviews(productId))
  },[review,rating])

  if(loadingreview) {
    return (<div className='m-auto text-center pt-20'>
        <span className='text-green-700'><Spinner animation="border" variant="success" /> Loading...</span>

      </div>
    )
  }else if(reviewratings?.length > 0 ) {
    return (
    <div>
        {reviewratings.map((item,index)=> {
       return <div key={index} className='my-2 py-2'>
            <span>{item?.user_name &&  item?.user_name}</span>
            <div><StarRating rating={item.rating}/> <div>Time : {new Date(item.createdAt).toLocaleString()}</div></div>
            <p>{item.review}</p>
        </div>})}
    </div>
  )
    }
}

export default ReviewsList