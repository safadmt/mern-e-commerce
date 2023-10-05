import React, { useState } from 'react'


import { DisplayCheckbox } from '../globalcomponent';
import { GoChevronDown } from 'react-icons/go';
import '../../App.css'


function FilterProudct({handleFilterPrice,handlechekcbox, clearFilter, categories,
     setCategories, brands, setBrands,
    subcategories, setSubCategories, filterGender, setFilterGender, 
    filterPrice ,brand_error, category_error, subcategory_error}) {
    


    const [showCheckboxes, setShowCheckboxes] = useState({
        brand: false, price: false, subcategory: false,
        gender: false, category: false
    });

    const handleToggle = (key) => {

        setShowCheckboxes(prevState => ({
            ...prevState,
            [key]: !prevState[key]
        }))
    }


    const handleSelectPrice = (e, item) => {
        handleFilterPrice(e,item)
    }


    const handleCheckboxChange = (e, checkboxindex, filterstatekey,
        filteritem, filterState, setfilterState, filtereditemname) => {

        handlechekcbox(e,checkboxindex,filterstatekey, filteritem,
            filterState, setfilterState, filtereditemname)
    };
    

    const handleClearFilter = () => {

        clearFilter()
    }


    return (
        <div className='displayfilterhome'>
            
            <div className='filterheading'>
                <h5 className='text-center inline'>Filter</h5>
                <button className='ms-8 inline'
                    onClick={(e) => handleClearFilter()}>Clear filter</button>
            </div>

            <div>


                <div className='filterlist'>
                    <button onClick={() => handleToggle("gender")}>Gender
                        <GoChevronDown className='inline' /></button>
                    {showCheckboxes.gender &&
                        <div className='filtercheckbox'>{filterGender.map((gender, index) => {
                            return <DisplayCheckbox index={index}
                                value={gender.gender} className={"filterproductcheckbox"}
                                checked={gender.checked} label={gender.label}
                                name={"gender"} onchange={(e) => handleCheckboxChange(e, index, "gender",
                                    gender, filterGender, setFilterGender, "gender")} />
                        })}</div>}
                </div >

                <div className='filterlist'>

                    <button onClick={() => handleToggle("price")}>Price range
                        <GoChevronDown className='inline' /></button>
                    {showCheckboxes.price &&
                        filterPrice.map((price, index) => {
                            return <option key={index} className='filterpriceoption'
                                value={price._id}
                                onClick={(e) => handleSelectPrice(e, price)}>{price.label}</option>
                        })

                    }


                </div  >

                <div className='filterlist' ><button onClick={() => handleToggle("category")}>Category
                    <GoChevronDown className='ms-2 inline' /></button>
                    {category_error ? <div className={"filterproductcheckbox"}>{category_error}</div> : 
                    showCheckboxes.category &&
                        <div>{categories?.length > 0 && categories.map((category, index) => {

                            return <DisplayCheckbox index={index} value={category._id}
                                label={category.category_name} name={"category"}
                                checked={category.checked} className={"filterproductcheckbox"}
                                onchange={(e) =>
                                    handleCheckboxChange(e, index, "category",
                                        category, categories, setCategories, "category_name")} />
                        })}</div>}
                </div>

                <div className='filterlist' >
                    <button onClick={() => handleToggle("subcategory")}>Subcategory
                        <GoChevronDown className='ms-2 inline' /></button>
                    {subcategory_error ? <div className={"filterproductcheckbox"}>{subcategory_error}</div> : 
                    showCheckboxes.subcategory &&
                        <div>{subcategories?.length > 0 && subcategories.map((subcategory, index) => {
                            return <DisplayCheckbox index={index} value={subcategory._id}
                                label={subcategory.subcategory_name} className={"filterproductcheckbox"}
                                checked={subcategory.checked} name={"subcategory"}
                                onchange={(e) =>
                                    handleCheckboxChange(e, index, "subcategory",
                                        subcategory, subcategories, setSubCategories, "subcategory_name")} />
                        })}</div>}
                </div>
                <div className='filterlist' >
                    <button onClick={() => handleToggle("brand")}>brand
                        <GoChevronDown className='ms-2 inline' /></button>
                    {brand_error ? <div className={"filterproductcheckbox"}>{brand_error}</div> : 
                    showCheckboxes.brand &&
                        <div>{brands?.length > 0 && brands.map((brand, index) => {
                            return <DisplayCheckbox index={index} value={brand._id}
                                label={brand.brand_name} className={"filterproductcheckbox"}
                                checked={brand.checked} name={"brand"}
                                onchange={(e) =>
                                    handleCheckboxChange(e, index, "brand",
                                        brand, brands, setBrands, "brand_name")} />
                        })}</div>}
                </div>

            </div>
           
        </div>
    )
}

export default FilterProudct