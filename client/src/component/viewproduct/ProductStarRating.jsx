import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addRating } from '../../reduxtoolkit/productReducer';

const ProductStarRating = ({productId}) => {

  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);;
  const user = useSelector(state=> state.userInfo.user);
  const successMsg = useSelector(state=> state.productInfo.rating)
  
  const handleStarClick = (e,star) => {
    e.preventDefault()
    console.log(user)
    if(!user) return Navigate('/login')
    setRating(star)
    console.log(star)
    const details = {
      productId,
      userid : user._id,
      rating:star
      
    }
    dispatch(addRating(details))
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            color: star <= rating ? 'yellow' : 'gray'
          }}
          onClick={(e) => handleStarClick(e,star)}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
};

export default ProductStarRating;