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
    echo json_encode(["success" => false, "message" => "Missing user ID"]);
    exit;
}

$userID = $data['userID'];

try {
    $stmt = $pdo->prepare("SELECT * FROM user WHERE userID = ?");
    $stmt->execute([$userID]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(["success" => false, "message" => "User not found"]);
        exit;
    }

    $linkedBusinessID = $user['linkedBusinessID'];

    $stmt = $pdo->prepare("UPDATE user SET linkedBusinessID = NULL WHERE userID = ?");
    $result = $stmt->execute([$userID]);

    if ($result) {
        if ($linkedBusinessID) {
            $stmt = $pdo->prepare("UPDATE businessowner SET isVerified = 0 WHERE ownerID = ?");
            $stmt->execute([$linkedBusinessID]);
        }
        echo json_encode(["success" => true, "message" => "Business unlinked successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to unlink business"]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>
