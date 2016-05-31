


// Traitement asynchrone avec un delais d'une seconde
setTimeout( function()
{
    alert( "T: 1s") ;
    
    setTimeout( function()
    {
        alert( "T: 2s") ;
    }, 2000 ) ;
}, 1000 ) ;