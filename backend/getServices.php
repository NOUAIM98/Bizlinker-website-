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
    $stmt = $pdo->prepare("
    SELECT s.*, u.profilePicture 
    FROM service s 
    LEFT JOIN user u ON s.userID = u.userID 
    WHERE s.status = 'approved'
");
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $services = array_map(function ($row) use ($pdo) {
        $serviceID = $row['serviceID'] ?? $row['id'];
        if (isset($row['photos']) && trim($row['photos']) !== "") {
            $photoStr = trim($row['photos']);
            $photos = array_map('trim', explode(',', $photoStr));
            $photos = array_map(function ($photo) {
                if (substr($photo, 0, 4) !== "http" && substr($photo, 0, 1) !== "/") {
                    return "https://getbizlinker.site/graduation/backend/" . $photo;
                }
                return $photo;
            }, $photos);
        } else {
            $photos = ["/hero1.png", "/hero2.png", "/hero3.png"];
        }
        $stmtFB = $pdo->prepare("SELECT AVG(rating) AS avg_rating, COUNT(*) AS review_count FROM feedback WHERE serviceID = ?");
        $stmtFB->execute([$serviceID]);
        $fbData = $stmtFB->fetch(PDO::FETCH_ASSOC);
        $averageRating = $fbData['avg_rating'] !== null ? round($fbData['avg_rating'], 1) : 5.0;
        $reviewCount = $fbData['review_count'] !== null ? (int) $fbData['review_count'] : 50;
        return [
            "id" => $serviceID,
            "serviceTitle" => $row['serviceName'] ?? "Untitled Service",
            "providerName" => $row['fullName'] ?? "",
            "category" => $row['category'] ?? "",
            "description" => $row['serviceDescription'] ?? "",
            "price" => $row['servicePrice'] ?? "",
            "location" => $row['location'] ?? "",
            "profile" => isset($row['profilePicture']) && trim($row['profilePicture']) !== ""
                ? (substr($row['profilePicture'], 0, 4) !== "http"
                    ? "https://getbizlinker.site/graduation/backend/" . ltrim($row['profilePicture'], "/")
                    : $row['profilePicture'])
                : "https://getbizlinker.site/graduation/backend/uploads/default.png",

            "image" => isset($photos[0]) ? $photos[0] : "https://getbizlinker.site/graduation/backend/hero1.png",
            "photos" => $photos,
            "contact" => [
                "email" => $row['email'] ?? "",
                "phone" => $row['phone'] ?? "",
                "website" => $row['website'] ?? ""
            ],
            "rating" => $averageRating,
            "reviewCount" => $reviewCount,
            "deliveryTime" => $row['deliveryTime'] ?? "N/A"
        ];
    }, $rows);
    echo json_encode(["success" => true, "services" => $services]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>