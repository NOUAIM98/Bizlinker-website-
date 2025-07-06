<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require 'db_connection.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['userID']) || !is_numeric($data['userID'])) {
    echo json_encode(["success" => false, "message" => "Invalid or missing userID"]);
    exit;
}

$userID = (int)$data['userID'];

if (isset($data['eventID'])) {
    if (!is_numeric($data['eventID'])) {
        echo json_encode(["success" => false, "message" => "Invalid eventID"]);
        exit;
    }
    $eventID = (int)$data['eventID'];
    try {
        $stmt = $pdo->prepare("INSERT INTO favorites (userID, eventID) VALUES (?, ?)");
        $stmt->execute([$userID, $eventID]);
        echo json_encode(["success" => true, "message" => "Favorite added successfully"]);
    } catch (PDOException $e) {
        error_log("DB Error: " . $e->getMessage());
        echo json_encode(["success" => false, "message" => "Database error occurred."]);
    }
} elseif (isset($data['businessID'])) {
    if (!is_numeric($data['businessID'])) {
        echo json_encode(["success" => false, "message" => "Invalid businessID"]);
        exit;
    }
    $businessID = (int)$data['businessID'];
    try {
        $stmt = $pdo->prepare("INSERT INTO favorites (userID, businessID) VALUES (?, ?)");
        $stmt->execute([$userID, $businessID]);
        echo json_encode(["success" => true, "message" => "Favorite added successfully"]);
    } catch (PDOException $e) {
        error_log("DB Error: " . $e->getMessage());
        echo json_encode(["success" => false, "message" => "Database error occurred."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Missing businessID or eventID"]);
    exit;
}
?>
