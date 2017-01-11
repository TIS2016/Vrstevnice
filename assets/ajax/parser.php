<?php
class Part{
    public $coords;
    function __construct(){
        $this->coords = array();
    }
    function addCoordinate(Coord $coord){
        $this->coords[] = $coord;
    }
}

class Coord{
    public $x;
    public $y;
    public $flags;
}

class XMLCoordsParser{

    function parse($cesta){

        $cesta_suboru = file_get_contents($cesta);

        $doc = new DOMDocument();
        $doc->loadHTML($cesta_suboru);

        $xpath = new DOMXPath($doc);

        //get all part objects and for each check if the boolean representation of its roatation attribute value is equal to 0 (false), which means it doesn't contain that attribute.
        $result = $xpath->query("//parts/part/objects/object[boolean(@rotation)=0 and (@symbol=157 or @symbol=158 or @symbol=0 or @symbol=1)]/coords");

        $allParts = array();

        // Vrstevnice

        for($i = 0; $i < $result->length; $i++){
            $newPart = new Part(); // jednotlive Vrstevnice

            // using the "./" means we start under the given node, which is <coords> tag
            $coordsNodeList = $xpath->query("./coord", $result->item($i));

            for($j = 0; $j < $coordsNodeList->length; $j++){
                $newCoord = new Coord();
                $coordNodeAttributes = $coordsNodeList->item($j)->attributes;

                if($x = $coordNodeAttributes->getNamedItem("x")){
                    $newCoord->x = $x->nodeValue;
                }

                if($y = $coordNodeAttributes->getNamedItem("y")){
                    $newCoord->y = $y->nodeValue;
                }

                if($flags = $coordNodeAttributes->getNamedItem("flags")){
                    $newCoord->flags = $flags->nodeValue;
                }

                $newPart->addCoordinate($newCoord);
            }
            $allParts[] = $newPart;
        }

        // Oramovanie

        $result_border = $xpath->query("//parts/part/objects/object[boolean(@rotation)=0 and @symbol=132]/coords");

        $border = array();

        for($i = 0; $i < $result_border->length; $i++){
            $newPart = new Part(); // jednotlive Vrstevnice

            // using the "./" means we start under the given node, which is <coords> tag
            $coordsNodeList = $xpath->query("./coord", $result_border->item($i));

            for($j = 0; $j < $coordsNodeList->length; $j++){
                $newCoord = new Coord();
                $coordNodeAttributes = $coordsNodeList->item($j)->attributes;

                if($x = $coordNodeAttributes->getNamedItem("x")){
                    $newCoord->x = $x->nodeValue;
                }

                if($y = $coordNodeAttributes->getNamedItem("y")){
                    $newCoord->y = $y->nodeValue;
                }

                if($flags = $coordNodeAttributes->getNamedItem("flags")){
                    $newCoord->flags = $flags->nodeValue;
                }

                $newPart->addCoordinate($newCoord);
            }
            $border[] = $newPart;
        }

        return array ($allParts, $border);
    }
}

libxml_use_internal_errors(true);
echo json_encode((new XMLCoordsParser())->parse($_FILES['file']['tmp_name']));
?>
