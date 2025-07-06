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

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['ownerID'])) {
    $ownerID = $data['ownerID'];

    try {
        $stmt = $pdo->prepare("DELETE FROM businessowner WHERE ownerID = ?");
        $stmt->execute([$ownerID]);
        echo json_encode(["success" => true, "message" => "Business denied and removed successfully"]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
    exit;
}

if (isset($data['eventID'])) {
    $eventID = $data['eventID'];

    try {
        $stmt = $pdo->prepare("UPDATE event SET status = 'Rejected' WHERE eventID = ?");
        $stmt->execute([$eventID]);
        echo json_encode(["success" => true, "message" => "Event denied (set to 'Rejected') successfully"]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
    exit;
}

if (isset($data['serviceID'])) {
    $serviceID = $data['serviceID'];

    try {
        $stmt = $pdo->prepare("DELETE FROM service WHERE serviceID = ?");
        $stmt->execute([$serviceID]);
        echo json_encode(["success" => true, "message" => "Service denied and deleted successfully."]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
    exit;
}

echo json_encode(["success" => false, "message" => "Invalid request."]);
?>
