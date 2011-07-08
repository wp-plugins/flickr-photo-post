<?php  
$time = time ();

require_once ("phpFlickr-3.1/phpFlickr.php");
$f = new phpFlickr("50e4e0b1bf33041c0f443e3d67efcf6c");

if (isset ($_POST['flupdate']))
{
	$update = $_POST['flupdate'];
} else {
	$update = 0;
}

if (isset ($_POST['flposition']))
{
	if ($update > 0)
	{ 
		$pos = intval ($_POST['flposition']);
	} else {
		$pos = 1;
	}
} else {
	$pos = 1;
}
if (isset ($_POST['name']))
{
	$name = $_POST['name'];
	// TODO Security
} else {
	$name = "";
}
if (isset ($_POST['type']))
{
	$type = $_POST['type'];
	// TODO Security
} else {
	$type = "or";
}

$search = str_replace (" ", ",", $name);

if ($type = "and")
{
	$mode = "all";
} else {
	$mode = "any";
}

/*
<license id="1" name="Attribution-NonCommercial-ShareAlike License" 	url="http://creativecommons.org/licenses/by-nc-sa/2.0/" /> 
<license id="2" name="Attribution-NonCommercial License" 		url="http://creativecommons.org/licenses/by-nc/2.0/" /> 
<license id="3" name="Attribution-NonCommercial-NoDerivs License" 	url="http://creativecommons.org/licenses/by-nc-nd/2.0/" /> 
<license id="4" name="Attribution License" 				url="http://creativecommons.org/licenses/by/2.0/" /> 
<license id="5" name="Attribution-ShareAlike License" 			url="http://creativecommons.org/licenses/by-sa/2.0/" /> 
<license id="6" name="Attribution-NoDerivs License" 			url="http://creativecommons.org/licenses/by-nd/2.0/" /> 
<license id="7" name="No known copyright restrictions" 			url="http://flickr.com/commons/usage/" />
*/

$photos = $f->photos_search(array(
                        "text"=>$search,
                        // "tags"=>$search,
                        // "tag_mode"=>$mode,
                        "license"=>"4,5,6",
			"sort"=>"relevance", // interestingness-desc, interestingness-asc
                        "per_page"=>"6",
                        "page"=>$pos,
                        "privacy_filter"=>"1" // public photos
                ));

$photos["search"] = $search;

$json = json_encode ($photos);
echo $json;
?>
