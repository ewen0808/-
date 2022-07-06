const orderList = document.querySelector(".js-orderList");
let orderData = [];
//初始化
function intial(){
  getOrderList();
  
}
intial();
//C3 LV1
function renderC3(){
 //物件資料蒐集
   let total = {};
   orderData.forEach(function(item){
    item.products.forEach(function(productItem){
     if(total[productItem.category] == undefined){
      total[productItem.category] = productItem.price* productItem.quantity
     
     }
     else{
      total[productItem.category] += productItem.price*productItem.quantity
     }
     
    })
   })
//物件轉陣列
  let catogoryAry = Object.keys(total);
  
  let newData = [];
  catogoryAry.forEach(function(item){
    let ary = [];
    ary.push(item);
    ary.push(total[item]);
    newData.push(ary)
  })


  //c3.js
  var chart = c3.generate({
   data: { 
       bindto: '#chart',//HTML綁訂
        columns: newData,
        type : 'pie',
        
    }})
}
//C3 LV2
function renderC3LV2() {
   //物件蒐集
   let obj = {};
   orderData.forEach(function(item){
     item.products.forEach(function(productItem){
        if( obj[productItem.title] == undefined){
           obj[productItem.title] = productItem.price * productItem.quantity
          
        } 
        else{
          obj[productItem.title] += productItem.price * productItem.quantity
        }
        
     })
   })
   //物件轉陣列
   let ary = Object.keys(obj)
   
   //將陣列轉乘C3.js格式
    let newData = [];
    ary.forEach(function(item) {
      let data = [];
      data.push(item);
      data.push( obj[item])
      newData.push(data);
    })
   //比大小
   newData.sort(function(a, b) {
   return b[1] -  a[1];
   
   })
   
   //顯示前三名 超過4筆顯示為其他
   if(newData.length >3){
    let newTotal = 0 ;
    newData.forEach(function(item,index){
       if(index>2){
        newTotal+= newData[index][1]
       }
    })
    newData.splice(3,newData.length-1)
       newData.push(["其他",newTotal])
       console.log(newData)
   }
  
   

   var chart = c3.generate({
    data: { 
        bindto: '#chart',//HTML綁訂
         columns: newData,
         type : 'pie',
         
     }})

   
}
//取得訂單列表
function getOrderList(){
axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
    headers: {
        "authorization": token
    }
})
.then(function (response) {
   orderData =response.data.orders;
   let str = "";
   orderData.forEach(function (item) {
    //組時間字串
     const timeStamp = new Date(item.createdAt*1000);
     const thisTime = `${timeStamp.getFullYear()}/${timeStamp.getMonth()+1}/${timeStamp.getDate()}`;
     
     
  //組產品字串
   let productStr = "";
   item.products.forEach(function (productItem) {
    productStr +=`<p>${productItem.title}*${productItem.quantity}</p>`
   })
  //訂單狀態
  let productState = "";
  if(item.paid == true) {
    productState = "已處理" ;
  }
  else{
    productState = "未處理";
  }
  //組訂單字串
    str += `<tr>
    <td>${item.id}</td>
    <td>
      <p>${item.user.name}</p>
      <p>${item.user.tel}</p>
    </td>
    <td>${item.user.address}</td>
    <td>${item.user.email}</td>
    <td>
      <p>${productStr}</p>
    </td>
    <td>${thisTime}</td>
    <td class=" js-orderStates">
      <a href="#" class="orderStatus" data-id="${item.id}"  data-status="${item.paid}">${productState}</a>
    </td>
    <td>
      <input type="button" class="delSingleOrder-Btn  js-orderDelete" value="刪除" data-id="${item.id}">
    </td>
  </tr>`
   })
   orderList.innerHTML = str;
   renderC3LV2();
})
}

//刪除訂單
  
  orderList.addEventListener("click", function(e){
    e.preventDefault();
   const targetClass = e.target.getAttribute("class");
   let id = e.target.getAttribute("data-id");
   if(targetClass == "delSingleOrder-Btn  js-orderDelete"){
    deleteOrderList(id);
       return;
   }
   if(targetClass == "orderStatus"){
    let status = e.target.getAttribute("data-status");
    
    statusItem(status,id);
    return;
   }
  })
//修改訂單狀態
  function statusItem(status,id){
    let newStatus;
    if(status == true){
      newStatus = false;
    }
    else{
      newStatus = true;
    }
    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        "data": {
          "id": id,
          "paid": newStatus
        }
      },
      {
        headers: {
            "authorization": token
        }},)
      .then(function(response) {
        alert("修改狀態成功")
        getOrderList();
      })
  }
  //刪除訂單
  function deleteOrderList(id) {
     axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${id}`,
     {
      headers: {
          "authorization": token
      }})
      .then(function(response) {
        alert("刪除訂單成功");
        getOrderList();
      })
  }
      


