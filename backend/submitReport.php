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

$requiredFields = ['reportedBy', 'targetType', 'targetName', 'issue', 'details'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        echo json_encode(["success" => false, "message" => "Missing required field: $field"]);
        exit;
    }
}

$reportedBy = (int)$data['reportedBy'];
$targetType = $data['targetType'];
$targetName = htmlspecialchars(strip_tags($data['targetName']));
$issue = htmlspecialchars(strip_tags($data['issue']));
$details = htmlspecialchars(strip_tags($data['details']));

$status = "Under Review";

try {
    $stmt = $pdo->prepare("
        INSERT INTO reports (reportedBy, targetType, targetName, issue, details, status)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$reportedBy, $targetType, $targetName, $issue, $details, $status]);

    echo json_encode(["success" => true, "message" => "Report submitted successfully"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
