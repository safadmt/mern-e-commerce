import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../App.css'

function Sidebar() {
    const [path] = useState([{to:'/admin/orders', name:"Orders"},
    {to:'/admin/products', name:'Products'}, {to:'/admin/users', name:'Users'}])
  return (
    <div className='sidebar'>
        {path.map((path, index)=> {
             return <div key={index} className='my-2'  variant='outline-primary'><Link id='buttonadminsidebar' className='px-4 py-2 text-lg' to={path.to}>{path.name}</Link></div>
        })}
    </div>
  )
}

export default Sidebar
