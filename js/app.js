
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
app.config( ["webSqlPrdProvider", function( webSqlPrdProvider)
{   
    // Appel de la méthode config du provider de provider webSql pour enregistrer une configuration
    // qui sera utilisée au moment de l'appel de la fabrique référencée par l'argument $get
    webSqlPrdProvider.config( "dbPersonnes", "1", "Ma BD", 1000000, function( provider )
    {
        // Intialsaition sur la BD
        // Cree la table Personnes
        provider.exec( "CREATE TABLE IF NOT EXISTS Personnes( id int, nom text, prenom text )" ).then( function( results )
        {
            // Insere une personne si la table est vide avec utilisation d'une promise
            return provider.exec( "select count(*) as nb from Personnes", [] ) ;
        }).then( function( results )
        {
            if( results.rows[0].nb == 0 )
            {
                // Insere la personne si la table Personnes ne contient pas d'occurence
                return provider.exec( "INSERT INTO Personnes( id, nom, prenom ) values( ?, ?, ? )", [1, "DUPOND", "Charles"] ) ;
            }
        }).then( function( results )
        {
            if( results ) alert( results.rowsAffected + " enregsitrement inseré") ; 
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
 * Ajout par injection de l'argument webSql faisant référence au provider WebSql
 * 
 */
app.controller( "PersonneController", ["$scope","webSqlPrd",function( $scope, webSqlPrd )
{
    // Création d'un tableau vide
    $scope.lesPersonnes = [] ;
    
    // 
    // Recupere la liste des personnes
    //
    webSqlPrd.select( "select * from Personnes", [], $scope.lesPersonnes ) ;
}]);


