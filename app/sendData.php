<?

$src     = $_POST['src'];
$src2     = substr($src, strpos($src, ",") + 1);
$decoded = base64_decode($src2);
$urlUploadImages = "uploads/";
$filename = $urlUploadImages . $_GET['time'] . '.png';   
$fp = fopen($filename,'wb');
fwrite($fp, $decoded);
fclose($fp);

$user="stacheTracks";
$password="aKq@2012stache";
$database="stacheTracks";
mysql_connect('stacheTracks.db.10120714.hostedresource.com',$user,$password);
@mysql_select_db($database) or die( "Unable to select database");
$points = $_GET["points"];
$trackName = $_GET["track"];
$userName = $_GET["user"];
$query = "INSERT INTO mustaches VALUES ('', '$points', '$filename', '$trackNmae' , '$userName')";
mysql_query($query);
$id = mysql_insert_id();
echo $id;
mysql_close();


?>