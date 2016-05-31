
/*
* Demarrage d'AngularJS
*
* Appel de la méthode "module" de l'objet Angular référencé par la variable globale
* angular. Cette méthode crée un objet associée à notre application (cf directive ng-app placé dans la 
* balise <html> du code HTML) et renvoie sa référence que l'on copie dans la variable app
*/
var app = angular.module( 'MonApp', [] ) ;


// Enregistre une fabrique au sein d'Angular qui créera et retournera 
// une instance d'un provider WebSql 
app.factory( "webSql", [function() 
{
    // Cree un objet vide
    var provider = {} ;
    
    // Ouvre ou crée la base de données locale de type WEBSQL de nom MaBD
    // version n°1 et d'une taille de 1Mo
    provider.db = openDatabase( "MaBD", "1", "Ceci est un commentaire", 1000000 ) ;
    
    // Methode exec( sql, bindings, onSuccesFct( provider, results ) )
    // sql: Requete SQL
    // bindings: Tableau de valeurs
    // onSuccesFct( provider, results ): Référence du callback à exécuter en cas de succes
    //      provider: Référence du provider
    //      results: Référence de l'objet contenant le résultat de la requete
    provider.exec = function( sql, bindings, onSuccesFct )
    {
        // Stocke dans une variable de closure la référence de l'objet servant
        // à appeler la méthode
        var $this = this ;
        
        // Ouvre un cycle de transaction dans WEBSQL (Traitement asynchrone)
        this.db.transaction( function( transaction ) 
        {
            // Envoie la requete SQL à WEBSQL
            transaction.executeSql( sql, bindings, 
                function( transaction, results )
                {
                    if( onSuccesFct ) onSuccesFct( $this, results ) ;
                },
                function( transaction, error )
                {
                    // Traitement d'erreur en cas d'echec
                    alert( "Erreur code " + error.code + " " + error.message ) ;
                }
            );
        });                                                
    };
    
    // Execute une requete SQL et place le résultat dans le tableau donné
    // dans l'argument arrayForRows
    provider.select = function( sql, bindings, arrayForRows )
    {
        this.exec( sql, bindings, function( provider, results )
        {
           if( arrayForRows ) 
           {
                for( var i=0; i< results.rows.length; i++ )
                {
                    arrayForRows.push( results.rows[i] ) ;
                }               
           }
        });
    };
    
    // Intialsaition sur la BD
    // Cree la table Personnes
    provider.exec( "CREATE TABLE IF NOT EXISTS Personnes( id int, nom text, prenom text )" ) ;
    // Insere une personne si la table est vide
    provider.exec( "select count(*) as nb from Personnes", [], function( provider, results)
    {
        if( results.rows[0].nb == 0 )
        {
            // Insere la personne si la table Personnes ne contient pas d'occurence
            provider.exec( "INSERT INTO Personnes( id, nom, prenom ) values( ?, ?, ? )", [1, "DUPOND", "Charles"] ) ;
        }
    }) ;
    
    // Retourne l'objet singleton
    return provider ;
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
app.controller( "PersonneController", ["$scope","webSql",function( $scope, webSql )
{
    // Création d'un tableau vide
    $scope.lesPersonnes = [] ;
    
    // 
    // Recupere la liste des personnes
    //
    webSql.select( "select * from Personnes", [], $scope.lesPersonnes ) ;
}]);


