<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}
$data = json_decode(file_get_contents('php://input'), true);
$businessID = $data['businessID'] ?? '';
if (!$businessID) {
  echo json_encode(["success" => false, "message" => "Missing business ID"]);
  exit;
}
try {
  $stmt = $pdo->prepare("SELECT * FROM businessowner WHERE ownerID=?");
  $stmt->execute([$businessID]);
  $business = $stmt->fetch(PDO::FETCH_ASSOC);
  if ($business) {
    echo json_encode(["success" => true, "business" => $business]);
  } else {
    echo json_encode(["success" => false, "message" => "Business not found"]);
  }
} catch (Exception $e) {
  echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
