// Varibili iniziali

const ShoppingList = ["mela", "pera", "latte", "formaggio", "cioccolato"];
console.log(ShoppingList);

// usiamo un get element by id per prendere i dati dall'input con i btn invia e mostra e poi aggiungiamo addeventlistener per attaccare la funzione agli eveneti click

document.getElementById("inviaBtn").addEventListener("click", AggiungiItem);
document.getElementById("mostraBtn").addEventListener("click", stampaLista);

// la funzione: aggiungiItem è chiamata quando avviene il click. La funzione è seguita da un nome, una lista di parametri chiusi da {}. )

function AggiungiItem () {
    // questo dichiara la funzione
   
    const NewItem = document.getElementById("askUser");
    // si prendono i dati dlal'input e si assegnato alla nuova variabile NewItemAdd
    const NewItemAdd = NewItem.value;
    // questo sopra prende il valore inserito dall'user e lo assegna alla nuova variabile


    ShoppingList.push(NewItemAdd);
    // il push per aggiungere il nuovo dato all'array
    console.log (NewItemAdd)
    console.log (ShoppingList);


    // si pulisce il campo dell'input e lo si prepara per un nuovo inserimento
    NewItem.value = ""; 



}

function stampaLista() {
    let i = 0;
    let ListString = "";
    do {
        currentItem = ShoppingList[i];
        console.log(currentItem);
        ListString += `<li>${currentItem}</li>`;
        i++;
    } while (i< ShoppingList.length); 
    
    console.log(ListString);
    document.querySelector("ul").innerHTML = ListString;
}

