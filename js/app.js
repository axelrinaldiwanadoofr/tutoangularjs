
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

// Ajout dynamique d'une méthode à l'objet référencé par la variable p
p.affiche = function()
{
    console.log( this.prenom + " " + this.nom + " agé de " + this.age + " ans." ) ;
};

p.affiche() ;

// Tableaux : objet de type Array

// Crée un tableau vide
var t1 = [] ; // Equivalent à var t1 = new Array() ;

// Ajout de valeurs
t1[0] = 12 ;
t1[1] = 23.4 ;
t1[2] = "toto" ;
t1[5] = "titi" ;
 
// Création avec format JSON
var t2 = [13,15.6,"tutu",,"tata"] ;

// Parcours par comptage
for( var i=0 ; i<t2.length ; i++ ) console.log( t2[i] ) ;

// Parcours par récupération des indices
for( var i in t2 ) console.log( t2[i] ) ;

