/***********************************************************************************************
 * @name websqlprd
 * @description
 * AngularJS service to acces to local WebSQL database
 * @version 1.0
 * @author Axel Rinaldi 01/04/2016
 ***********************************************************************************************/

/*
 * @class Class WebSqlPrd: provider pour acceder à WebSqlPrd
 * @constructor
 * @param {Factory $q de Angular} $q 
 * @param {Object} config: Objet contenant les parametres d'ouverture de la BD
 *      dbName: Nom de la BD
 *      dbVersion: Version de la BD
 *      dbComment: Commentaire
 *      dbSise: Taille en octet de la BD
 *      initFct: Référence d'une fonction prenant comme argument l'instance de WebSqlPrd pour initialisation.
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

// La classe WebSqlPrd hérite de la classe SqlPrd
WebSqlPrd.prototype = new SqlPrd ;


/**
  * @ngdoc method
  * @name WebSqlPrd.execSql
  * @param {string} sql SQL request
  * @param {array} sql array of SQL string request
  * @return {object} return promise
  * @description
  * Execute a SQL request or a array of SQL request
  */
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
    
/**
  * @ngdoc method
  * @name select
  * @param {string} sql SQL request
  * @param {array} bindings Array of values for bindings
  * @return {array} arrayForRows populated with rows. 
  * Each row contain an objet with valuated attributes for each field in SQL select
  * @return {object} return a promise
  * @description
  * Execute a SQL request and return the result as an array of objects
  * Execute une requete SQL et place le résultat dans le tableau donné
  * dans l'argument arrayForRows
  * Retourne une promise 
  */
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

/**
  * @ngdoc method
  * @name createTable
  * @param {string} tableName SQL name of the table
  * @param {object} fields Object witch each attribute is a table's field. 
  * @return {object} return a promise
  * @description
  * Create a new table if not exist
  */
WebSqlPrd.prototype.createTable = function( tableName, fields )
{
    var sql = this.createSqlCreateTableStatement( tableName, fields ) ;
    return this.exec( sql, [] ) ;
} ;

/**
  * @ngdoc method
  * @name insert
  * @param {string} tableName SQL name of the table
  * @param {object} row Object witch each attribute content a value for table's field. 
  * @return {object} return a promise
  * @description
  * Insert a new record
  */
WebSqlPrd.prototype.insert = function( tableName, row )
{
    var sql = this.createSqlInsertStatement( tableName, row ) ;

    // Liste des valeurs de bindings
    var bindings = [] ;
    for( var fieldName in row )
    {
        bindings.push( row[fieldName] ) ;
    }
    return this.exec( sql, bindings ) ;
} ;

/**
  * @ngdoc method
  * @name update
  * @param {string} tableName SQL name of the table
  * @param {object} row Object witch each attribute content a value for table's field. 
  * @param {object} pk array witch each case content field name of primary key. 
  * @return {object} return a promise
  * @description
  * Update a record
  */
WebSqlPrd.prototype.update = function( tableName, pk, row )
{
    var sql = this.createSqlUpdateStatement( tableName, pk, row ) ;

    // Liste des valeurs de bindings
    var bindings = [] ;

    // Valeurs de mise a jour
    for( var fieldName in row )
    {
        bindings.push( row[fieldName] ) ;
    }

    // Valeurs de la cle primaire
    for( var i=0 ; i<pk.length ; i++ )
    {
        bindings.push( row[pk[i]] ) ;
    }
    return this.exec( sql, bindings ) ;
} ;

/**
  * @ngdoc method
  * @name delete
  * @param {string} tableName SQL name of the table
  * @param {object} row Object witch each attribute content a value for table's field. 
  * @param {object} pk array witch each case content field name of primary key. 
  * @return {object} return a promise
  * @description
  * Delete a record
  */
WebSqlPrd.prototype.delete = function( tableName, pk, row )
{
    var sql = this.createSqlDeleteStatement( tableName, pk ) ;

    // Liste des valeurs de bindings
    var bindings = [] ;

    // Valeurs de la cle primaire
    for( var i=0 ; i<pk.length ; i++ )
    {
        bindings.push( row[pk[i]] ) ;
    }
    return this.exec( sql, bindings ) ;
} ;
            

// Definit la registerWebSqlPrdPrdModule permettant d'enregistrer un nouveau module
// dont le nom est donné dans l'argument moduleName au sein d'AngularJs
// L'argument providerName contient le nom du provider qui devra être utilisé
// dans l'injection d'argument
function registerWebSqlPrdModule( moduleName, providerName, window, angular )
{
    // Créé et enrgistre une instance de module dans Angular
    var webSqlPrdModule = angular.module( moduleName, [] ) ;

    // Enregistre une fabrique au sein d'Angular qui créera et retournera 
    // une instance d'un provider WebSqlPrd.
    // Ajout par injection de l'argument $q référencant l'objet de gestion
    // des promise pour les traitements asynchrones
    webSqlPrdModule.provider( providerName, [function WebSqlPrdProvider() 
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
registerWebSqlPrdModule( "webSqlPrdModule", "sqlPrd", window, window.angular ) ;
