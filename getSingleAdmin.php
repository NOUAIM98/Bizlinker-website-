<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require 'db_connection.php';

$input = json_decode(file_get_contents("php://input"), true);
$adminID = $input['adminID'] ?? null;

if (!$adminID) {
    echo json_encode(["success" => false, "message" => "No adminID provided"]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT permissions FROM admin_users WHERE adminID = ? AND role = 'subadmin'");
    $stmt->execute([$adminID]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        echo json_encode(["success" => false, "message" => "Sub-admin not found"]);
        exit;
    }

    $permissionsDecoded = $row['permissions'] ? json_decode($row['permissions'], true) : [];

    echo json_encode([
        "success" => true,
        "permissions" => $permissionsDecoded
    ]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
