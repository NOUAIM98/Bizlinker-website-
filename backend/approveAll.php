<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require 'db_connection.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['ownerID'])) {
    if (!is_numeric($data['ownerID'])) {
        echo json_encode(["success" => false, "message" => "Invalid ownerID"]);
        exit;
    }
    $ownerID = (int)$data['ownerID'];
    $randomCode = strval(mt_rand(10000000, 99999999));

    try {
        $stmt = $pdo->prepare("UPDATE businessowner SET verificationCode = :code, isVerified = 0, status = 'approved' WHERE ownerID = :ownerID");
        $stmt->execute([':code' => $randomCode, ':ownerID' => $ownerID]);
        echo json_encode(["success" => true, "message" => "Business approved successfully", "code" => $randomCode]);
    } catch (Exception $e) {
        error_log("DB Error: " . $e->getMessage());
        echo json_encode(["success" => false, "message" => "Database error occurred."]);
    }
    exit;
}

if (isset($data['eventID'])) {
    if (!is_numeric($data['eventID'])) {
        echo json_encode(["success" => false, "message" => "Invalid eventID"]);
        exit;
    }
    $eventID = (int)$data['eventID'];

    try {
        $stmt = $pdo->prepare("UPDATE event SET status = 'Approved' WHERE eventID = ?");
        $stmt->execute([$eventID]);
        echo json_encode(["success" => true, "message" => "Event approved successfully"]);
    } catch (Exception $e) {
        error_log("DB Error: " . $e->getMessage());
        echo json_encode(["success" => false, "message" => "Database error occurred."]);
    }
    exit;
}

if (isset($data['serviceID'])) {
    if (!is_numeric($data['serviceID'])) {
        echo json_encode(["success" => false, "message" => "Invalid serviceID"]);
        exit;
    }
    $serviceID = (int)$data['serviceID'];

    try {
        $stmt = $pdo->prepare("UPDATE service SET status = 'approved' WHERE serviceID = ?");
        $stmt->execute([$serviceID]);
        echo json_encode(["success" => true, "message" => "Service approved successfully."]);
    } catch (PDOException $e) {
        error_log("DB Error: " . $e->getMessage());
        echo json_encode(["success" => false, "message" => "Database error occurred."]);
    }
    exit;
}

echo json_encode(["success" => false, "message" => "Invalid request."]);
