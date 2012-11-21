<?
$user="664746_kyle";
$password="beckham2579";
$database="664746_wordpress";
mysql_connect('mysql50-58.wc1.dfw1.stabletransit.com',$user,$password);
@mysql_select_db($database) or die( "Unable to select database");
$lookid = $_GET["id"]; 
$result = mysql_query("SELECT *  FROM `mustache`  WHERE `id` = '$lookid'");
$row = mysql_fetch_row($result);
echo $row[1]; // the email value
echo "$$";
echo $row[2];
echo "$$";
echo $row[3];
echo "$$";
echo $row[4];
mysql_close();
?>