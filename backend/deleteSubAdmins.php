<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require 'db_connection.php';

$inputData = json_decode(file_get_contents("php://input"), true);

if (!isset($inputData['subAdminID'])) {
    echo json_encode([
        "success" => false,
        "message" => "No subAdminID provided"
    ]);
    exit;
}

$subAdminID = $inputData['subAdminID'];

try {
    $stmt = $pdo->prepare("
        DELETE FROM admin_users
        WHERE adminID = :id
          AND role = 'subadmin'
    ");
    $stmt->execute(['id' => $subAdminID]);

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Sub-admin deleted successfully."
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Sub-admin not found or already removed."
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "DB Error: " . $e->getMessage()
    ]);
}
