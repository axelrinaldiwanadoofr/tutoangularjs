
/*
* Demarrage d'AngularJS
*
* Appel de la méthode "module" de l'objet Angular référencé par la variable globale
* angular. Cette méthode crée un objet associée à notre application (cf directive ng-app placé dans la 
* balise <html> du code HTML) et renvoie sa référence que l'on copie dans la variable app
*/
var app = angular.module( 'MonApp', [] ) ;

/*
 * Création du controleur de donnée "PersonneController" qui crée un modèle de données
 * pour une personne dans le scope. 
 * 
 *  Appel de la méthode "controller" de l'objet référencé par la variable "app" pour créer et enregistrer
 *  le controleur de donnée "PersonneController". Cette méthode est appellée avec deux valeurs argumentaires,
 *  la première est le nom du controlleur que l'on crée et le deuxième est la référence d'une fonction 
 *  anonyme dont le code est donné juste en dessous entre les deux { }. Cette manière de passer une fonction
 *  et son code en valeur argumentaire d'une autre fonction ou méthode est appelée fonction Lambda. JavaScript et
 *  C++ sont les rares langages de programmation autorisant cette manière de coder très puissante.
 *  
 *  La fonction passée en argument sera appelée par AngularJS quand il compilera la directive "ng-controller"
 *  de la balise <article>. Ce dernier transmet, au travers de la variable argumentaire "$scope", 
 *  à la fonction la référence d'un objet appellé "scope" qui définira le modèle de donnée contenant les
 *  information de la personne Paul Meyer.
 *  
 *  La fonction ajoute au scope l'attribut "personne" dans lequel elle copie la référence de l'objet
 *  {id: 1, nom: "Meyer", prenom: "Paul" } créé à la volée au format JSON. Ce dernier possède trois attributs: 
 *  "id" qui contient l'identifiant de la personne, "nom" qui contient le nom de la personne et "prenom" 
 *  qui contient le prénom de la personne.
 *  
<<<<<<< HEAD
 *   Ajout du champ dateNaissance référencant un objet contenant les données d'une date de naissance.
 *   Ce dernier est constitué des champs jour, mois et annee   
=======
 *  Ajout du champ booleen "masculin"
>>>>>>> v1.1_ajout_champ_sexe
 *    
 */
app.controller( "PersonneController", function( $scope )
{
    $scope.personne = {
        id: 1, 
        nom: "Meyer", 
        prenom: "Paul",
       dateNaissance: {
            jour: 10,
            mois: 2,
            annee: 1995
        },        
        masculin: true 
    } ;
    
    // Ajoute à l'objet référencé par l'attribut "personne" du scope la méthode
    // getAge qui calcule et renvoie l'age de la personne à partir de sa date de naissance
    $scope.personne.getAge = function()
    {
        // Récupère la date de naissance sous la forme d'un objet de type Date
        var dateNaissance = new Date( this.dateNaissance.annee, this.dateNaissance.mois, this.dateNaissance.jour ) ;
        
        // Soustrait la date de naissance à la date du jour et récupère une durée en ms
        var ageEnMs = Date.now() - dateNaissance ;
        
        // Renvoie la durée convertie en année.
        return Math.round( ageEnMs/(365*24*3600000)) ;
    }
});


