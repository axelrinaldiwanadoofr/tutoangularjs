
/*
* Demarrage d'AngularJS
*
* Appel de la méthode "module" de l'objet Angular référencé par la variable globale
* angular. Cette méthode crée un objet associée à notre application (cf directive ng-app placé dans la 
* balise <html> du code HTML) et renvoie sa référence que l'on copie dans la variable app
*/
var app = angular.module( 'MonApp', [] ) ;




/*
 * Test d'utilisation de WebSQL: 
 * - ouverture/creation d'une base de données
 * - creation de la table Personnes( id, nom, prenom ) 
 * - insertion de quelques occurences
 */

// Ouvre ou crée la base de données locale de type WEBSQL de nom MaBD
// version n°1 et d'une taille de 1Mo
var db = openDatabase( "MaBD", "1", "Ceci est un commentaire", 1000000 ) ;

if( db )
{
    //
    // Cree la table Personnes
    //
    
    // Requete de creation de la table Personnes
    var sql_ct = "CREATE TABLE IF NOT EXISTS Personnes( id int, nom text, prenom text )" ;
    
    // Ouvre un cycle de transaction dans WEBSQL (Traitement asynchrone)
    this.db.transaction( function(t) 
    {
        // Envoie la requete SQL à WEBSQL
        t.executeSql( sql_ct, [], 
            function( results )
            {
                // Traitement du résultat en cas de succes
                console.log( "Table Personnes créée") ;
            },
            function( t, error )
            {
                // Traitement d'erreur en cas d'echec
                alert( "Erreur code " + error.code + " " + error.message ) ;
            }
        );
    });                                        
}

if( db )
{
    //
    // Insertion de Monsieur Charles DUPOND
    //
    
    // Requete d'insertion
    var sql_ins = "INSERT INTO Personnes( id, nom, prenom ) values( ?, ?, ? )" ;
    
    // Tableau de valeur pour le data-binding
    var values = [1, "DUPOND", "Charles"] ;
    
    // Ouvre un cycle de transaction dans WEBSQL (Traitement asynchrone)
    this.db.transaction( function(t) 
    {
        // Envoie la requete SQL à WEBSQL
        t.executeSql( sql_ins, values, 
            function( results )
            {
                // Traitement du résultat en cas de succes
                console.log( "Insertion effecuée correctement" ) ;
            },
            function( t, error )
            {
                // Traitement d'erreur en cas d'echec
                alert( "Erreur code " + error.code + " " + error.message ) ;
            }
        );
    });                                        
}


/*
 * Création du controleur de donnée "LesPersonnesController" qui crée un modèle de données
 * pour une collection de personnes stokée dans un tableau au sein du scope. 
 * 
 * Le controleur ajoute cette fois au scope l'attribut "lesPersonnes" dans lequel est copiée la référence d'un
 * tableau dont chaque case référence un objet contenant les données d'une personne.   
 *
 * Utilisation d'une forme minimisable d'injection d'argument pour le controleur.    
 */
app.controller( "PersonneController", ["$scope",function( $scope )
{
    $scope.lesPersonnes = [
        {id: 1, nom: "Meyer", prenom: "Paul" },
        {id: 2, nom: "Martin", prenom: "Enzo" },
        {id: 3, nom: "Dupond", prenom: "Pauline" },
        {id: 4, nom: "Duschmol", prenom: "Robert" }
    ];
}]);


