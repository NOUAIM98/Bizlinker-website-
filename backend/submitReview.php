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

$requiredFields = ['reviewerID', 'comment', 'rating', 'reviewDate', 'reviewType'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        echo json_encode(["success" => false, "message" => "Missing required field: $field"]);
        exit;
    }
}

$reviewerID = $data['reviewerID'];
$comment = $data['comment'];
$rating = $data['rating'];
$reviewDate = $data['reviewDate'];
$reviewType = $data['reviewType'];

try {
    if ($reviewType === "event") {
        $eventID = $data['eventID'] ?? null;
        if (!$eventID) {
            throw new Exception("Missing eventID for event review");
        }
        $stmt = $pdo->prepare("INSERT INTO feedback (eventID, reviewerID, comment, rating, reviewDate, reviewType) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$eventID, $reviewerID, $comment, $rating, $reviewDate, "event"]);
    } elseif ($reviewType === "business") {
        $businessID = $data['businessID'] ?? $data['id'] ?? null;

        if (!$businessID) {
            throw new Exception("Missing businessID for business review");
        }
        $stmt = $pdo->prepare("INSERT INTO feedback (businessID, reviewerID, comment, rating, reviewDate, reviewType) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$businessID, $reviewerID, $comment, $rating, $reviewDate, "business"]);
    } elseif ($reviewType === "service") {
        $serviceID = $data['serviceID'] ?? null;
        if (!$serviceID) {
            throw new Exception("Missing serviceID for service review");
        }
        $stmt = $pdo->prepare("INSERT INTO feedback (serviceID, reviewerID, comment, rating, reviewDate, reviewType) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$serviceID, $reviewerID, $comment, $rating, $reviewDate, "service"]);
    } else {
        throw new Exception("Invalid review type");
    }

    echo json_encode(["success" => true, "message" => "Review submitted successfully"]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
