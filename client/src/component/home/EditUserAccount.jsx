import React, { useEffect, useMemo, useState } from 'react'
import {Row, Col, Container, Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom'
import { clearUsererr, editUser, getUser, userLogout } from '../../reduxtoolkit/userReducer';
import '../../App.css';
function EditUserAccount() {
    const {userid} = useParams();
    const dispatch = useDispatch();

    const user = useSelector(state=> state.userInfo.user);
    const usererr = useSelector(state=> state.userInfo.error);
   
    const [inputLabel, setInputLabel] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [value, setValue] = useState()
    const [error, setError] = useState(null);
    const [successmsg, setSuccessmsg] = useState(null);
    const [passworddiv, setPassworddiv] = useState([{label: 'Current Password',name:"current_password"},
    {label:'New Password', name: "new_password"},
    {label: "Confirm New password",name: "confirm_password"} ])
    const [password,setPassword] = useState({current_password: '', new_password: '', confirm_password: ''})
    const displayError = (error)=> {
        setError(error)
        setTimeout(() => {
            setError(null)
        }, 4000);
    }
    
    useEffect(()=> {
        if(userid) {
            dispatch(getUser(userid))
        }
        
    },[])

    useMemo(()=> {
        if(user) {
            setSuccessmsg("Updated successfully")
            setTimeout(() => {
                setSuccessmsg(null)
            }, 4000);
        }
    },[user])
    useEffect(()=> {
        if(usererr) {
            console.log(usererr)
            if(usererr.request?.status === 403) {
                dispatch(userLogout())
            }else if(usererr.status === 401) {
                displayError(usererr.data)
                dispatch(clearUsererr())
            }
        }
    }, [usererr])
    const showEditForm = (name, userinfo) => {
        
            setValue(userinfo)
            setInputLabel(name)
            setShowForm(true)
    }
    const handleChangePassword = (e)=> {
        const {name, value} = e.target;
        setPassword({...password,[name]:value})
    }
    
    const handleSubmit = (e)=> {
        e.preventDefault()
        if(!user) return dispatch(userLogout());
        console.log("value", value)
        console.log(password)
        let info;
        const {current_password, new_password, confirm_password} = password
        if(inputLabel === "Name") {
            if(!value) {
                displayError("Please fill up the field")
            }else if(value.length < 4) {
                displayError("Minimum length less than 4 charactors!")
            }else{
                dispatch(editUser({userid: userid,info: {name:value}}))
            }
            
        }else if(inputLabel === "Email" ){
            if(!value){
                displayError("Please fill up the field")
            }else if(value.length < 4) {
                displayError("Minimum length less than 4 charactors!")
            }else {
                dispatch(editUser({userid:userid,info:{email: value}}))
            }
        }else if(inputLabel === "password"){
            if(!current_password  || !new_password || !confirm_password) {
                displayError("Please fill up all the field")
            }else if(current_password.length < 4 || new_password.length < 4 || confirm_password.length < 4) {
                displayError("Passworld length must be less than 4")
            }else if(new_password !== confirm_password) {
                displayError("Confirm password do not match to the new password")
            }else {
                info = {
                    userid: userid,
                    info: {
                        current_password,
                        new_password,
                        confirm_password
                    }
                    
                }
                dispatch(editUser(info))
            }
        }
    }
    
if(user) {

  return (
    <Container>
        <Row className='justify-content-md-center mt-4'>
            { inputLabel && showForm && <Col md={4} className='editaccountform'>
                <Form onSubmit={handleSubmit}>
                {successmsg && <p className='text-success'>{successmsg}</p>}
                {error && <p className='text-warning'>{error}</p>}
                <Form.Label className='font-medium text-white'>{inputLabel}</Form.Label>
                <Form.Control name={inputLabel.toLowerCase()} value={value} 
                onChange={(e)=> {setValue(e.target.value)}}/>
                <Button variant='info' className='mt-2 inline' type='submit'>Submit</Button>
                <Button variant='danger' className='mt-2 inline ms-2' type='submit' 
                onClick={()=> setInputLabel(null)}>Cancel</Button>
                </Form> 
            </Col>}
            {inputLabel === "password" && <Col md={4} className='editaccountform'>
            <Form onSubmit={handleSubmit}>
                {successmsg && <p className='text-success'>{successmsg}</p>}
                {error && <p className='text-warning'>{error}</p>}
                {passworddiv.map((item,index)=> {
                   return <Form.Group key={index}>
                <Form.Label className='font-medium text-white'>{item.label}</Form.Label>
                <Form.Control name={item.name} onChange={handleChangePassword}/>
                </Form.Group>
                })}
                <Button variant='info' className='mt-2 inline' type='submit'>Submit</Button>
                <Button variant='danger' className='mt-2 inline ms-2' type='submit' 
                onClick={()=> setInputLabel(null)}>Cancel</Button>
                </Form>
            </Col>}

            <Col md={6} sm={12} >
            
                <DisplayInfo label={"Name"} value={user.name} onEdit={()=> showEditForm("Name", user.name)}/>
                <DisplayInfo label={"Email"} value={user.email} onEdit={()=>showEditForm("Email", user.email)}/>
                <DisplayInfo label={"Password"} value={"********"} onEdit={()=> setInputLabel("password")}/>
            
            </Col>
        </Row>
    </Container>
  )
}
}

function DisplayInfo({ label, value, onEdit }) {
    return (
        <Row className='mb-4'>
      <Col md={8} sm={4}>
        <p className='font-medium leading-3'>{label} :</p>
        <p className='font-medium leading-3'>{value}</p>
      </Col>
      <Col>
      <Col md={4} sm={4}><button 
            className='editaccountbutton' onClick={onEdit}>Edit</button></Col>
      </Col>
      </Row>
    );
  }
export {DisplayInfo}
export default EditUserAccount