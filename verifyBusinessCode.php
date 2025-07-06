<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require 'db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);
$code = $data['code'] ?? '';
$userID = $data['userID'] ?? '';
if (!$code || !$userID) {
  echo json_encode(["success" => false, "message" => "Missing code or userID"]);
  exit;
}
try {
  $stmt = $pdo->prepare("SELECT ownerID FROM businessowner WHERE verificationCode=? AND isVerified=0");
  $stmt->execute([$code]);
  $business = $stmt->fetch(PDO::FETCH_ASSOC);
  if (!$business) {
    echo json_encode(["success" => false, "message" => "Invalid or used code"]);
    exit;
  }
  $ownerID = $business['ownerID'];
  $updateBiz = $pdo->prepare("UPDATE businessowner SET isVerified=1 WHERE ownerID=?");
  $updateBiz->execute([$ownerID]);
  $updateUser = $pdo->prepare("UPDATE user SET linkedBusinessID=? WHERE userID=?");
  $updateUser->execute([$ownerID, $userID]);
  echo json_encode(["success" => true, "message" => "Business linked", "ownerID" => $ownerID]);
} catch (Exception $e) {
  echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
