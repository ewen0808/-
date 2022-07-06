const orderList = document.querySelector('.js-orderList');
let orderData = [];
//初始化
function intial() {
    getOrderList();
}
intial();
function renderC3() {
    
   //物件蒐集
   let total = {};
   orderData.forEach(function(item) {
    item.products.forEach(function(productItem) {
       if(total[productItem.category] == undefined){
         total[productItem.category] = productItem.price*productItem.quantity
       }
       else{
        total[productItem.category] += productItem.price*productItem.quantity
       }
    })
   })
   //物件轉陣列
   const orderAry = Object.keys(total)
   //組c3.js需要的陣列格式
   let ary = [];
   orderAry.forEach(function(item){
     let newAry = [];
    newAry.push(item);
    newAry.push(total[item]);
    ary.push(newAry);
   })

var chart = c3.generate({
    data: {
       bindto: '#chart',//HTML綁訂
       columns: ary,
       type : 'pie',
        
    }
})
}
//取得購物車資訊
function getOrderList(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
        headers: {
            "authorization": token
        }
    })
    .then(function(response) {
        orderData = response.data.orders;
      
      //組全部訂單字串
      let str = "";
      orderData.forEach(function(item){ 
        //訂單狀態
        let orderStatus = "";
        if(item.paid == false){
            orderStatus = "未處理"; 
        }
        else{
            orderStatus = "已處理";
        }
       
        //組時間字串
        const orderTime = new Date(item.createdAt*1000);
        const orderThisTime = `${orderTime.getFullYear()}/${orderTime.getMonth()+1}/${orderTime.getDate()}`
         //組商品字串
        let productStr = "";
        item.products.forEach(function(productItem){
            productStr += `<p>${productItem.title}*${productItem.quantity}</p>`   
        })
        str +=`<tr>
        <td>${item.id}</td>
        <td>
          <p>${item.user.name}</p>
          <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>
          ${productStr}
        </td>
        <td>${orderThisTime}</td>
        <td class="orderStatus">
          <a href="#" class="js-orderStatus" data-id="${item.id}">${orderStatus}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn" value="刪除" data-id="${item.id}">
        </td>
      </tr>`
      })
      orderList.innerHTML = str;
      renderC3()
    })
}

//刪除訂單 
orderList.addEventListener("click", function(e){
    e.preventDefault();
    const orderId = e.target.getAttribute("data-id"); 
   if(e.target.getAttribute("class") == "delSingleOrder-Btn"){
    
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`,{
        headers: {
            "authorization": token
        }
    })
    .then(function(response){
        alert("已成功刪除訂單")
        getOrderList()
    })
   }
   //修改訂單狀態
   if(e.target.getAttribute("class") == "js-orderStatus"){
    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/`,{
        "data": {
          "id": orderId,
          "paid": true
        }
      },
      {
        headers: {
            "authorization": token
        }
    })
    .then(function (response) {
        alert("已成功修改訂單")
        getOrderList()
    })
   }
})

