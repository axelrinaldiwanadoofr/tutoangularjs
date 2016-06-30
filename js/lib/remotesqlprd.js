/***********************************************************************************************
 * @name remotesqlprd
 * @description
 * AngularJS service to acces to local WebSQL database
 * @version 1.0
 * @author Axel Rinaldi 01/04/2016
 ***********************************************************************************************/

/*
 * @class Class RemoteSqlPrd: provider pour acceder à WebSqlPrd
 * @constructor
 * @param {Factory $q de Angular} $q 
 * @param {Object} config: Objet contenant les parametres d'ouverture de la BD
 *      remoteDbUrl URL of WebService to access to database 
 *      remoteScript Name of script to exec for WebService 
 *      dbName Name of the database
 *      initFct: Référence d'une fonction prenant comme argument l'instance de WebSqlPrd pour initialisation.
 *                          
 */
function RemoteSqlPrd( $http, config )
{
    // Enregistre les données de configuration
    this.remoteDbUrl = config.remoteDbUrl ;
    if( config.remoteScript ) this.remoteScript = config.remoteScript ;
    else this.remoteScript = "php/sqlexec.php" ;
    this.dbName = config.dbName ;
    if( dbId ) this.dbId = config.dbId ;
    else this.dbId = "" ;
    this.$http = $http ;
    
    // Si initFct contient une référence de fonction d'initialisation alors lance la fonction
    if( config.initFct ) config.initFct( this ) ;
}


// La classe RemoteSqlPrd heritage de la classe SqlPrd
RemoteSqlPrd.prototype = new SqlPrd ;

/**
  * @ngdoc methode
  * @name createUrl
  * @param {string} sql SQL request
  * @param {array} pk Array of field names of primary key
  * @return {array} array object with values
  * @return {object} return a promise
  * @description
  * Génère et retourne l'URL à envoyer au WEB service 
  */

RemoteSqlPrd.prototype.createUrl = function( sql, pk, values )
{
    // Recupere le type de requete SELECT, UPDATE, DELETE ou INSERT
    
    if( this.remoteDbUrl )  var url = this.remoteDbUrl + "/" + this.remoteScript + "?dbname=" + this.dbName + "&dbid=" + this.dbId + "&sql=" + sql ;
    else  var url = this.remoteScript + "?dbname=" + this.dbName + "&dbid=" + this.dbId + "&sql=" + sql ;
    
    var sqlType = this.getTypeOfSqlStatement( sql ) ;
    var value ;
    var first = true ;
    
    // Ajoute dans l'URL les valeurs des attributs de l'objet reférencé par values sous forme d'argument
    if( values && ( sqlType == this.SELECT || sqlType == this.UPDATE || sqlType == this.INSERT ) )
    {
        if( first ) url += "&fields=" ;
        for( var i in values )        
        {
            if( values[i] )
            {
                value = values[i] ;
                
                // Remplace le caractères qui posent problème dans l'URL
                if( typeof value == "string" )
                {
                    value = value.replace( /&/g, "<etcom>") ;
                    value = value.replace( /,/g, "<virg>") ;
                    value = value.replace( /#/g, "<dieze>") ;
                }
                if( first ) url += value ; 
                else url += "," + value ; 
                first = false ;
            }
            else
            {
                if( first ) url += "null" ; 
                else url += "," + "null" ; 
                first = false ;            
            }
        }
    }
    
    // Ajoute sous forme d'argument dans l'URL les valeurs des attributs de l'objet reférencé par values 
    // qui sont mentionnés par le tableau pk
    if( pk && ( sqlType == this.DELETE || sqlType == this.UPDATE ) )
    {
        if( first ) url += "&fields=" ;
        
        for( var i=0 ; i<pk.length ; i++ )
        {
            if( values[pk[i]] )
            {
                value = values[pk[i]] ;

                // Remplace le caractères qui posent problème dans l'URL
                if( typeof value == "string" )
                {
                    value = value.replace( /&/g, "<etcom>") ;
                    value = value.replace( /,/g, "<virg>") ;
                    value = value.replace( /#/g, "<dieze>") ;
                }
                if( first ) url += value ; 
                else url += "," + value ; 
                first = false ;
            }
            else
            {
                if( first ) url += "null" ; 
                else url += "," + "null" ; 
                first = false ;            
            }
        }           
    }
    return url ;
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
RemoteSqlPrd.prototype.createTable = function( tableName, fields )
{
    var sql = this.createSqlCreateTableStatement( tableName, fields ) ;
    var url = this.createUrl( sql, null, null ) ;
    
    // Envoie la requete vers le serveur WEB
    return this.$http.get( url ).then(function(response)
    {   if( response.data.sql )
        {
            response.data.url = url ;
            return response.data ;
        }
        else
        {
            alert( response.data ) ;
        }
    },function(error)
    {
        console.error( error ) ;
    });
} ;

/**
  * @ngdoc method
  * @name select
  * @param {string} sql SQL request
  * @param {array} bindings Array of values for bindings
  * @return {array} array populated with rows. Each row contain an objet with valuated attributes for each field in SQL select
  * @return {object} return a promise
  * @description
  * Execute a SQL request and return the result as an array of objects
  */

RemoteSqlPrd.prototype.select = function( sql, values, array )
{
    var url = this.createUrl( sql, null, values ) ;

    // Envoie la requete vers le serveur WEB
    return this.$http.get( url ).then(function(results)
    {
        if( results.data.rows )
        {
            if( array ) 
            {
                //Insere les lignes résultats dans le tableau array
                for (i = 0; i < results.data.rows.length; i++) 
                {
                    array.push(results.data.rows[i]) ;
                }                                
                return results ;
            }
            else return results.data ;
        }
        else alert( results.data ) ;         
    },function(error)
    {
        console.error( error ) ;
    });
};

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
RemoteSqlPrd.prototype.update = function( tableName, pk, row )
{
    var sql = this.createSqlUpdateStatement( tableName, pk, row ) ;
    var url = this.createUrl( sql, pk, row ) ;

    // Envoie la requete vers le serveur WEB
    return this.$http.get( url ).then(function(response)
    {
        if( response.data.sql )
        {
            response.data.url = url ;
            return response.data ;
        }
        else alert( response.data ) ;
    },function(error)
    {
        console.error( error ) ;
    });
};

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
RemoteSqlPrd.prototype.delete = function( tableName, pk, row )
{
    var sql = this.createSqlDeleteStatement( tableName, pk ) ;
    var url = this.createUrl( sql, pk, row ) ;

    // Envoie la requete vers le serveur WEB
    return this.$http.get( url ).then(function(response)
    {
        if( response.data.sql )
        {
            response.data.url = url ;
            return response.data ;
        }
        else alert( response.data ) ;
    },function(error)
    {
        console.error( error ) ;
    });
};

/**
  * @ngdoc method
  * @name insert
  * @param {string} tableName SQL name of the table
  * @param {object} row Object witch each attribute content a value for table's field. 
  * @return {object} return a promise
  * @description
  * Insert a new record
  */
RemoteSqlPrd.prototype.insert = function( tableName, row )
{
    var sql = this.createSqlInsertStatement( tableName, row ) ;
    var url = this.createUrl( sql, null, row ) ;
            
    // Envoie la requete vers le serveur WEB
    return this.$http.get( url ).then(function(response)
    {
        if( response.data.sql )
        {
            response.data.url = url ;
            return response.data ;
        }
        else alert( response.data ) ;
    },function(error)
    {
        console.error( error ) ;
    });
};

// Definit la registerRemoteSqlPrdPrdModule permettant d'enregistrer un nouveau module
// dont le nom est donné dans l'argument moduleName au sein d'AngularJs
// L'argument providerName contient le nom du provider qui devra être utilisé
// dans l'injection d'argument
function registerRemoteSqlPrdModule( moduleName, providerName, window, angular )
{
    // Créé et enrgistre une instance de module dans Angular
    var remoteSqlPrdModule = angular.module( moduleName, [] ) ;

    // Enregistre une fabrique au sein d'Angular qui créera et retournera 
    // une instance d'un provider RemoteSqlPrd.
    // Ajout par injection de l'argument $q référencant l'objet de gestion
    // des promise pour les traitements asynchrones
    remoteSqlPrdModule.provider( providerName, [function RemoteSqlPrdProvider() 
    {
        var config = {
            remoteDbUrl: "",
            dbName: "",
            dbId:"",
            remoteScript: null,
            initFct: null 
        } ;

        // Methode config du configurateur du provider permettant de préciser les parametres 
        // d'ouverture de la BD ainsi qu'une fonction d'initialisation prenant en argument
        // l'instance du provider
        this.config = function( remoteDbUrl, dbName, dbId, remoteScript, initFct )
        {
            config.dbName = dbName ;
            config.remoteDbUrl = remoteDbUrl ;
            config.dbId = dbId ;
            config.remoteScript = remoteScript ;
            config.initFct = initFct ;            
        };

        // Attribut $get référence une fonction injectable fabrique
        // pour le provider (utilisé par Angular au moment de la première injection du provider) 
        // Le module $q est injecté en argument
        this.$get = [ "$http", function remoteSqlPrdFactory( $http )
        {
            // Cree et retourne une instance du provider. config fait référence à la variable
            // locale config définie au dessus. Cette dernière est conservée par closure
            return new RemoteSqlPrd( $q, config ) ;
        }] ;
    }]) ;
}

// Execute la fonction d'enregistrement du module dans Angular avec le
// nom webSqlPrdModule
registerRemoteSqlPrdModule( "remoteSqlPrdModule", "sqlPrd", window, window.angular ) ;
