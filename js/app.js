
// Création d'un objet anonyme (Object) au format JSON
var a = {
    nom: "SCHMITT",
    prenom: "Léa",
    age: 33
};

// Ajout dynamique d'une méthode à l'objet référencé par la variable a
a.affiche = function()
{
    console.log( this.prenom + " " + this.nom + " agé de " + this.age + " ans." ) ;
};

a.affiche() ;

// Création de la classe Personne

// Constructeur Personne
function Personne( nom, prenom, age )
{
    this.nom = nom ;
    this.prenom = prenom ;
    this.age = age ;
}

// Ajout de méthode dans Personne.prototype
Personne.prototype.affiche = function()
{
    console.log( this.prenom + " " + this.nom + " agé de " + this.age + " ans." ) ;    
};

// Creation d'une instance de Personne
var p1 = new Personne( "BROWNING", "Kurt", 50 ) ;

// Appel de la méthode affiche pour l'objet référencé par p1
p1.affiche() ;

// Creation d'une autre instance de Personne
var p2 = new Personne( "ITO", "Midori", 46 ) ;

// Appel de la méthode affiche pour l'objet référencé par p2
p2.affiche() ;


// Appel de la méthode affiche de la classe Personne
// a partir de l'objet de type Object référencé par a
// avec la méthode call de l'objet méthode
Personne.prototype.affiche.call( a ) ;
