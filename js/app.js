
// Instanciation de la classe Object
var b = new Object() ;

// Ajout dynamique d'attributs à l'objet
b.nom = "MARTIN" ;
b.prenom = "Henris" ;
b.age = 50 ;

// Ajout dynamique d'une méthode à l'objet référencé par la variable a
b.affiche = function()
{
    console.log( this.prenom + " " + this.nom + " agé de " + this.age + " ans." ) ;
};

b.affiche() ;

// Héritage sur un objet

// Cree un objet vide
var c = {} ;

// Etend l'objet nouvellement crée avec les attriibuts et méthode 
// de l'objet référencé par b
for( var n in b ) c[n] = b[n] ;

// Met a jour le nouvel objet
c.nom = "DUPOND" ;
c.prenom = "Thomas" ;

// Appelle la méthode affiche de l'objet référencé par c
c.affiche() ;



    


