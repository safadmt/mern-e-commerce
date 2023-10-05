import express from 'express';
import { deleteOneCategory, deleteOneSubcategory, loginAdmin, removeCategoryPermenant, removeOneBrand, removeSubCategoryPermenant, signupAdmin,
  } from '../controllers/admin.js';
import { createProduct, deleteProduct, editProduct, 
    getAllProduct, getOneProduct , getSearchProduct,
 getProductByPrice,getFilteredProducts, softDeleteProduct} from '../controllers/product.js';
import multer from 'multer';
import path from 'path';
import { getAllOrders   , AddNewCategory,
AddNewSubCategory, AddBrand, editCategory, editSubCategory,editBrand,
getOneCategory, getOneSubCategory, getOneBrand, getAllCategory, 
getAllSubCategory, getAllBrand,removeBrandPermenantly,searchOrders} from '../controllers/admin.js';
import { getOneOrder } from '../controllers/user.js';
import { jwtAuthAdmin } from '../middleware/auth.middleware.js';
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, callback)=> {
        callback(null, './public/images/');
    },
    filename:  (req, file, callback)=> {
        const uniqueFilename = Date.now() + Math.round(Math.random() * 1000083) + path.extname(file.originalname);
        callback(null, uniqueFilename)
    }
})

const upload = multer({storage:storage});

router.post("/login",loginAdmin);
router.post("/signup", signupAdmin);
router.post("/product",jwtAuthAdmin,upload.single("filename"), createProduct);
router.post("/products", getAllProduct);
router.get("/product/:id", getOneProduct);
router.put("/product/:id",jwtAuthAdmin,upload.single("filename"), editProduct);
router.delete("/product/:id",jwtAuthAdmin, softDeleteProduct);
router.post("/orders", jwtAuthAdmin,getAllOrders)
router.post('/product/search', getSearchProduct);
router.post('/sort-product',  getProductByPrice);
// router.get('/filter-orders', getFilteredOrders);
router.get('/filter-products',  getFilteredProducts);
router.post('/add-category',jwtAuthAdmin,  AddNewCategory);
router.post('/add-sub-category',jwtAuthAdmin,  AddNewSubCategory);
router.post('/add-brand',jwtAuthAdmin,  AddBrand);
router.put('/category/:categoryId',jwtAuthAdmin,  editCategory);
router.put('/subcategory/:subcategoryId',jwtAuthAdmin,  editSubCategory);
router.put('/brand/:brandId',jwtAuthAdmin,  editBrand);
router.get('/category/:categoryId',jwtAuthAdmin,  getOneCategory);
router.get('/sub-category/:subcategoryId',jwtAuthAdmin,  getOneSubCategory);
router.get('/brand/:brandId',jwtAuthAdmin, getOneBrand);
router.get('/categories',  getAllCategory);
router.get('/sub-categories',  getAllSubCategory);
router.get('/get-brands',  getAllBrand);
router.delete('/category/:categoryId',jwtAuthAdmin,  deleteOneCategory);
router.delete('/sub-category/:subcategoryId', deleteOneSubcategory);
router.delete('/brand/:brandId',jwtAuthAdmin,  removeOneBrand);
router.delete('/brand/perment-delete/:brandId',jwtAuthAdmin,  removeBrandPermenantly);
router.get('/orders/search?',jwtAuthAdmin,  searchOrders);
router.delete('/category/permenant-delete/:categoryId',jwtAuthAdmin,  removeCategoryPermenant);
router.delete('/subcategory/permenant-delete/:subcategoryId',jwtAuthAdmin,  removeSubCategoryPermenant);
router.get('/orders/:orderid', getOneOrder);

export default router;