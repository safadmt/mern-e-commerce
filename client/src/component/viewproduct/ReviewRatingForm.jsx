import React, { useEffect, useState } from 'react'
import ProductStarRating from './ProductStarRating'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addReview, clearRating, clearReview, getProductAverageRating } from '../../reduxtoolkit/productReducer';

function ReviewRatingForm({ productId }) {
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(state => state.userInfo.user);
  const reviewsuccess = useSelector(state => state.productInfo.review);
  const ratingsuccess = useSelector(state => state.productInfo.rating);

  const [review, setReview] = useState("");

  const [successReview, setSuccessReview] = useState(null);
  const [successRating, setSuccessRating] = useState(null);
  const [error, setError] = useState(null);

  const displayMessage = (data, setState) => {
    setState(data);
    setTimeout(() => {
      setState(null)
    }, 5000);
  }

  useEffect(() => {
    if (ratingsuccess) {
      displayMessage("Successfully submitted", setSuccessRating)
      dispatch(getProductAverageRating(productId))
      
    }
    return ()=> {
      
      setSuccessRating(null)
      dispatch(clearRating())
    }
  }, [ratingsuccess])

  useEffect(() => {
    if (reviewsuccess) {
      displayMessage("Successfully submitted", setSuccessReview)
    }

    return ()=> {
      setSuccessReview(null)
      dispatch(clearReview())
    }
  }, [reviewsuccess])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return Navigate('/login')
   console.log(review)
    if (review === "") return displayMessage("Please review something", setError)
      
    
    const details = {
      productId: productId,
      userid: user._id,
      review
    }
    dispatch(addReview(details))
  }
  return (
    <div className='md:w-12/12'>
      <div >
        {successRating && <div className='text-right text-emerald-600'>{ successRating}</div>}
        <div className='flex gap-x-4'>
          <div><span>Your rating </span></div>  <ProductStarRating productId={productId} />
        </div>

      </div>

      <div className='mt-4'>
        {successReview &&<div className='text-green-400'>{ successReview}</div>}
        <form className='pb-4' onSubmit={handleSubmit}>
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Your review
            </label>
            <textarea value={review} onChange={(e)=> setReview(e.target.value)} rows={5} 
            className="shadow appearance-none border
                  border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 
                  leading-tight focus:outline-none focus:shadow-outline"/>
            {error && <div className='text-yellow-400'>{error}</div>}
          </div>
          <button type='submit'
            className='border mt-2 border-white-2 px-4 py-2 rounded hover:bg-emerald-400'>Submit</button>
        </form>
      </div>
    </div >
  )
}

export default ReviewRatingForm