<?php  

require_once ("phpFlickr-3.1/phpFlickr.php");
$f = new phpFlickr("50e4e0b1bf33041c0f443e3d67efcf6c");

if (isset ($_POST['owner']))
{
	// TODO Security
	$owner = explode ("_", $_POST['owner']);
	if (count($owner) == 2)
	{
		$owner = $owner[1];
	} else {
		$owner = "";
	}
} else {
	$owner = "";
}

$owner = $f->people_getInfo ($owner);

$json = json_encode ($owner);
echo $json;

?>
