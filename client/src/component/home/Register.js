import {     useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../../reduxtoolkit/userReducer';
import { Link, Navigate } from 'react-router-dom';


const Register = ()=> {
    const user= useSelector(state=> state.userInfo.user);
    const err= useSelector(state=> state.userInfo.error);
    const store= useSelector(state=> state.userInfo);
    const userRef = useRef({name: "",email: "", password: ""});
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const handleChange = (e)=> {
        const {name, value} = e.target;
        userRef.current[name] = value;
    }

    const handleSubmit = (e)=> {
    
    e.preventDefault();
    const {email, password, name} = userRef.current;
    if(!email || !password || !name)
    return setError("Required all field")
    const newform = new FormData();
    newform.append("name", name)
    newform.append('email', email);
    newform.append('password', password);
    dispatch(registerUser(newform));
}
useEffect(()=> {
    console.log(store)
    if(err && err?.status === 401) {
        setError(err.data)
    }
},[err])
{user && localStorage.setItem('user',JSON.stringify({_id:user._id, email:user.email, name: user.name}))}
    if(user) {
        return <Navigate to={'/'}/>
    }else {
    return (
        <div className=''>
      <div className='p-5 md:w-6/12 sm:w-12 m-auto mt-20'>
        <div className="font-bold text-xl text-center">Register</div>
        <div className='w-full px-4 py-1 text-red-700 text-center'>{error}</div>
        <form onSubmit={handleSubmit}> 
        <label>Name</label>
            <input type='text' name='name'
             className='block px-4 py-1 w-full border border-slate-300 mb-2'
             onChange={handleChange}/>
            <label>Email</label>
            <input type='text' name='email'
             className='block px-4 py-1 w-full border border-slate-300 mb-2'
             onChange={handleChange}/>

            <label>Password</label>
            <input type='password' name='password' 
            className='block px-4 py-1 w-full border border-slate-300 mb-2'
            onChange={handleChange}/>
            <input type='submit' className='block px-4 py-1 w-full bg-blue-600 text-white mb-2'/>
        </form>
        <span className='text-sm mt-0'>Already have an account ? <Link to={`/login`} style={{textDecoration: "none"}}>Login</Link></span>
      </div>
    </div>
    )}
}

export default Register;