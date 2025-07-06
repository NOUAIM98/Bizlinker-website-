<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require 'db_connection.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['userID'])) {
    echo json_encode(["success" => false, "message" => "Missing userID"]);
    exit;
}

$userID = $data['userID'];

if (isset($data['businessID']) && intval($data['businessID']) > 0) {
    $businessID = $data['businessID'];
    try {
        $stmt = $pdo->prepare("DELETE FROM favorites WHERE userID = ? AND businessID = ?");
        $stmt->execute([$userID, $businessID]);
        echo json_encode(["success" => true, "message" => "Favorite removed successfully"]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
} 
elseif ((isset($data['eventID']) && intval($data['eventID']) > 0) || (isset($data['id']) && intval($data['id']) > 0)) {
    $eventID = (isset($data['eventID']) && intval($data['eventID']) > 0) ? $data['eventID'] : $data['id'];
    try {
        $stmt = $pdo->prepare("DELETE FROM favorites WHERE userID = ? AND eventID = ?");
        $stmt->execute([$userID, $eventID]);
        echo json_encode(["success" => true, "message" => "Favorite removed successfully"]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Missing eventID or businessID"]);
    exit;
}
?>
