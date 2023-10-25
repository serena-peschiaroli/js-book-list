
// inizializzazione

const ShoppingList = ["mela", "pera", "latte", "formaggio", "cioccolato"];
console.log(ShoppingList);
let ListString = "";
let i = 0;
// /inizializzazione



// codice con do

do {
    currentItem = ShoppingList[i];
    console.log(currentItem);
    ListString += `<li>${currentItem}</li>`;
    i++;
} while (i< ShoppingList.length); 

console.log(ListString);
document.querySelector("ul").innerHTML = ListString;

//codice con while: 

// while( i < ShoppingList.length) {
//     currentItem = ShoppingList[i];
//     console.log(currentItem);
//     ListString += `<li>${currentItem}</li>`;
//     i++;
// }
// console.log(ListString);
// document.querySelector("ul").innerHTML = ListString;