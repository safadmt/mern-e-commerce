import Product from "./model/product.js";

export function insertMany () {
    try{
        Product.insertMany([
            {category: "Shirt", price: 319, quantity: 20, gender:'mens', brand:'Allen solly' ,
             description:"Men Regular Fit Printed Spread Collar Casual Shirt",
              filename: 'xxl-st10-vebnor-original-imagzdu7azhy9tvf.webp'},
              {category: "T-Shirt", price: 500, quantity: 15, gender:'mens', brand:'Indiana Jones' ,
             description:"Men Striped Polo Neck Cotton Blend Multicolor T-Shirt",
              filename: 'l-4567a-austin-wood-original-imagqfy9gvsj9dht.webp'},
              {category: "Jeans", price: 899, quantity: 20, gender:'mens', brand:'Peter England University ' ,
             description:"Men Tapered Fit Mid Rise Dark Blue Jeans",
              filename: '-original-imaghtcjtabkczke.webp'},
              {category: "T-Shirt", price: 318, quantity: 15, gender:'mens', brand:'Harbor N Bay ' ,
             description:"Men Solid Henley Neck Cotton Blend Maroon T-Shirt",
              filename: 'm-mtsbaac2492-wine-harbor-n-bay-original-imageg3mtyyjgh9v.webp'},
              {category: "Jeans", price: 399, quantity: 10, gender:'mens', brand:'MAVI Fashion ' ,
             description:"Men Slim Mid Rise Black Jeans",
              filename: '30-new-black02-mavi-fashion-original-imagdm8kmkymyzew-bb.webp'},
              {category: "Shirt", price: 447, quantity: 12, gender:'mens', brand:'MAVI Fashion ' ,
             description:"Men Slim Fit Striped Spread Collar Casual Shirt",
              filename: 'xl-saraaistr01-saraai-original-imagn254ywhhzgdy.webp'},
              {category: "Shirt", price: 473, quantity: 25, gender:'mens', brand:'Peter England' ,
             description:"Men Slim Fit Checkered Casual Shirt",
              filename: 'xl-saraaistr01-saraai-original-imagn254ywhhzgdy.webp'},
              {category: "Kurtha", price: 499, quantity: 22, gender:'womens', brand:'gayraa' ,
              description:"Women Printed Cotton Blend Anarkali Kurta  (Multicolor)",
               filename: 'xl-multi-gayraa-original-imagf3e77uvbn9tw.webp'},
               {category: "Kurtha", price: 499, quantity: 22, gender:'womens', brand:'gayraa' ,
              description:"Women Printed Cotton Blend Anarkali Kurta  (Multicolor)",
               filename: 'l-grmulti-gayraa-original-imaggcbk5u9wxbrh.webp'},
               {category: "Dress_material", price: 280, quantity: 15, gender:'womens', brand:'Anand' ,
              description:"Unstitched Crepe Salwar Suit Material Printed",
               filename: 'yes-2-m-unstitched-2-10m-gk-dm1-53-kashvi-original-imagebgmw3yz5qe4.webp'},
               {category: "Lehanga", price: 473, quantity: 8, gender:'womens', brand:'Zinariya Fab ' ,
              description:"Floral Print Semi Stitched Lehenga Choli  (Green)",
               filename: 'free-sleeveless-fidera-organza-fabcartz-original-imagfgrsk8rz92aq.webp'},
               {category: "Kurtha", price: 499, quantity: 22, gender:'womens', brand:'gayraa' ,
              description:"Women Printed Cotton Blend Anarkali Kurta  (Multicolor)",
               filename: 'l-grmulti-gayraa-original-imaggcbk5u9wxbrh.webp'},
               {category: "Lehanga", price: 339, quantity: 5, gender:'womens', brand:'jahal fashion' ,
              description:"Self Design Semi Stitched Lehenga Choli  (Red)",
               filename: 'free-half-sleeve-basket-red-jahal-fashion-original-imagmzyzd9na2kgq.webp'},
               {category: "Lehanga", price: 779, quantity: 8, gender:'womens', brand:'GOROLY ' ,
              description:"Embroidered Semi Stitched Lehenga Choli  (Purple)",
               filename: 'free-3-4-sleeve-future-wine-goroly-original-imag5ezdwczgyb5m.webp'},
               {category: "Saree", price:449, quantity: 4, gender:'womens', brand:'STARPRO ERA' ,
               description:"Woven Kanjivaram Jacquard, Pure Silk Saree  (Brown)",
                filename: 'free-4574-coffe-palkaano-unstitched-original-imagh3252qq7e8ww.webp'},
                {category: "Watch", price:165, quantity: 14, gender:'kids', brand:'Flozio' ,
               description:"Black Case Black Strap Electronic Digital Watch - For Boys 8yviq- I Square Black T50 LED",
                filename: '-original-imagpzzj8qhcdxet.webp'},
                {category: "Watch", price:279, quantity: 14, gender:'kids', brand:'HINISH ' ,
               description:`Unisex Waterproof Sport Digital Watch For Men - 
               Women & Children Digital Watch - For Boys & Girls Unique
                Designed Waterproof Black Round Big Dial Digital Multifunctional
                 Unisex Watch For Kids - Boys And Girls`,
                filename: '-original-imagpzzjsmfjygss.webp'},
                {category: "Shoe", price:1349, quantity: 10, gender:'kids', brand:'RED TAPE ' ,
               description:`Velcro Walking Shoes For Boys & Girls  (Blue)`,
                filename: '1-rtk019-red-tape-original-imag7t2njjgdjneu.webp'},
                {category: "Shoe", price:729, quantity: 6, gender:'kids', brand:'CAMPUS' ,
               description:`Lace Running Shoes For Boys & Girls  (Multicolor)`,
                filename: '3-cg-570-campus-original-imag2yfykwqcmwme.webp'},



        ]).then(response=> {
            console.log(response)
        })
    }catch(err) {
        console.log(err)
    }
}

// insertMany();