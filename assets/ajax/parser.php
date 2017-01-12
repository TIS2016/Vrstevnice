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

        $result_contour = $xpath->query("//symbols");
        if ($result_contour->length === 0) {
          throw new Exception("Chýbajúce základné symboly!");
        }

        $contour;
        $index_contour;
        $line;

        for ($i=0; $i < $result_contour->length; $i++) {
            $coordsNodeList = $xpath->query("./symbol", $result_contour->item($i));
            for ($j=0; $j < $coordsNodeList->length; $j++) {
              $coordNodeAttributes = $coordsNodeList->item($j)->attributes;
              if($coordNodeAttributes->getNamedItem("code")->nodeValue == "101.0"){
                  $contour = $coordNodeAttributes->getNamedItem("id")->nodeValue;
              }elseif ($coordNodeAttributes->getNamedItem("code")->nodeValue == "102.0") {
                  $index_contour = $coordNodeAttributes->getNamedItem("id")->nodeValue;
              }elseif ($coordNodeAttributes->getNamedItem("code")->nodeValue == "704.0") {
                  $line = $coordNodeAttributes->getNamedItem("id")->nodeValue;
              }
            }
        }

        //get all part objects and for each check if the boolean representation of its roatation attribute value is equal to 0 (false), which means it doesn't contain that attribute.
        $result = $xpath->query("//parts/part/objects/object[boolean(@rotation)=0 and (@symbol=".$contour." or @symbol=".$index_contour.")]/coords");
        if ($result->length === 0) {
                  throw new Exception("V súbore sa nenachádzajú Vrstevnice!");
                }
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

        $result_border = $xpath->query("//parts/part/objects/object[boolean(@rotation)=0 and @symbol=".$line."]/coords");
        if ($result_border->length === 0) {
                  throw new Exception("V súbore sa nenachádza ohraničenie!");
                }
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
try {
  echo json_encode((new XMLCoordsParser())->parse($_FILES['file']['tmp_name']));
} catch (Exception $e) {
  header('HTTP/1.1 400 Bad Request');
 header('Content-type: text/plain');
 exit($e->getMessage());
}
?>
