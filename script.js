const cashM = document.getElementById("cash");
const changeDue = document.getElementById("change-due");
const purchbtn = document.getElementById("purchase-btn");

let price  = 19.5;
let cid =
 [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]

let currencyU =
[["PENNY", .01],
 ["NICKEL", .05],
 ["DIME", 0.1], 
 ["QUARTER", 0.25], 
 ["ONE", 1], 
 ["FIVE", 5], 
 ["TEN", 10], 
 ["TWENTY", 20], 
 ["ONE HUNDRED", 100]]

 purchbtn.addEventListener("click", () => {
   const cashValue = parseFloat(cashM.value);
   const changeD = cashValue - price;

   if(cashValue < price ) {
     alert("Customer does not have enough money to purchase the item");
     return; 
   }
   if(cashValue === price){
     changeDue.innerText = "No change due - customer paid with exact cash"
     return;
   } 

   const changeResult = getChange(changeD,cid);

   if (changeResult.status === "INSUFFICIENT_FUNDS" || changeResult.status === "CLOSED" ){
     changeDue.innerText = `"Status: ${changeResult.status} ${formatChange(changeResult.changeDue)}`
     } else {
     let changeText = `Status: OPEN ${formatChange(changeResult.changeDue)}`; 
     changeDue.innerText = changeText.trim()
   }
 });
 const getChange = (changeD, cid) => {
   let totalCid = parseFloat(cid.reduce((sum, [_,amount]) => sum + amount, 0).toFixed(2))
   if (totalCid < changeD) {
     return {status: "INSUFFICIENT_FUNDS", changeDue:[] }
 }
 let changeArray = [];
 let remainingChange = changeD;

 for (let i = currencyU.length - 1; i >= 0; i--){
   let unit = currencyU[i][0];
   let unitValue = currencyU[i][1];
   let unitInDrawer = cid[i][1];

   if (unitValue <= remainingChange && unitInDrawer > 0) {
     let amountFromUnit = 0;

     while (remainingChange >= unitValue && unitInDrawer > 0){
       remainingChange = (remainingChange - unitValue ).toFixed(2)
       unitInDrawer -= unitValue;
       amountFromUnit += unitValue;
     }
     if (amountFromUnit > 0){
       changeArray.push([unit ,amountFromUnit])
     }
   }
 }
 if (remainingChange > 0){
   return { status: "INSUFFICIENT_FUNDS", changeDue:[] }
 }
 if(changeD === totalCid) {
   return { status: "CLOSED", changeDue: cid }
 }
 return { status: "OPEN", changeDue:changeArray }
 }

 const formatChange = changeArray => changeArray.map(([unit, amount]) => `${unit}:$${amount.toFixed(2)}`).join(" ");