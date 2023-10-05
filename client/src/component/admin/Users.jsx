import React, { useEffect } from 'react'
import { Card, Col, Container,Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '../../reduxtoolkit/userReducer';

function Users() {
  const dispatch = useDispatch();
  const users = useSelector(state=> state.userInfo.users);
  const error = useSelector(state=> state.userInfo.users);

  useEffect(()=> {
    console.log("users onClick response")
    dispatch(getAllUsers());
  }, [])

  if(users.length > 0) {
  return (
    <div>
      <div>
        <Container>
         {users.map((user,index)=> {

          return <Card key={index} className='mb-2 ms-4 mt-2' style={{maxWidth:"500px"}}>
          <Row>
            <Col md={2}>
              <p className='text-center'>{index + 1}</p>
            </Col>
            <Col md={10}>
              <p>Email : {user.email}</p>
              <p>Name : {user.name}</p>
            </Col>
          </Row>
          </Card>})}
        </Container>
      </div>
    </div>
  )}
}

export default Users
