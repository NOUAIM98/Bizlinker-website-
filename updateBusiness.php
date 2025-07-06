<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require 'db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['linkedBusinessID']) || empty($data['linkedBusinessID'])) {
    echo json_encode(["success" => false, "message" => "Missing business ID"]);
    exit;
}

$businessID = $data['linkedBusinessID'];
$fields = [];
$params = [];

if (isset($data['businessName']) && $data['businessName'] !== "") {
    $fields[] = "businessName = ?";
    $params[] = $data['businessName'];
}
if (isset($data['email']) && $data['email'] !== "") {
    $fields[] = "email = ?";
    $params[] = $data['email'];
}
if (isset($data['phone']) && $data['phone'] !== "") {
    $fields[] = "phone = ?";
    $params[] = $data['phone'];
}
if (isset($data['websiteURL']) && $data['websiteURL'] !== "") {
    $fields[] = "websiteURL = ?";
    $params[] = $data['websiteURL'];
}
if (isset($data['location']) && $data['location'] !== "") {
    $fields[] = "location = ?";
    $params[] = $data['location'];
}
if (isset($data['description']) && $data['description'] !== "") {
    $fields[] = "description = ?";
    $params[] = $data['description'];
}
if (isset($data['photos']) && $data['photos'] !== "") {
    $fields[] = "photos = ?";
    $params[] = $data['photos'];
}

if (empty($fields)) {
    echo json_encode(["success" => false, "message" => "No fields to update"]);
    exit;
}

$params[] = $businessID;
$query = "UPDATE businessowner SET " . implode(", ", $fields) . " WHERE ownerID = ?";
try {
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    echo json_encode(["success" => true, "message" => "Business updated successfully"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
