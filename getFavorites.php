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
    echo json_encode(["success" => false, "message" => "Missing userID"]);
    exit;
}
$userID = $data['userID'];

try {
    $stmt = $pdo->prepare("
        SELECT 
            f.*,
            COALESCE(b.businessName, e.eventName) AS businessName,
            COALESCE(b.location, e.address) AS location,
            COALESCE(b.photos, e.photos) AS businessPhoto
        FROM favorites f 
        LEFT JOIN businessowner b ON f.businessID = b.ownerID 
        LEFT JOIN event e ON f.eventID = e.eventID 
        WHERE f.userID = ?
    ");
    $stmt->execute([$userID]);
    $favorites = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "favorites" => $favorites]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>
