<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require 'db_connection.php';

try {
    $stmt = $pdo->query("
        SELECT 
    r.*, 
    CONCAT(u.firstName, ' ', u.lastName) AS reporterName,
    u.profilePicture,
    u.created_at AS userCreatedAt,
    (
        SELECT COUNT(*) 
        FROM reports r2 
        WHERE r2.reportedBy = r.reportedBy
    ) AS totalReportsByUser,
    CONCAT(a.firstName, ' ', a.lastName) AS claimedByName
    FROM reports r
    LEFT JOIN user u ON r.reportedBy = u.userID
    LEFT JOIN admin_users a ON r.claimedBy = a.adminID
    ORDER BY r.created_at DESC
    ");

    $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "reports" => $reports]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "DB error: " . $e->getMessage()]);
}
