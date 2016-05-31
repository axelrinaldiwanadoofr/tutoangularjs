
/*
* Demarrage d'AngularJS
*
* Appel de la méthode "module" de l'objet Angular référencé par la variable globale
* angular. Cette méthode crée un objet associée à notre application (cf directive ng-app placé dans la 
* balise <html> du code HTML) et renvoie sa référence que l'on copie dans la variable app
*/
var app = angular.module( 'MonApp', [] ) ;


// Enregistre une fabrique au sein d'Angular qui créera et retournera 
// une instance d'un provider WebSql.
// Ajout par injection de l'argument $q référencant l'objet de gestion
// des promise pour les traitements asynchrones
app.factory( "webSql", ["$q",function($q) 
{
    // Cree un objet vide
    var provider = {} ;
    
    // Ouvre ou crée la base de données locale de type WEBSQL de nom MaBD
    // version n°1 et d'une taille de 1Mo
    provider.db = openDatabase( "MaBD", "1", "Ceci est un commentaire", 1000000 ) ;
    
    // Methode exec( sql, bindings, onSuccesFct( provider, results ) )
    // sql: Requete SQL
    // bindings: Tableau de valeurs
    // Renvoie une promise
    provider.exec = function( sql, bindings )
    {
        // Stocke dans une variable de closure la référence de l'objet servant
        // à appeler la méthode
        var $this = this ;

        // Cree un objet de gestion de traitement asynchrone
        var defered = $q.defer() ;
        
        // Ouvre un cycle de transaction dans WEBSQL (Traitement asynchrone)
        this.db.transaction( function( transaction ) 
        {
            // Envoie la requete SQL à WEBSQL
            transaction.executeSql( sql, bindings, 
                function( transaction, results )
                {
                    // Declenche un traitement de succes
                    return defered.resolve( results ) ;
                },
                function( transaction, error )
                {
                    // Declenche un traitement d'erreur
                    return defered.reject( "Error: " + error.code + " " + error.message ) ;
                }
            );
        }); 
        
        // Retourne une promise permettant d'ajouter d'autre traitements asynchrone à la suite
        // de celui-ci.
        return defered.promise ;
    };
    
    // Execute une requete SQL et place le résultat dans le tableau donné
    // dans l'argument arrayForRows
    // Retourne une promise 
    provider.select = function( sql, bindings, arrayForRows )
    {
        // Lance la requete et recupere une promise
        var promise1 = this.exec( sql, bindings ) ;
                
        // Traitement à l'issue de la promise et génère une deuxième promise pour 
        // permettre d'autre traitement à la suite
        var promise2 = promise1.then( function( results )
        {
           if( arrayForRows ) 
           {
                for( var i=0; i< results.rows.length; i++ )
                {
                    arrayForRows.push( results.rows[i] ) ;
                }               
                
           }
           return results ;
        }, function( error )
        {
            console.log( error ) ;
            return error ;
        });
        
        return promise2 ;
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


