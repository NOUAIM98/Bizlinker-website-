<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require 'db_connection.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['subAdminID'], $input['permissions'])) {
    echo json_encode(["success" => false, "message" => "Missing parameters"]);
    exit;
}

$id = $input['subAdminID'];
$permissionsJSON = json_encode($input['permissions']);

try {
    $stmt = $pdo->prepare("
        UPDATE admin_users
        SET permissions = :permissions
        WHERE adminID = :id
          AND role = 'subadmin'
    ");
    $stmt->execute([
        'permissions' => $permissionsJSON,
        'id'          => $id
    ]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Permissions updated."]);
    } else {
        echo json_encode(["success" => false, "message" => "Sub-admin not found or no changes made."]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}