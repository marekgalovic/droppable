<?php

$back = array(
	"path" => $_FILES["file"]["name"],
	"name" => $_FILES["file"]["name"],
	"size" => $_FILES["file"]["size"]
	);
echo json_encode($back);

move_uploaded_file($_FILES["file"]["tmp_name"], $_FILES["file"]["name"]);

?>