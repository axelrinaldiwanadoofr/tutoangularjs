

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
var p1 = new Personne( "MEYER", "Paul", 60 ) ;

// Appel de la méthode affiche pour l'objet référencé par p1
p1.affiche() ;

// Construction de la classe Patineur classe par héritage de la classe Personne

// Constructeur
function Patineur( nom, prenom, age, meilleurScore )
{
    // Appel du constructeur de la classe mère
    Personne.call( this, nom, prenom, age ) ;
    
    // Attribut supplémentaire
    this.meilleurScore = meilleurScore ;
}

// Héritage
// Création d'une instance du prototype de Personne pour le prototype de Patineur
Patineur.prototype = new Personne ;

var p2 = new Patineur( "ITO", "Midori", 46, 65 ) ;

p2.affiche() ;



