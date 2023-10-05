import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter} from 'react-router-dom';
import MainPage from './pages/MainPage';

import {useDispatch, useSelector} from 'react-redux';

import Errorpage from './pages/Errorpage';
import { useEffect } from 'react';
import { auth } from './reduxtoolkit/userReducer';
function App() {
  const dispatch = useDispatch();
  let usererr = useSelector(state=> state.userInfo.error)

  useEffect(()=> {
    dispatch(auth())
  },[])
  if(usererr?.message === "Network Error") {
  return (
    <div>
        {usererr?.message && usererr.message === "Network Error" && <Errorpage/>}
      </div>
  )}else{
    return (
      <div className="App">

        <BrowserRouter>
        
        <MainPage/>
         </BrowserRouter>
      
    </div>
    )
  }
}

export default App;
