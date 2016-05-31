


// Traitement asynchrone avec un delais d'une seconde
setTimeout( function()
{
    alert( "T: 1s") ;
    
    setTimeout( function()
    {
        alert( "T: 2s") ;
        
        setTimeout( function()
        {
            alert( "T: 1.5 s") ;
        }, 1500 ) ;
    }, 2000 ) ;
}, 1000 ) ;