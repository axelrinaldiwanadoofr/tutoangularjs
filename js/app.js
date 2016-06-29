
/*
* Demarrage d'AngularJS
*
* Appel de la méthode "module" de l'objet Angular référencé par la variable globale
* angular. Cette méthode crée un objet associée à notre application (cf directive ng-app placé dans la 
* balise <html> du code HTML) et renvoie sa référence que l'on copie dans la variable app
*/
var app = angular.module( 'MonApp', ["webSqlPrdModule"] ) ;

// Configuration du provider injecté webSqlPrdProvider servant de provider pour le provider webSql. 
// La configuration est enregistrée dans la variable de closure config déclaré dans la fabrique 
// du provider de provider webSql
app.config( ["sqlPrdProvider", function( sqlPrdProvider)
{   
    // Appel de la méthode config du provider de provider webSql pour enregistrer une configuration
    // qui sera utilisée au moment de l'appel de la fabrique référencée par l'argument $get
    sqlPrdProvider.config( "dbPersonnes", "1", "Ma BD", 1000000, function( provider )
    {
        // Intialsaition sur la BD
        // Cree la table Personnes
        provider.createTable( "Personnes", {id:"int", nom:"nom", prenom:"text"}).then( function()
        {
            return provider.select( "select count(*) as nb from Personnes", [], [] ) ;            
        }).then( function( rows )
        {
            if( rows[0].nb == 0 )
            {
                // Insere la personne si la table Personnes ne contient pas d'occurence
                return provider.insert( "Personnes", {id:1, nom: "DUPOND", prenom: "Charles"} ) ;
            }            
        });

        // Retourne l'objet singleton
        return provider ;
    });
}]);


/*
 * Création du controleur de donnée "LesPersonnesController" qui crée un modèle de données
 * pour une collection de personnes stokée dans un tableau au sein du scope. 
 * 
 * Le controleur ajoute cette fois au scope l'attribut "lesPersonnes" dans lequel 
 * est copié la référence du tableau lesPersonnes chargé ci-dessus  
 * 
 * Ajout par injection de l'argument sqlPrd faisant référence au provider WebSql
 * 
 */
app.controller( "PersonneController", ["$scope","sqlPrd",function( $scope, sqlPrd )
{
    // Création d'un tableau vide
    $scope.lesPersonnes = [] ;
    
    // 
    // Recupere la liste des personnes
    //
    sqlPrd.select( "select * from Personnes", [], $scope.lesPersonnes ) ;
}]);


