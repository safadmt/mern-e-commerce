import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUsererr, loginUser } from "../../reduxtoolkit/userReducer";
import { Link, Navigate } from "react-router-dom";
import { clearCarterr } from "../../reduxtoolkit/cartReducer";


function Login() {
  const user = useSelector(state => state.userInfo.user)
  const err = useSelector(state => state.userInfo.error)
  const dispatch = useDispatch();
  const userRef = useRef({ email: "", password: "" })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    dispatch(clearCarterr());
    dispatch(clearUsererr());
    return () => {
      dispatch(clearCarterr());
      dispatch(clearUsererr());
    }
  }, [])
  const handleChange = (e) => {
    const { name, value } = e.target;
    userRef.current[name] = value;
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const { email, password } = userRef.current;
    console.log(email, password)
    if (!email || !password)
      return setError("Required all field")

    const formdata = new FormData();

    formdata.append("email", email);

    formdata.append("password", password);

    dispatch(loginUser(formdata))


  }

  useEffect(() => {
    if (err && err.response?.status === 401) {
      setError(err.response?.data)
    }
  }, [err])
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify({ _id: user._id, email: user.email, name: user.name }))
    }
  }, [user])

  if (user) { return <Navigate to={'/'} /> }
  else {
    return (
      <div className=''>
        <div className='p-5 md:w-6/12 sm:w-12 m-auto mt-20 '>
          <div className="font-bold  text-xl text-center">Login</div>
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
          <span className='text-sm'>Don't have an account ? <Link to={`/register`} style={{ textDecoration: "none" }}>Register</Link></span>
        </div>
      </div>
    )
  }
}

export default Login;

