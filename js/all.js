const productList = document.querySelector(".js-productList");
const jsCart = document.querySelector(".js-cart");
let productData = [];
let cartData = [];

//初始化
function intial() {
    getProductList();
    getCartList();
    
}
intial();
//取得產品列表
function getProductList(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
    .then(function (response) {   
        productData = response.data.products;
        renderProduct();
    })
}
//組字串
function renderProduct(){
    let str = "";
    productData.forEach(function(item) { 
        str += ` <div class="col-md-3 position-relative">
        <div class="position-absolute end-0 top-16">
            <p class="fs-4 text-light bg-primary px-3 py-1">新品</p>
        </div>
        <img src="${item.images}" alt="">
        <p class="text-center  bg-primary fs-4 py-1">
            <a href="#" class="text-light" data-id="${item.id}">加入購物車</a></p>
        <p class="fs-4">${item.title}</p>
        <p class="fs-4 text-decoration-line-through">NT$${separator(item.origin_price)}</p>
        <p class="fs-2">NT$${separator(item.price)}</p>
    </div>`
    })
    productList.innerHTML = str;

}
//產品篩選
const productCategory = document.querySelector(".productCategory");
productCategory.addEventListener("change", function(e){
    
    let productValue = e.target.value; 
    
    if(productValue == "全部"){
        renderProduct()
        return;
    }
    let str = "";
    productData.forEach(function(item){
        if(item.category == productValue){
            str += ` <div class="col-md-3 position-relative">
            <div class="position-absolute end-0 top-16">
                <p class="fs-4 text-light bg-primary px-3 py-1">新品</p>
            </div>
            <img src="${item.images}" alt="">
            <p class="text-center  bg-primary fs-4 py-1">
                <a href="#" class="text-light" data-id="${item.id}">加入購物車</a></p>
            <p class="fs-4">${item.title}</p>
            <p class="fs-4 text-decoration-line-through">NT$${separator(item.origin_price)}</p>
            <p class="fs-2">NT$${separator(item.price)}</p>
        </div>`
        }
        productList.innerHTML = str;   
    })
    
})
//取得購物車列表
function getCartList() {
   
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then(function(response) {
        document.querySelector(".js-allPrice").textContent = separator(response.data.finalTotal);
        
        cartData = response.data.carts;
        let str = "";
        cartData.forEach(function(item){
            str += `<tr class="align-middle" >
            <th scope="row" class="d-flex align-items-center">
            <img src="images/room1.png" alt="">
            <p>${item.product.title}</p>
            </th>
            <td >NT$${separator(item.product.price)}</td>
            <td>${item.quantity}</td>
            <td>NT$${separator(item.product.price*item.quantity)}</td>
            <td>
            <i class="fa-solid fa-xmark" data-id="${item.id}"></i>
            </td>
            </tr>`
        })
        jsCart.innerHTML = str; 
    })
}
//加入購物車
productList.addEventListener("click",function(e){
    e.preventDefault();
    let addCartBtn=(e.target.getAttribute("data-id"))
    if(addCartBtn == null){
        alert ("這裡不能點喔")
        return;
    }
    let numCart = 1;
    cartData.forEach(function(item){
        if( item.product.id == addCartBtn ){
            numCart = item.quantity +=1
        }
    })
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,{
        "data": {
          "productId": addCartBtn,
          "quantity": numCart
        }
      })
      .then(function(response){
        alert("您已成功將商品加入購物車")
        getCartList();
      })
      .catch(function(err){
        console.log(err);
      })
})
//刪除單一產品
jsCart.addEventListener("click", function(e){
    let deleteProduct = e.target.getAttribute("data-id")
    if (deleteProduct == null){
        alert("這裡不能點喔")
        return;
    }
    
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${deleteProduct}`)
    .then(function (response) {
        alert("成功刪除商品");
        getCartList();
    })
})
//刪除全部商品
let deleteAll = document.querySelector(".js-deleteAll");
deleteAll.addEventListener("click",function(e){
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then(function(response){
        alert("成功刪除全部商品")
        getCartList();
    })
});
//送出購物車資料
const orderList = document.querySelector(".js-orderBtn");
orderList.addEventListener("click",function(e){
    e.preventDefault();
    if(cartData.length == 0){
        alert("請加入購物車");
        return; 
    }
    const orderName = document.querySelector("#name").value;
    const orderPhone = document.querySelector("#phone").value;
    const orderEmail = document.querySelector("#email").value;
    const orderPlace = document.querySelector("#place").value;
    const orderTrade = document.querySelector("#trade").value;
    if( orderName == ""|| orderEmail== "" ||  orderPhone== "" || orderTrade== "" || orderPlace == ""){
        alert ("請輸入訂單資料");
        return;
    }
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,{
        "data": {
          "user": {
            "name": orderName,
            "tel":  orderPhone,
            "email": orderEmail,
            "address": orderPlace,
            "payment": orderTrade
          }
        }
    })
        .then(function(response) {
            alert("您成功送出訂單");
            getCartList();
            const orderName = document.querySelector("#name").value="";
            const orderPhone = document.querySelector("#phone").value="";
            const orderEmail = document.querySelector("#email").value="";
            const orderPlace = document.querySelector("#place").value="";
            const orderTrade = document.querySelector("#trade").value="ATM";
        })
      

})

//千位數逗點
function separator(numb) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
}
