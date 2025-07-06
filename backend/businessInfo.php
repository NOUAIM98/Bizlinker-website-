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

if (!isset($data['id']) || !is_numeric($data['id'])) {
    echo json_encode(["success" => false, "message" => "Invalid or missing business id"]);
    exit;
}

$id = (int) $data['id'];

try {
    $stmt = $pdo->prepare("SELECT * FROM businessowner WHERE ownerID = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        echo json_encode(["success" => false, "message" => "Business not found"]);
        exit;
    }

    $stmtWH = $pdo->prepare("SELECT day, time FROM workinghours WHERE ownerID = ?");
    $stmtWH->execute([$id]);
    $whRows = $stmtWH->fetchAll(PDO::FETCH_ASSOC);
    $workingHours = [];
    foreach ($whRows as $wh) {
        $workingHours[] = [
            "day" => $wh['day'],
            "hours" => $wh['time']
        ];
    }

    if (isset($row['photos']) && trim($row['photos']) !== "") {
        $photoStr = trim($row['photos']);
        $photos = array_map('trim', explode(',', $photoStr));
        $photos = array_map(function ($photo) {
            if (substr($photo, 0, 4) !== "http" && substr($photo, 0, 1) !== "/") {
                return "http://getbizlinker.site/backend/" . $photo;
            }
            return $photo;
        }, $photos);
    } else {
        $photos = ["/hero1.png", "/hero2.png", "/hero3.png"];
    }

    $stmtFB = $pdo->prepare("SELECT AVG(rating) AS avg_rating, COUNT(*) AS review_count FROM feedback WHERE businessID = ?");
    $stmtFB->execute([$id]);
    $fbData = $stmtFB->fetch(PDO::FETCH_ASSOC);
    $averageRating = $fbData['avg_rating'] !== null ? round($fbData['avg_rating'], 1) : 5.0;
    $reviewCount = $fbData['review_count'] !== null ? (int) $fbData['review_count'] : 0;

    $location = $row['location'] ?? "";

    $business = [
        "id" => $id,
        "name" => $row['businessName'] ?? "Unnamed Business",
        "type" => "business",
        "category" => $row['category'] ?? "Restaurants",
        "breadcrumb" => "Restaurants > " . $location,
        "rating" => $averageRating,
        "reviews" => $reviewCount,
        "contact" => [
            "website" => $row['websiteURL'] ?? "",
            "phone" => $row['phone'] ?? "",
            "email" => $row['email'] ?? "",
            "hours" => "10:00 - 00:00",
            "status" => $row['status'] ?? "approved"
        ],
        "about" => $row['description'] ?? "",
        "location" => $location,
        "country" => $location,
        "city" => $location,
        "areaType" => "Seaside",
        "ambiance" => "Calm",
        "petFriendly" => true,
        "kidFriendly" => true,
        "workingHours" => $workingHours,
        "photos" => $photos,
        "mapLink" => "https://www.google.com/maps/embed?pb=..."
    ];

    echo json_encode(["success" => true, "business" => $business]);
} catch (PDOException $e) {
    error_log("DB Error: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Database error occurred."]);
}
