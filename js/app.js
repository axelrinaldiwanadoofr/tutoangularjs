
// Création d'un objet vide et copie de sa référence dans la variable p
var p = {} ;

// Ajout dynamique d'attributs à l'objet
p.nom = "MEYER" ;
p.prenom = "Paul" ;
p.age = 24 ;

// Copie de la référence de l'objet contenue de la variable p à la variable h 
var h = p ;

// Accès à l'attribut prenom du même objet au travers de la variable h
h.prenom = "Alain" ;

// Création d'un objet au format JSON
var a = {
    nom: "SCHMITT",
    prenom: "Léa",
    age: 33
};

// Instanciation de la classe Object
var b = new Object() ;

// Ajout dynamique d'attributs à l'objet
b.nom = "MARTIN" ;
b.prenom = "Henris" ;
b.age = 50 ;

// Ajout dynamique d'une méthode à l'objet référencé par la variable a
a.affiche = function()
{
    console.log( this.prenom + " " + this.nom + " agé de " + this.age + " ans." ) ;
};

// Utilisation de la méthode avec l'objet référencé par la variable a
a.affiche() ;

// Copie de la référence de la méthode affiche dans l'attribut affiche pour 
// l'objet référencé par la variable b
b.affiche = a.affiche ;

b.affiche() ;


