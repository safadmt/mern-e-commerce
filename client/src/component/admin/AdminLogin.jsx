import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import { loginAdmin } from "../../reduxtoolkit/adminReducer";


function AdminLogin() {
  const Navigate = useNavigate(); 
  const admin = useSelector(state => state.adminInfo.admin)
  const err = useSelector(state => state.adminInfo.error)
  const dispatch = useDispatch();
  const adminRef = useRef({ email: "", password: "" })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    adminRef.current[name] = value;
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const { email, password } = adminRef.current;
    console.log(email, password)
    if (!email || !password)
      return setError("Required all field")

    const formdata = new FormData();

    formdata.append("email", email);

    formdata.append("password", password);

    dispatch(loginAdmin(formdata))


  }

  useEffect(() => {
    console.log(err)
    if (err && err.response?.status === 401) {
      setError(err.response?.data)
    }
  }, [err])
  useEffect(() => {
    console.log(admin)
    if (admin) {
        console.log(admin)
      localStorage.setItem('admin', JSON.stringify({ _id: admin._id, email: admin.email }))
      Navigate('/admin')
    }
  }, [admin])

  
  
    return (
      <div className=''>
        <div className='p-5 md:w-6/12 sm:w-12 m-auto mt-20 '>                 
        <div className="text-left"><p className="bg-emerald-300 py-2 px-4 w-40 hover:cursor-pointer" onClick={()=> Navigate('/')}>Back to home</p></div>
          <div className="font-bold  text-xl text-center">Admin Login</div>
          <div className={error ? 'w-full px-4 py-1 text-red-700 text-center' :
           'w-full px-4 py-1 text-green-700 text-center'}>{error ? error : success}</div>
          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input type='text' name='email'
              className='block px-4 py-1 w-full border border-slate-300 mb-2'
              onChange={handleChange} />

            <label>Password</label>
            <input type='password' name='password'
              className='block px-4 py-1 w-full border border-slate-300 mb-2'
              onChange={handleChange} />
            <input type='submit' className='block px-4 py-1 w-full bg-blue-600 text-white mb-2' />
          </form>
         
        </div>
      </div>
    )
 
}

export default AdminLogin;

