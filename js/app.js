
/*
* Demarrage d'AngularJS
*
* Appel de la méthode "module" de l'objet Angular référencé par la variable globale
* angular. Cette méthode crée un objet associée à notre application (cf directive ng-app placé dans la 
* balise <html> du code HTML) et renvoie sa référence que l'on copie dans la variable app
* 
* Demande à charger le module "ngRoute" de routage de page
*/
var app = angular.module( 'MonApp', ["ngRoute"] ) ;

/*
 * 
 * L'appel de la méthode "config" de AngularJS permet de paramétrer le service de routage des pages d'AngularJS
 * L'argument $routeProvider injecté dans la fonction contient la référence à ce service. Ce dernier possède la 
 * méthode "when" permettant de créer des entrés dans le système de routage de page (Ce système permets de gérer
 * les liens hyper-text qui sont placés dans le code HTML). Chaque entrée contient un chemin de navigation et un objet
 * dont les attributs renseignent le système de routage sur les taches à réaliser. 
 * 
 * La première entrée correspond à la liste des personne et charge de manière asynchrone le contenu du fichier
 * "vwListeDePersonnes.html" qui viendra en remplacement du contenu de la balise <article> contenant la directive
 * "ng-view"
 * 
 *  L'appel de la méthode "otherwise" permet de préciser quelle vue est utilisée par défaut.
 */
app.config( ['$routeProvider',function( $routeProvider)
{
    // Route pour accéder à la liste des personnes. Utilise la vue stockée dans le fichier vwListeDePersonnes.html qui
    // viendra en remplacement de la directive ng-view
    $routeProvider.when( '/list', {
        templateUrl: 'view/vwListeDePersonnes.html'
        });
        
    $routeProvider.otherwise( {redirectTo: '/list'} ) ;
}]);

/*
 * Création du controleur de donnée "LesPersonnesController" qui crée un modèle de données
 * pour une collection de personnes stokée dans un tableau au sein du scope. 
 * 
 * Le controleur ajoute cette fois au scope l'attribut "lesPersonnes" dans lequel est copiée la référence d'un
 * tableau dont chaque case référence un objet contenant les données d'une personne.   
 *    
 */
app.controller( "LesPersonnesController", ["$scope",function( $scope )
{
    $scope.lesPersonnes = [
        {id: 1, nom: "Meyer", prenom: "Paul" },
        {id: 2, nom: "Martin", prenom: "Enzo" },
        {id: 3, nom: "Dupond", prenom: "Pauline" },
        {id: 4, nom: "Duschmol", prenom: "Robert" }
    ];
}]);


