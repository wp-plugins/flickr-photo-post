<?php  
// Error Reporting
error_reporting (0);

// Init
$data = array ();

require_once ("phpFlickr-3.1/phpFlickr.php");

// Parameter einlesen
if (isset ($_POST['x'])) { $x = $_POST['x']; } else { $x = 0; }
if (isset ($_POST['y'])) { $y = $_POST['y']; } else { $y = 0; }
if (isset ($_POST['w'])) { $w = $_POST['w']; } else { $w = 0; }
if (isset ($_POST['h'])) { $h = $_POST['h']; } else { $h = 0; }
if (isset ($_POST['s'])) { $s = $_POST['s']; } else { $s = 0; }
if (isset ($_POST['e'])) { $e = $_POST['e']; } else { $e = 0; }
if (isset ($_POST['u'])) { $u = $_POST['u']; } else { $u =''; }

// Validieren
$valid = true;
if (!validNumber ($x)) { $valid = false; $data['error']['x'] = "Invalid Value"; }
if (!validNumber ($y)) { $valid = false; $data['error']['y'] = "Invalid Value"; }
if (!validNumber ($w)) { $valid = false; $data['error']['w'] = "Invalid Value"; }
if (!validNumber ($h)) { $valid = false; $data['error']['h'] = "Invalid Value"; }
if (!validNumber ($s)) { $valid = false; $data['error']['s'] = "Invalid Value"; }
if (!validNumber ($e)) { $valid = false; $data['error']['e'] = "Invalid Value"; }
if (!validURL    ($u)) { $valid = false; $data['error']['u'] = "Invalid Value"; }

if ($valid)
{
	// Bild URL ermitteln
	$pixelcache = getPixelcacheImage ($x,$y,$w,$h,$s,$e,$u);
	// $pixelcache data is valid JSON Code from pixelcache.com
	echo $pixelcache;
} else {
	// Error handling
	$json = json_encode ($data);
	echo $json;
}

exit;
/********************************************/

function getPixelcacheImage ($x,$y,$w,$h,$s,$e,$u)
{
	$pixelcachehost = "pixelcache.com";
	$pixelcacheurl = "/api/";
	$pixelcachedata = array ();
	$pixelcachedata['x'] = $x;
	$pixelcachedata['y'] = $y;
	$pixelcachedata['w'] = $w;
	$pixelcachedata['h'] = $h;
	$pixelcachedata['s'] = $s;
	$pixelcachedata['e'] = $e;
	$pixelcachedata['u'] = $u;
	$ret = http_request ('GET', $pixelcachehost, 80, '/api/', $pixelcachedata, null, null, null, 3000, false, false);
	return $ret;
}

function validURL ($url)
{
	return preg_match('|^http(s)?://[a-z0-9-]+(.[a-z0-9-]+)*(:[0-9]+)?(/.*)?$|i', $url);
}

function validNumber ($num)
{
	// Integer >= 0
	$ret = false; 
	if (ctype_digit($num)) // Nur Ziffern
	{
		$ret = true;
	} 
	return $ret;
}

function http_request ( 
    $verb = 'GET',             /* HTTP Request Method (GET and POST supported) */ 
    $ip,                       /* Target IP/Hostname */ 
    $port = 80,                /* Target TCP port */ 
    $uri = '/',                /* Target URI */ 
    $getdata = array(),        /* HTTP GET Data ie. array('var1' => 'val1', 'var2' => 'val2') */ 
    $postdata = array(),       /* HTTP POST Data ie. array('var1' => 'val1', 'var2' => 'val2') */ 
    $cookie = array(),         /* HTTP Cookie Data ie. array('var1' => 'val1', 'var2' => 'val2') */ 
    $custom_headers = array(), /* Custom HTTP headers ie. array('Referer: http://localhost/ */ 
    $timeout = 1000,           /* Socket timeout in milliseconds */ 
    $req_hdr = false,          /* Include HTTP request headers */ 
    $res_hdr = false           /* Include HTTP response headers */ 
    ) 
{ 
    $ret = ''; 
    $verb = strtoupper($verb); 
    $cookie_str = ''; 
    $getdata_str = ''; 
    $getdata_str = count($getdata) ? '?' : ''; 
    $postdata_str = ''; 

    if (isset ($getdata))
    {
        foreach ($getdata as $k => $v) 
        {
            $getdata_str .= strlen($getdata_str)  === 1 ? '' : '&'; 
            $getdata_str .= urlencode($k) .'='. urlencode($v); 
        }
    }

    if (isset ($postdata))
    {
        foreach ($postdata as $k => $v) 
            $postdata_str .= urlencode($k) .'='. urlencode($v) .'&'; 
    }

    if (isset ($cookie))
    {
        foreach ($cookie as $k => $v) 
            $cookie_str .= urlencode($k) .'='. urlencode($v) .'; '; 
    }

    $crlf = "\r\n"; 
    $req = $verb .' '. $uri . $getdata_str .' HTTP/1.1' . $crlf; 
    $req .= 'Host: '. $ip . $crlf; 
    $req .= 'User-Agent: Mozilla/5.0 Firefox/3.6.12' . $crlf; 
    $req .= 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' . $crlf; 
    $req .= 'Accept-Language: en-us,en;q=0.5' . $crlf; 
    $req .= 'Accept-Encoding: deflate' . $crlf; 
    $req .= 'Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7' . $crlf; 
    
    if (isset ($custom_headers))
    {
        foreach ($custom_headers as $k => $v) 
            $req .= $k .': '. $v . $crlf; 
    }
        
    if (!empty($cookie_str)) 
        $req .= 'Cookie: '. substr($cookie_str, 0, -2) . $crlf; 
        
    if ($verb == 'POST' && !empty($postdata_str)) 
    { 
        $postdata_str = substr($postdata_str, 0, -1); 
        $req .= 'Content-Type: application/x-www-form-urlencoded' . $crlf; 
        $req .= 'Content-Length: '. strlen($postdata_str) . $crlf . $crlf; 
        $req .= $postdata_str; 
    } 
    else $req .= $crlf; 
    
    if ($req_hdr) 
        $ret .= $req; 
    
    if (($fp = @fsockopen($ip, $port, $errno, $errstr)) == false) 
        return "Error $errno: $errstr\n"; 
    
    stream_set_timeout($fp, 0, $timeout * 1000); 
    
    fputs($fp, $req); 
    while (!feof($fp))
    {
        $ret .= fgets($fp);
    }
    fclose($fp); 
    
    if (!$res_hdr) 
        $ret = substr($ret, strpos($ret, "\r\n\r\n") + 4); 
    
    return $ret; 
} 


?>
