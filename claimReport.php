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

if (!isset($data['reportID'], $data['adminID'])) {
    echo json_encode(["success" => false, "message" => "Missing reportID or adminID"]);
    exit;
}

$reportID = filter_var($data['reportID'], FILTER_VALIDATE_INT);
$adminID  = filter_var($data['adminID'], FILTER_VALIDATE_INT);

if (!$reportID || !$adminID) {
    echo json_encode(["success" => false, "message" => "Invalid reportID or adminID"]);
    exit;
}

$stmt = $pdo->prepare("SELECT adminID, role FROM admin_users WHERE adminID = ?");
$stmt->execute([$adminID]);
$adminRow = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$adminRow) {
    echo json_encode(["success" => false, "message" => "You're not authenticated."]);
    exit;
}

$role = $adminRow['role'];

try {
    $stmt = $pdo->prepare("
        UPDATE reports
        SET claimedBy = :adminID,
            claimedByRole = :role
        WHERE reportID = :reportID
    ");
    $stmt->execute([
        'adminID'  => $adminID,
        'role'     => $role,
        'reportID' => $reportID
    ]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Report claimed successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Report not found or already claimed."]);
    }
} catch (PDOException $e) {
    error_log("DB Error: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Database error occurred."]);
}
