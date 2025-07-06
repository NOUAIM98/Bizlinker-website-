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
    $stmt = $pdo->prepare("SELECT * FROM businessowner");
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $businesses = array_map(function($row) use ($pdo) {
        $ownerID = $row['ownerID'];
        $stmtWH = $pdo->prepare("SELECT day, time FROM workinghours WHERE ownerID = ?");
        $stmtWH->execute([$ownerID]);
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
            $photos = array_map(function($photo) {
                if (substr($photo, 0, 4) !== "http" && substr($photo, 0, 1) !== "/") {
                    return "https://getbizlinker.site/graduation/backend/" . $photo;
                }
                return $photo;
            }, $photos);
        } else {
            $photos = ["/hero1.png", "/hero2.png", "/hero3.png"];
        }
        $stmtFB = $pdo->prepare("SELECT AVG(rating) AS avg_rating, COUNT(*) AS review_count FROM feedback WHERE businessID = ?");
        $stmtFB->execute([$ownerID]);
        $fbData = $stmtFB->fetch(PDO::FETCH_ASSOC);
        $averageRating = $fbData['avg_rating'] !== null ? round($fbData['avg_rating'], 1) : 5.0;
        $reviewCount = $fbData['review_count'] !== null ? (int)$fbData['review_count'] : 949;
        $location = $row['location'] ?? "";
        return [
            "id" => $ownerID,
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
    }, $rows);
    echo json_encode(["success" => true, "businesses" => $businesses]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>
