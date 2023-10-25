const ShoppingList = ["mela", "pera", "latte", "formaggio", "cioccolato"];
let ListString = "";
let i = 0;
// inizializzazione

while( i > ShoppingList.length) {
    currentItem = ShoppingList[i];
    ListString = `<li>${currentItem}</li>`;
    i++;
}
console.log(ListString);
document.querySelector("ul").innerHTML = ListString;