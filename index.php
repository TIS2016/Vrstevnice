<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="assets/css/bootstrap.min.css" rel="stylesheet">
<link href="assets/css/main.css" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<title>VRSTEVNICE</title>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
</head>
<body>

<div class="container">
 <div class="row">
	<div class="col-xs-12 menu">
		<div class="row">

      <div class="col-xs-12 text-center" id="alert_place" style="min-height: 50px; line-height: 50px;">

        <span id="status_text"><i class="fa fa-check" id="status"></i> Aplikácia Pripravená</span>

      </div>

			<div class="col-xs-12">

        <div class="row">

          <div class="col-xs-4">
						<button type="button" id ="options" class="btn btn-info"> Nastavenie </button>
<!-- 						<button type="button" id ="demo" class="btn btn-info"> Demo </button> -->
            <label class="btn btn-default btn-file">
              Browse <input type="file" name="file" id="file" style="display: none;"></input>
            </label>

          </div>

          <div class="col-xs-4">
              <p id="file_path"></p>
          </div>

          <div class="col-xs-4">

            <div class="btn-group pull-right" role="group" aria-label="...">														
              <button type="button" id="kresli" class="btn btn-success" disabled="disabled" onclick="makeMaps()">Vykresli</button>
              <button type="button" id="download" class="btn btn-default" disabled="disabled" onclick="location.href='\'+img+'\'">Stiahnúť mapu</button>
              <button type="button" id="render" class="btn btn-info" disabled="disabled" onclick="start3d()">Renderovať</button>
            </div>

          </div>

        </div>

			</div>

		</div>
	</div>
	<div class="col-xs-12">
		<div id="control">
		 <label>Rozostrenie <input class="form-control" type="text" id="blur" value='2' name="blur"> </input>   </label> 
		 <label>Výškový rozdiel <input class="form-control" type="text" id="heightDifference" value='500' name="heightDifference"> </input>  </label>
		 <div class="checkbox">
      <label><input id="chcekHeightmap" type="checkbox" value="">Zobraziť heightmap 1</label>
    </div>
		</div>
	
	
		

		<!--CANVAS FOR  HEIGHTMAP  -->
 		<canvas  id="map_2d" style="border:1px solid #d3d3d3;">
		Your browser does not support the HTML5 canvas tag.</canvas>
		
		<!--CANVAS FOR  HEIGHTMAP  -->
 		<canvas  id="heightmap" style="border:1px solid #d3d3d3;">
		Your browser does not support the HTML5 canvas tag.</canvas>


	</div>
	<div class=" hide col-xs-12">
		<!--3d threeJS object-->
		
			<canvas  id="rendermap">
		Your browser does not support the HTML5 canvas tag.</canvas>

	
</div>
	</div>

</body>

<script type="text/javascript">

  $("#file").change(function(){
    var filename = $('input[type=file]').val().split('\\').pop();
    $("#file_path").text( filename );

    $("#status_text").html("<i class='fa fa-refresh fa-spin'></i> Načítavam súbor");
    $("#status_text").css("color", "");

 });
</script>
<script type="text/javascript" src="assets/js/jquery-3.1.1.min.js"></script>
<script type="text/javascript" src="assets/ajax/upload.js"></script>
<script type="text/javascript" src="assets/js/main.js"></script>
<script type="text/javascript" src="assets/js/three.min.js"></script>
<script type="text/javascript" src="assets/js/OrbitControls.js"></script>
<script type="text/javascript" src="assets/js/3d.js"></script>

</html>
