
/*
 * Classe Promise pour la gestion des traitements asynchrones
 * Une promise est un noeud dans une chaine de traitements asynchrones.
 * Elle peut gérer un traitement dans le cas d'un succes et un traitement
 * en cas d'erreur. Une promise est chaînée à la promise du traitement
 * suivant.
 * 
 * Constructeur par défaut
 */
function Promise()
{
    this.next = null ; // Référence de la promise suivante (traitement suivant)
    this.onSuccesFct = null ; // Réference de la fonction à exécuter en cas de succes
    this.onRejectFct = null ; // Référence de la fonction à exécuter en cas d'echec
    this.defered = null ; // Enregistre la référence du defered servant a la construction de la chaine de traitement
}

/*
 * Méthode ajoutant un traitement à la chaine de traitement
 *  onSuccesFct: Référence d'une fonction à exécuter en cas de succes
 *  onRejectFct: Référence de la fonction à exécuter en cas d'echec. Peut être null ou non renseignée
 *  Renvoie la référence d'une nouvelle promise pour le traitement suivant
 */
Promise.prototype.then = function( onSuccesFct, onRejectFct )
{
    this.onSuccesFct = onSuccesFct ;
    this.onRejectFct = onRejectFct ;
    this.defered = Defered.prototype.currentDeferedInstance ; // Enregistre la référence du defered
    this.next = new Promise( this ) ;
    return this.next ;
};

/*
 * Méthode supprimant le chaînage des promises ainsi que toutes leurs référence
 * pour permettre au GC de libérer les objets.
 */
Promise.prototype.removeAllNextLink = function()
{
    // Parcours de la chaine des promises et mise à null des liens sur l'attribut next.
    var p = this ;
    var n = this.next ;
        
    while( n )
    {
        p.defered = null ;
        p.next = null ;
        p = n ;
        n = p.next ;
    }
}

/*
 * Appel de la fonction référencée par l'attribut onSuccesFct
 * Renvoie la valeur renvoyée par cette dernière
 */
Promise.prototype.resolve = function( value )
{
    if( this.onSuccesFct ) 
    {
        // Sauvegarde le defered courant et retabli le defered ayant servi 
        // à créer la chaine de traitement
        var cdefered = Defered.prototype.currentDeferedInstance ;
        Defered.prototype.currentDeferedInstance = this.defered ;
        // Appel du calback
        var result = this.onSuccesFct( value ) ;
        // Retabli le defered courant
        Defered.prototype.currentDeferedInstance = cdefered ;
        return result ;
    }
    return null ;
};

/*
 * Appel de la fonction référencée par l'attribut onRejectFct
 * Renvoie la valeur renvoyée par cette dernière
 */
Promise.prototype.reject = function( error )
{
    if( this.onRejectFct ) 
    {
        // Sauvegarde le defered courant et retabli le defered ayant servi 
        // à créer la chaine de traitement
        var cdefered = Defered.prototype.currentDeferedInstance ;
        Defered.prototype.currentDeferedInstance = this.defered ;
        // Appel du calback
        var result = this.onRejectFct( error ) ;
        // Retabli le defered courant
        Defered.prototype.currentDeferedInstance = cdefered ;
        return result ;
    }
    return null ;
};

/*
 * Classe d'entête pour le stockage d'une chaîne de traitement asynchrone.
 * Une instance de la classe Defered offre une interface conviviale pour la création
 * d'une chaîne de traitement. 
 * Elle gère aussi son exécution au travers des traitements asynchrones. 
 * L'attribut firstPromise contient la référence de la première promise de la
 * chaine.
 * L'attribut promise stocke la promise courante
 * 
 * Cette classe et une classe amie de Promise.
 * 
 * Constructeur par défaut. Crée une première promise
 */
function Defered()
{
    this.promise = new Promise( null ) ;
    this.firstPromise = this.promise ;
}

/*
 * Attribut de classe stockant la référence de l'instance courante afin de faciliter
 * la constitution d'une chaîne de traitement
 */
Defered.prototype.currentDeferedInstance = null ;

/*
 * Renvoie l'instance de Defered en cours de construction d'une chaîne de traitement
 * Si aucune chaîne n'est en cours de construction alors crée une instance de Defered 
 * Une valeur true dans l'arguement forceCreateNew permet de forcer la création 
 * d'une nouvelle chaîne de traitement. Si non renseigné, valeur par défaut: false
 */
Defered.prototype.createDefered = function( forceCreateNew )
{
    if( !Defered.prototype.currentDeferedInstance || forceCreateNew ) 
        Defered.prototype.currentDeferedInstance = new Defered() ;
    return Defered.prototype.currentDeferedInstance ;    
};

/*
 * Marque la fin de construction d'une chaine de traitement
 * Libère l'ancienne instance de Defered et prépare pour la création
 * d'une nouvelle. 
 */
Defered.prototype.endDefered = function()
{
    Defered.prototype.currentDeferedInstance = null ;
};

/*
 * Méthode appelée par le calback du traitement asynchrone pour lancer l'exécution
 * du noeud courant de traintement dans le cas du succes et passe à la promise suivante
 * En fin de traitement, la chaîne des promises est supprimée.
 */
Defered.prototype.resolve = function( value )
{
    if( this.promise )
    {
        // Appelle la méthode resolve de la promise courante
        value = this.promise.resolve( value ) ;
        
        if( this.promise.next ) 
        {
            // Passe a la promise suivante
            this.promise = this.promise.next ;
            
            // Detecte la dernière promise
            if( !this.promise.next )
            {
                // Supprime la chaine de promise
                this.firstPromise.removeAllNextLink() ;
                this.firstPromise = null ;
                this.promise = null ;
            }
        }
    }
};

/*
 * Méthode appelée par le calback du traitement asynchrone pour lancer l'exécution
 * du noeud courant de traintement dans le cas d'un echec. 
 * Le traitement s'arrete à ce noeud et la chaîne des promises est supprimée.
 */
Defered.prototype.reject = function( error )
{
    if( this.promise )
    {
        // Appelle la méthode reject de la promise courante
        value = this.promise.reject( value ) ;
        
        // Supprime la chaine de promise
        this.firstPromise.removeAllNextLink() ;
        this.firstPromise = null ;
        this.promise = null ;
    }
};

/*
 * Objet singleton référencé dans la variable globale $q
 * Cet objet offre une interface d'utilisation du gestionnaire
 * de traitement asynchrone
 */

var $q = {
    
    // Méthode permettant de récupérer l'instance courante de Defered. 
    // Si aucune chaîne de traitement n'est en cour de création alors 
    // crée une nouvelle instance.
    // Une valeur true dans l'arguement forceCreateNew permet de forcer la création 
    // d'une nouvelle chaîne de traitement. Si non renseigné, valeur par défaut: false
    defer: function( forceCreateNew )
    {
        return Defered.prototype.createDefered( forceCreateNew ) ;
    },
    
    // Méthode permettant de spécifier la fin de construction d'une chaine de traitement
    end: function()
    {
        Defered.prototype.endDefered() ;
    }
}

// Fonction setTimeout encapsulée pour une chaîne de traitement
// asynchrone avec promise
function $setTimeout( time )
{
    var defered = $q.defer() ;
    
    setTimeout( function()
    {
        defered.resolve( "T" ) ;
    }, time );
    
    return defered.promise ;
}


// Construction d'une chaine de traitement

var defered = $q.defer() ;

var promise1 = $setTimeout( 1000 ) ;

var promise2 = promise1.then( function( value )
{
    console.log( value + " + 1s" ) ;
    $setTimeout( 2000 ) ;
}) ;

promise2.then( function( value )
{
   console.log( value + " + 3s" ) ; 
   $setTimeout( 500 ) ;
}).then( function( value )
{
    console.log( value + " + 3.5s" ) ;
});

$q.end() ;