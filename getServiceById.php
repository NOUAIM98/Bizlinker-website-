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
    if (!isset($_GET['id'])) {
        echo json_encode(["success" => false, "message" => "No ID provided"]);
        exit;
    }

    $id = intval($_GET['id']);

    // Include s.userID as ownerID for messaging
    $stmt = $pdo->prepare("
        SELECT s.*, u.profilePicture 
        FROM service s 
        LEFT JOIN user u ON s.userID = u.userID 
        WHERE s.serviceID = ?
    ");
    $stmt->execute([$id]);
    $service = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$service) {
        echo json_encode(["success" => false, "message" => "Service not found"]);
        exit;
    }

    $photos = [];
    if (!empty($service['photos'])) {
        $photoStr = trim($service['photos']);
        $photos = array_map('trim', explode(',', $photoStr));
        $photos = array_map(function ($photo) {
            if (substr($photo, 0, 4) !== "http" && substr($photo, 0, 1) !== "/") {
                return "https://getbizlinker.site/backend/" . $photo;
            }
            return $photo;
        }, $photos);
    } else {
        $photos = ["/hero1.png", "/hero2.png", "/hero3.png"];
    }

    $stmtFB = $pdo->prepare("SELECT AVG(rating) AS avg_rating, COUNT(*) AS review_count FROM feedback WHERE serviceID = ? AND reviewType = 'service'");
    $stmtFB->execute([$id]);
    $fbData = $stmtFB->fetch(PDO::FETCH_ASSOC);
    $averageRating = $fbData['avg_rating'] !== null ? round($fbData['avg_rating'], 1) : 5.0;
    $reviewCount = $fbData['review_count'] !== null ? (int) $fbData['review_count'] : 0;

    $profilePath = '';
    if (!isset($service['profilePicture']) || trim($service['profilePicture']) === "") {
        $profilePath = "https://getbizlinker.site/backend/uploads/defualt.png";
    } else {
        $profilePath = (substr($service['profilePicture'], 0, 4) !== "http")
            ? "https://getbizlinker.site/backend/" . ltrim($service['profilePicture'], "/")
            : $service['profilePicture'];
    }

    // Include ownerID in the response
    $formattedService = [
        "id" => $service['serviceID'],
        "ownerID" => $service['userID'],  // <-- for messaging
        "serviceTitle" => $service['serviceName'] ?? "Untitled Service",
        "providerName" => $service['fullName'] ?? "",
        "category" => $service['category'] ?? "",
        "description" => $service['serviceDescription'] ?? "",
        "providerAbout" => $service['aboutMe'] ?? "No description provided.",
        "price" => $service['servicePrice'] ?? "",
        "location" => $service['location'] ?? "",
        "profile" => $profilePath,
        "image" => $photos[0] ?? "https://getbizlinker.site/backend/hero1.png",
        "photos" => $photos,
        "contact" => [
            "email" => $service['email'] ?? "",
            "phone" => $service['phone'] ?? "",
            "website" => $service['website'] ?? ""
        ],
        "rating" => $averageRating,
        "reviewCount" => $reviewCount,
        "deliveryTime" => $service['deliveryTime'] ?? "N/A",
        "portfolioURL" => $service['portfolioURL'] ?? ""
    ];

    echo json_encode(["success" => true, "service" => $formattedService]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
