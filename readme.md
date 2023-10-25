### Esercizio
Data una lista della spesa, stampare sulla pagina (anche brutalmente, basta che si vedano) gli elementi della lista individualmente con un ciclo while.

### Logica: 

ho una lista di item; inizializzo dichiarando la const listaarray ["etc", "etc", etc",] e mettendo l'indice dell'array  i= 0 e dichiarando let listaspesa= ""; 
MENTRE la condizione = l'indice < della lunghezza di listaarray
        const item singolo = ad un elemento della lista array[i];
        per stampare su html listaspesa= `<li>${item singolo}</li>`;
        per spezzare il loop i++;



Sintassi While:
initializer
while (condition) {
  // code to run

  final-expression
}

Dato un Array ArrayListaSpesa = ["item1", "item2", "item3", etc ]--> 
listaspesa = "";
let i = 0; ---> inizializzazione

while ( i < Arraylistaspesa.length  ) {--->condizione (il loop continua finchè la condizione è vera)  
    const itemCorrente = Arraylistaspesa[i];
    listaspesa = `<li>${itemCorrente}</li>`;
    i++;---->update per poter uscire dal Loop
}

con do....while:  (la condizione è controllata alla fine)

sintassi do...while:
initializer
do {
  // code to run

  final-expression
} while (condition)

const ArrayListaSpesa = ["item1", "item2", "item3", etc ]  --->inizializzazione
let i = 0;
let listString = "";

do {  il codice verrà eseguito almeno una volta, al di là della verità/falsità della condizione
    const itemCorrente = Arraylistaspesa[i];
    listaspesa = `<li>${itemCorrente}</li>`;
    i++;
} while (i < Arraylistaspesa.length); --->condizione 




