// //codice con while: 

while( i < ShoppingList.length) {
    currentItem = ShoppingList[i];
    console.log(currentItem);
    ListString += `<li>${currentItem}</li>`;
    i++;
}
console.log(ListString);
document.querySelector("ul").innerHTML = ListString;