


function Toto( age )
{
    age++ ;
}

Toto( 23 ) ;

var f = Toto ;

f( 23 ) ;

function Titi( fct )
{
    fct( 27 ) ;
}

Titi( Toto ) ;

Titi( f ) ;

Titi( function( valeur)
{
    console.log( valeur + 1) ;
});

function Tata( valeur )
{
    var ageDuCapitaine = valeur + 1 ;
    
    setTimeout( function()
    {
        alert( ageDuCapitaine ) ;
    }, 1000 ) ;
}

Tata( 36 ) ;
Tata( 57 ) ;