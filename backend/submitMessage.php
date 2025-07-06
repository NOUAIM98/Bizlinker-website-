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
if (empty($data['senderID']) || empty($data['receiverID']) || empty($data['content']) || empty($data['type'])) {
  echo json_encode(["success" => false, "message" => "Missing parameters"]);
  exit;
}

$senderID = $data['senderID'];
$receiverID = $data['receiverID'];
$content = $data['content'];
$type = $data['type'];

try {
  $stmt = $pdo->prepare("INSERT INTO messages (senderID, receiverID, content, type) VALUES (?, ?, ?, ?)");
  $stmt->execute([$senderID, $receiverID, $content, $type]);
  echo json_encode(["success" => true, "message" => "Message submitted"]);
} catch (PDOException $e) {
  echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>
