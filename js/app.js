
<<<<<<< HEAD

function Toto( age )
{
    age++ ;
}

Toto( 23 ) ;

var f = Toto ;

f( 23 ) ;

function Titi( fct )
{
    fct( 27 ) ;
}

Titi( Toto ) ;

Titi( f ) ;

Titi( function( valeur)
{
    console.log( valeur + 1) ;
});

function Tata( valeur )
{
    var ageDuCapitaine = valeur + 1 ;
    
    setTimeout( function()
    {
        alert( ageDuCapitaine ) ;
    }, 1000 ) ;
}

Tata( 36 ) ;
Tata( 57 ) ;
=======
/*
* Demarrage d'AngularJS
*
* Appel de la méthode "module" de l'objet Angular référencé par la variable globale
* angular. Cette méthode crée un objet associée à notre application (cf directive ng-app placé dans la 
* balise <html> du code HTML) et renvoie sa référence que l'on copie dans la variable app
*/
var app = angular.module( 'MonApp', [] ) ;

/*
 * Création du controleur de donnée "LesPersonnesController" qui crée un modèle de données
 * pour une collection de personnes stokée dans un tableau au sein du scope. 
 * 
 * Le controleur ajoute cette fois au scope l'attribut "lesPersonnes" dans lequel est copiée la référence d'un
 * tableau dont chaque case référence un objet contenant les données d'une personne.   
 *    
 */
app.controller( "LesPersonnesController", function( $scope )
{
    $scope.lesPersonnes = [
        {id: 1, nom: "Meyer", prenom: "Paul" },
        {id: 2, nom: "Martin", prenom: "Enzo" },
        {id: 3, nom: "Dupond", prenom: "Pauline" },
        {id: 4, nom: "Duschmol", prenom: "Robert" }
    ];
});


>>>>>>> remotes/tuto/P201_Renomage_du_controlleur_liste_de_personnes
