
/*
 * @class Class WebSqlPrd: provider pour acceder à WebSql
 * @constructor
 * @param {Factory $q de Angular} $q 
 * @param {Object} config: Objet contenant les parametres d'ouverture de la BD
 *      dbName: Nom de la BD
 *      dbVersion: Version de la BD
 *      dbComment: Commentaire
 *      dbSise: Taille en octet de la BD
 *      initFct: Référence d'une fonction prenant comme argument l'instance de WebSql pour initialisation.
 *                          
 */
function WebSqlPrd( $q, config )
{
    // Ouvre ou crée la base de données locale de type WEBSQL.
    this.db = openDatabase( config.dbName, config.dbVersion, config.dbComment, config.dbSize ) ;    
    this.$q = $q ;
    
    // Si initFct contient une référence de fonction d'initialisation alors lance la fonction
    if( config.initFct ) config.initFct( this ) ;
}


// Methode exec( sql, bindings, onSuccesFct( provider, results ) )
// sql: Requete SQL
// bindings: Tableau de valeurs
// Renvoie une promise
WebSqlPrd.prototype.exec = function( sql, bindings )
{
    // Cree un objet de gestion de traitement asynchrone
    var defered = this.$q.defer() ;

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
WebSqlPrd.prototype.select = function( sql, bindings, arrayForRows )
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

// Definit la registerWebSqlPrdModule permettant d'enregistrer un nouveau module
// dont le nom est donné dans l'argument moduleName au sein d'AngularJs

function registerWebSqlPrdModule( moduleName, window, angular )
{
    // Créé et enrgistre une instance de module dans Angular
    var webSqlPrdModule = angular.module( moduleName, [] ) ;

    // Enregistre une fabrique au sein d'Angular qui créera et retournera 
    // une instance d'un provider WebSql.
    // Ajout par injection de l'argument $q référencant l'objet de gestion
    // des promise pour les traitements asynchrones
    webSqlPrdModule.provider( "webSqlPrd", [function WebSqlPrdProvider() 
    {
        var config = {
            dbName: "",
            dbVersion: "1",
            dbComment: "",
            dbSize: 1000000,
            initFct: null 
        } ;

        // Methode config du configurateur du provider permettant de préciser les parametres 
        // d'ouverture de la BD ainsi qu'une fonction d'initialisation prenant en argument
        // l'instance du provider
        this.config = function( dbName, dbVersion, dbComment, dbSize, initFct )
        {
            config.dbName = dbName ;
            config.dbVersion = dbVersion ;
            config.dbComment = dbComment ;
            config.dbSize = dbSize ;
            config.initFct = initFct ;            
        };

        // Attribut $get référence une fonction injectable fabrique
        // pour le provider (utilisé par Angular au moment de la première injection du provider) 
        // Le module $q est injecté en argument
        this.$get = [ "$q", function webSqlPrdFactory( $q )
        {
            // Cree et retourne une instance du provider. config fait référence à la variable
            // locale config définie au dessus. Cette dernière est conservée par closure
            return new WebSqlPrd( $q, config ) ;
        }] ;
    }]) ;
}

// Execute la fonction d'enregistrement du module dans Angular avec le
// nom webSqlPrdModule
registerWebSqlPrdModule( "webSqlPrdModule", window, window.angular ) ;
