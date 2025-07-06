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
$userID = $data['userID'] ?? '';
$firstName = $data['firstName'] ?? null;
$lastName = $data['lastName'] ?? null;
$email = $data['email'] ?? null;
$phone = $data['phone'] ?? null;
$profilePicture = $data['profilePicture'] ?? null;

if (!$userID) {
    echo json_encode(["success" => false, "message" => "Missing user ID"]);
    exit;
}

if (!is_null($profilePicture) && strpos($profilePicture, 'data:') === 0) {
    if (preg_match('/^data:(image\/\w+);base64,/', $profilePicture, $type)) {
        $profilePicture = substr($profilePicture, strpos($profilePicture, ',') + 1);
        $type = strtolower($type[1]);
        $profilePicture = base64_decode($profilePicture);
        if ($profilePicture === false) {
            echo json_encode(["success" => false, "message" => "Base64 decode failed"]);
            exit;
        }
    } else {
        echo json_encode(["success" => false, "message" => "Invalid image data"]);
        exit;
    }

    $fileName = uniqid('profile_', true) . '.' . explode('/', $type)[1];
    $filePath = 'uploads/' . $fileName;
    if (!file_put_contents($filePath, $profilePicture)) {
        echo json_encode(["success" => false, "message" => "Failed to save image file"]);
        exit;
    }
    $profilePicture = $filePath;
}

$fields = [];
$params = [];

if (!is_null($firstName)) { $fields[] = "firstName = ?"; $params[] = $firstName; }
if (!is_null($lastName)) { $fields[] = "lastName = ?"; $params[] = $lastName; }
if (!is_null($email)) { $fields[] = "email = ?"; $params[] = $email; }
if (!is_null($phone)) { $fields[] = "phone = ?"; $params[] = $phone; }
if (!is_null($profilePicture)) { $fields[] = "profilePicture = ?"; $params[] = $profilePicture; }

if (empty($fields)) {
    echo json_encode(["success" => false, "message" => "No fields to update"]);
    exit;
}

$params[] = $userID;
$query = "UPDATE user SET " . implode(", ", $fields) . " WHERE userID = ?";
try {
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    echo json_encode(["success" => true, "message" => "User updated successfully"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
