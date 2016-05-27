
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
    db.transaction( function(t) 
    {
        // Envoie la requete SQL à WEBSQL
        t.executeSql( sql_ct, [], 
            function( t, results )
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
    // Compte le nombre de personnes dans la table Personnes
    //
    db.transaction( function(t) 
    {
        // Envoie la requete SQL à WEBSQL
        t.executeSql( "select count(*) as nb from Personnes", [], 
            function( t, results )
            {
                // Traitement du résultat en cas de succes
                // Si le nombre de personne est 0 alors insère un enregistrement 
                // si non pas.
                if( results.rows[0].nb == 0 )
                {
                    // Requete d'insertion
                    var sql_ins = "INSERT INTO Personnes( id, nom, prenom ) values( ?, ?, ? )" ;

                    // Tableau de valeur pour le data-binding
                    var values = [1, "DUPOND", "Charles"] ;
    
                    // Envoie la requete SQL à WEBSQL
                    t.executeSql( sql_ins, values, 
                        function( t, results )
                        {
                            // Traitement du résultat en cas de succes
                            console.log( "Insertion d'un enregistrement dans Personnes" ) ;
                        },
                        function( t, error )
                        {
                            // Traitement d'erreur en cas d'echec
                            alert( "Erreur code " + error.code + " " + error.message ) ;
                        }
                    ) ;
                }
                else console.log( "La table Personnes contient déjà des données, pas d'insertion effectuée" ) ;
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
 * Le controleur ajoute cette fois au scope l'attribut "lesPersonnes" dans lequel 
 * est copié la référence du tableau lesPersonnes chargé ci-dessus  
 */
app.controller( "PersonneController", ["$scope",function( $scope )
{
    // Création d'un tableau vide
    $scope.lesPersonnes = [] ;
    
    if( db )
    {
        // 
        // Recupere la liste des personnes
        //
        db.transaction( function(t) 
        {
            // Envoie la requete SQL à WEBSQL
            t.executeSql( "select * from Personnes", [], 
                function( t, results )
                {
                    // Copie les références des personnes dans le tableau lesPersonnes
                    // Ici on fait une copie car le tableau results.rows n'est utilisable
                    // directement pour un modèle de donnée.

                    for( var i=0; i< results.rows.length; i++ )
                    {
                        $scope.lesPersonnes.push( results.rows[i] ) ;
                    }
                    
                    // Demande à rafraichir les vues basées sur ce scope.
                    $scope.$digest() ;
                },
                function( t, error )
                {
                    // Traitement d'erreur en cas d'echec
                    alert( "Erreur code " + error.code + " " + error.message ) ;
                }
            );
        });                                        
    }    
}]);


