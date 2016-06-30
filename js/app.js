
/*
* Demarrage d'AngularJS
*
* Appel de la méthode "module" de l'objet Angular référencé par la variable globale
* angular. Cette méthode crée un objet associée à notre application (cf directive ng-app placé dans la 
* balise <html> du code HTML) et renvoie sa référence que l'on copie dans la variable app
* 
* Demande à charger le module "ngRoute" de routage de page
* ainsi que le module webSqlPrdModule pour l'acces a WebSql
*/
var app = angular.module( 'MonApp', ["ngRoute","webSqlPrdModule"] ) ;

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
        templateUrl: 'view/vwListeDePersonnes.html',
        // Déplace ici la référence au controller afin que ce dernier soit reexécuté au retour de navigation
        // vers la liste
        controller: "LesPersonnesController" 
        });
        
    // Route pour accéder à la vue d'une personne vwUnePersonne.html à partir d'un 
    // lien hypertext sur la liste
    $routeProvider.when( '/list/personne/:personneId', {
        templateUrl: 'view/vwUnePersonne.html',
        controller: 'PersonneController' });
        
    // Route pour accéder au formulaire d'une personne frmUnePersonne.html à partir d'un 
    // lien hypertext sur une personne
    $routeProvider.when( '/list/personne/edit/:personneId', {
        templateUrl: 'view/frmUnePersonne.html',
        controller: 'PersonneController' });
        
    $routeProvider.otherwise( {redirectTo: '/list'} ) ;
}]);

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
app.controller( "LesPersonnesController", ["$scope","sqlPrd",function( $scope, sqlPrd )
{
    // Création d'un tableau vide
    $scope.lesPersonnes = [] ;
    
    // 
    // Recupere la liste des personnes
    //
    sqlPrd.select( "select * from Personnes", [], $scope.lesPersonnes ) ;
}]);

/*
 * Création du controleur de donnée "PersonneController" qui crée un modèle de données
 * pour une personne dans le scope. Ce controlleur récupère par injection la référence de l'objet contenu
 * dans la variable $routeParams définie dans le module "ngRoute" de AngularJS en plus de la référence au scope. 
 * Cet objet contient les paramètres transmis par le lien hyper-text "détail", ici l'identifiant de la personne.
 * 
 *  Le controlleur ajoute au scope l'attribut "personne" dans lequel elle copie la référence de l'objet contenant
 *  les données de la personne sur laquelle l'utilisateur a cliquée.  
 */
app.controller( "PersonneController", ["$scope","$routeParams","sqlPrd",function($scope, $routeParams, sqlPrd)
{
    // Ajoute au nouveau scope fils l'attribut "personne" avec la référence de la personne
    // stockée dans la case du tableau "lesPersonnes" sélectionnée
    // Cherche les données de la personne
    sqlPrd.select( "select * from personnes where id=?", [$routeParams.personneId] ).then( function( results )
    {
        $scope.personne = results.rows[0] ;
    }) ;

    // Méthode save pour enregistrer les modification d'une personne dans la base de donnée    
    $scope.save = function()
    {
        return sqlPrd.update( "Personnes", ["id"], this.personne ).then( function( results )
        {
            // Revient à la page précédente
            history.back() ;
        }) ;
    }
    
}]);

