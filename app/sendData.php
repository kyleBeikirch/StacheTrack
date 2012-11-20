<?

$src     = $_POST['src'];
$src2     = substr($src, strpos($src, ",") + 1);
$decoded = base64_decode($src2);
$urlUploadImages = "../uploads/";
$filename = $urlUploadImages . $_GET['time'] . '.png';   
$fp = fopen($filename,'wb');
fwrite($fp, $decoded);
fclose($fp);

$user="664746_kyle";
$password="beckham2579";
$database="664746_wordpress";
mysql_connect('mysql50-58.wc1.dfw1.stabletransit.com',$user,$password);
@mysql_select_db($database) or die( "Unable to select database");
$points = $_GET["points"]; 
$query = "INSERT INTO mustache VALUES ('', '$points', '$filename')";
mysql_query($query);
$id = mysql_insert_id();
echo $id;
mysql_close();


?>