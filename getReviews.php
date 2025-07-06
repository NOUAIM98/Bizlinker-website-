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

if (!isset($data['reviewType'])) {
    echo json_encode(["success" => false, "message" => "Missing reviewType"]);
    exit;
}

$reviewType = $data['reviewType'];
$targetID = null;

if ($reviewType === "business" && isset($data['id'])) {
    $targetID = $data['id'];
} elseif ($reviewType === "event" && isset($data['eventID'])) {
    $targetID = $data['eventID'];
} elseif ($reviewType === "service" && isset($data['serviceID'])) {
    $targetID = $data['serviceID'];
} else {
    echo json_encode(["success" => false, "message" => "Missing or invalid ID for review type"]);
    exit;
}

try {
    if ($reviewType === "business") {
        $query = "
            SELECT f.*, CONCAT(u.firstName, ' ', u.lastName) AS reviewerName, u.profilePicture AS reviewerProfileImage 
            FROM feedback f 
            JOIN user u ON f.reviewerID = u.userID 
            WHERE f.businessID = ? AND f.reviewType = 'business'
            ORDER BY f.feedbackID DESC
        ";
    } elseif ($reviewType === "event") {
        $query = "
            SELECT f.*, CONCAT(u.firstName, ' ', u.lastName) AS reviewerName, u.profilePicture AS reviewerProfileImage 
            FROM feedback f 
            JOIN user u ON f.reviewerID = u.userID 
            WHERE f.eventID = ? AND f.reviewType = 'event'
            ORDER BY f.feedbackID DESC
        ";
    } elseif ($reviewType === "service") {
        $query = "
            SELECT f.*, CONCAT(u.firstName, ' ', u.lastName) AS reviewerName, u.profilePicture AS reviewerProfileImage 
            FROM feedback f 
            JOIN user u ON f.reviewerID = u.userID 
            WHERE f.serviceID = ? AND f.reviewType = 'service'
            ORDER BY f.feedbackID DESC
        ";
    }

    $stmt = $pdo->prepare($query);
    $stmt->execute([$targetID]);
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($reviews as &$review) {
        if (empty($review['reviewerProfileImage'])) {
            $review['reviewerProfileImage'] = "https://via.placeholder.com/60";
        } else {
            if (strpos($review['reviewerProfileImage'], 'uploads/') === 0) {
                $review['reviewerProfileImage'] = 'https://getbizlinker.site/graduation/backend/' . $review['reviewerProfileImage'];
            }
        }
    }

    echo json_encode(["success" => true, "reviews" => $reviews]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
