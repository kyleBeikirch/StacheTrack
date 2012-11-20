<?

$data = base64_decode($_POST["str"]);

$urlUploadImages = "/uploads/";
$nameImage = "test.png";

$img = imagecreatefromstring($data);
header('Content-type: image/png');

if($img) {
    imagepng($img, $urlUploadImages.$nameImage, 0);
    imagedestroy($img);

    // [database code]

    echo "OK";
    $user="664746_kyle";
    $password="beckham2579";
    $database="664746_wordpress";
    mysql_connect('mysql50-58.wc1.dfw1.stabletransit.com',$user,$password);
    @mysql_select_db($database) or die( "Unable to select database");
    $points = $_GET["points"]; 
    echo 'Hello ' . htmlspecialchars($_GET["points"]) . '!';
    $query = "INSERT INTO mustache VALUES ('', '$points', 'http://testURL2.com')";
    mysql_query($query);
    mysql_close();
}
else {
    echo 'error';
}

?>