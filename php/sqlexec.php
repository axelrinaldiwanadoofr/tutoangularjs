<?php
    header('Content-Type: text/html; charset=UTF-8') ;

    require_once( "config.php") ;

    $dbId = "" ;
    if( array_key_exists( "dbid", $_POST ) ) $dbId = $_POST["dbid"] ;
    else if( array_key_exists( "dbid", $_GET ) ) $dbId = $_GET["dbid"] ;
    
    $dbName = "" ;
    if( array_key_exists( "dbname", $_POST ) ) $dbName = $_POST["dbname"] ;
    else if( array_key_exists( "dbname", $_GET ) ) $dbName = $_GET["dbname"] ;

    $sql = "" ;
    if( array_key_exists( "sql", $_POST ) ) $sql = $_POST["sql"] ;
    else if( array_key_exists( "sql", $_GET ) ) $sql = $_GET["sql"] ;
    
    $fields = "" ;
    if( array_key_exists( "fields", $_POST ) ) $fields = $_POST["fields"] ;
    else if( array_key_exists( "fields", $_GET ) ) $fields = $_GET["fields"] ;
    $values = explode( ",", $fields ) ;

    $queryid = "" ;
    if( array_key_exists( "queryid", $_POST ) ) $sql = $_POST["queryid"] ;
    else if( array_key_exists( "queryid", $_GET ) ) $sql = $_GET["queryid"] ;

    echo "{\"sql\":\"" . $sql . "\"";

    try
    {
        $db = new PDO( 'mysql:host=' . $config["db_host"] . ';dbname=' . $dbName, $config["db_usr"], $config["db_pwd"] );

        $db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ) ;

        if( $sql != "" )
        {                
            if( strtoupper( substr( $sql, 0, 6) ) == "SELECT" )
            {
                $cursor = $db->prepare( $sql );
                if( $cursor->execute( $values ) ) 
                {
                    $firstrow = true ;
                    echo ", \"rows\":[" ;

                    while( $row = $cursor->fetch() ) 
                    {
                        if( $firstrow ) echo "{" ;
                        else echo ",{" ;

                        $firstfield = true ;

                        foreach( $row as $name=>$value )
                        {
                            //$value = json_encode($value);
                            $value = utf8_encode($value) ;
                            $value = str_replace('<virg>', ',', $value ) ;
                            $value = str_replace('<dieze>', '#', $value ) ;
                            $value = str_replace('<dblcote>', '\"', $value ) ;
                            $value = str_replace('<cote>', '\'', $value ) ;
                            $value = str_replace('<etcom>', '&', $value ) ;
                            if( !is_numeric($name) )
                            {
                                if( $firstfield ) echo "\"$name\":\"$value\"" ;
                                else echo ",\"$name\":\"$value\"" ;
                                $firstfield = false ;
                            }
                        }
                        echo "}" ;
                        $firstrow = false ;
                    }
                    echo "],\"error\":null}" ;
                }
            }
            else
            {
                foreach($values as $name => $value) 
                {
                    $value = str_replace("'", "<cote>", $value ) ;
                    $value = str_replace('"', '<dblcote>', $value ) ;
                    $values[$name] = utf8_decode($value) ;
                }
                $cursor = $db->prepare( $sql );
                if( $cursor->execute( $values ) ) 
                {
                    echo ",\"error\":null}" ;
                }
                
                // Log transaction
                echo "dbId: " . $dbId ;
                if( $dbId != "" )
                {
                    $v = array( "$dbId", "$sql", "$fields") ;
                    $cursor = $db->prepare( "insert into reptransactions(dbid,sqlstr,valuesstr) values(?,?,?)") ;
                    if( $cursor->execute( $v ) ) 
                    {
                        echo ",\"error\":null}" ;
                    }
                }
            }
        }
        else 
        {
            echo ",\"error\":\"argument sql non renseigne.\"}" ;
        }
    }
    catch (PDOException $e) 
    {
        echo ",\"error\":\"". $e->getMessage() . "\"}" ;
        die();
    }    
?>

