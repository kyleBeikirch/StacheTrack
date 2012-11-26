<?
$user="stacheTracks";
$password="aKq@2012stache";
$database="stacheTracks";
mysql_connect('stacheTracks.db.10120714.hostedresource.com',$user,$password);
@mysql_select_db($database) or die( "Unable to select database");
$lookid = $_GET["id"]; 
$result = mysql_query("SELECT *  FROM `mustaches`  WHERE `id` = '$lookid'");
$row = mysql_fetch_row($result);
echo $row[1]; // the email value
echo "$$";
echo $row[2];
echo "$$";
echo $row[3];
echo "$$";
echo $row[4];
echo "$$";
echo $row[5];
mysql_close();
?>