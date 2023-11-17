import { Button, Form, Row, Col } from "react-bootstrap";
import React from 'react'
import '../App.css'
import '../css/Starrating.css'
import {AiFillStar} from 'react-icons/ai'

export function DisplaySelectForm({error, currentvalue,optlabel,index, loopitem,formlabel,mapobjvalue, formselectonchange, selectedvalue, name }) {
  if(error) {
   return (
    <>
        <Form.Label>{formlabel ? formlabel : null}</Form.Label>
        <Form.Select>
          <option>{error}</option>
        </Form.Select>
    </>
   )
  }else {
    return (
        <>
            <Form.Label className='font-medium mt-2'>{formlabel ? formlabel : null}</Form.Label>
            <Form.Select  value={selectedvalue ? selectedvalue : ""} name={name ? name : ""} aria-label="Default select example"
                onChange={formselectonchange}>
                <option value={currentvalue ? currentvalue : ""}>{optlabel ? optlabel:"Select"}</option>
                {loopitem?.map((category, index) => {
                    return <option key={index} value={category._id}>{category[mapobjvalue]}</option>


                })}</Form.Select>
        </>
    )
  }
}

export function DisplayInfo({ label,keyindex, value, value2, onEdit,isTrue, onDelete,onPermanantDelete }) {
  console.log(keyindex)
    return (
        <Row className='mb-4 align-items-center mt-4 displayInfo' key={keyindex? keyindex : null}>
            <Col md={4} sm={4}>
                <p className='font-medium leading-3 text-secondary'>{label}</p>
                <p className='font-medium leading-3'>{value}</p>
            </Col>
            {value2 && <Col md={4} sm={4}>
                <p className='font-medium leading-3 text-secondary'>{value2.label}</p>
                <p className='font-medium leading-3'>{value2.category}</p>
            </Col>}
            <Col>
                <div className='d-flex'>

                    <Button variant={"outline-primary"} className='editaccountbutton ' 
                    onClick={onEdit}>Edit</Button>
                    <Button variant='outline-danger' className='editaccountbutton ms-2' 
                    onClick={onDelete}>Delete</Button>
                    { isTrue && <Button variant='outline-danger' className='editaccountbutton ms-2' 
                    onClick={onPermanantDelete}>Delete Permenantly</Button>}
                </div>
            </Col>
        </Row>
    );
}

export function DisplayInput({ classname, type, value, onchange,as,rows, label, name }) {
    return (
        <Form.Group className={classname ? classname : null}>
            <Form.Label className='font-medium'>{label}</Form.Label>
            <Form.Control as={as} type={type} name={name ? name : ""} value={value ? value : ""}
                onChange={onchange} rows={rows ? rows:null}/>
        </Form.Group>)
}


export function DisplayCheckbox({ type, label, value, checked, onchange, className, index,name }) {
    return (
        
            <Form.Check key={index? index:null} 
            className={className? className : null} type={type ? type : "checkbox"} 
            label={label ? label : null} value={value ? value : null}
                checked={checked}
                onChange={onchange} name={name? name : null} />
        
    )
}

// Home page pagination
export function ProductPagination({getSearchParams,totalPages, setTotalPages,
   currentpage, setCurrentPage, filters }) {
  
    const handlePages = (e, value)=> {
        setCurrentPage(currentpage + value)
    }
    
    const goToPage = (page) => {

        if (page >= 1 && page <= totalPages) {
          setCurrentPage(page);
        }
      };
    const renderPaginationLinks = () => {
        const pageLinks = [];
        const maxPageLinksToShow = 10; // Adjust the number of page links to show
    
        for (let i = 1; i <= totalPages; i++) {
          if (i === currentpage) {
            pageLinks.push(
              <span key={i} 
              className={currentpage === i ? 'currentpageproductpagination':"productpaginationbutton"}>
                {i}
              </span>
            );
          } else if (
            i >= currentpage - Math.floor(maxPageLinksToShow / 2) &&
            i <= currentpage + Math.floor(maxPageLinksToShow / 2)
          ) {
            
            pageLinks.push(
              <span
                key={i}
                onClick={() => goToPage(i)}
                className={currentpage === i ? 'currentpageproductpagination':"productpaginationbutton"}
              >
                {i}
              </span>
            );
          }
        }
    
        return pageLinks;
      };
  return (
    <div className="text-center">
        <button className="productpaginationbutton" onClick={(e)=> handlePages(e,-1)} disabled={currentpage === 1}>Prev page</button>
        
        {renderPaginationLinks()}
        <button disabled={currentpage === totalPages} onClick={(e)=> handlePages(e,1)} className="productpaginationbutton">next page</button>
       
    </div>
  )
}

export function PageNotFound ({data , className}) {
  return (
    <div>
        <div className='pb-20'>
            <div className='text-center m-auto my-auto'>
                <p className={className ? className : null}>{data}</p>
            </div>
        </div>
    </div>
  )
}

export const StarRating = ({rating})=> {
 
  return <div className="bg-emerald-500 px-2 rounded space-x-1 flex" style={{maxWidth:'4rem'}}>
    <div><span className="font-medium">{rating}</span></div>
    <div><i class="fa-solid fa-star"></i></div></div>
}

