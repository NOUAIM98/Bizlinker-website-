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
if (!isset($data['userID']) || !isset($data['businessID']) || !isset($data['question'])) {
    echo json_encode(["success" => false, "message" => "Missing parameters"]);
    exit;
}

$userID = $data['userID'];
$businessID = $data['businessID'];
$question = $data['question'];

try {
    $stmt = $pdo->prepare("SELECT ownerID FROM businessowner WHERE ownerID = ?");
    $stmt->execute([$businessID]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        echo json_encode(["success" => false, "message" => "Business not found"]);
        exit;
    }
    $receiverID = $businessID;
    $stmt = $pdo->prepare("INSERT INTO messages (senderID, receiverID, content, type) VALUES (?, ?, ?, ?)");
    $stmt->execute([$userID, $receiverID, $question, 'question']);
    echo json_encode(["success" => true, "message" => "Question submitted"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>
