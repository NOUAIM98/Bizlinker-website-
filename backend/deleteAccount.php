<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['userID']) || empty($data['userID'])) {
    echo json_encode(["success" => false, "message" => "User ID is required"]);
    exit;
}

$userID = trim($data['userID']);

try {
    $check = $pdo->prepare("SELECT * FROM user WHERE userID = ?");
    $check->execute([$userID]);
    $existingUser = $check->fetch(PDO::FETCH_ASSOC);

    if (!$existingUser) {
        echo json_encode(["success" => false, "message" => "User does not exist"]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM user WHERE userID = ?");
    $stmt->execute([$userID]);

    echo json_encode(["success" => true, "message" => "Account deleted"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error deleting account"]);
}
