
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
