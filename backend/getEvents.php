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
    $query = "
        SELECT 
            e.eventID,
            e.eventName,
            e.eventDate,
            e.eventDescription,
            e.ticketPrice,
            e.address,
            e.photos,
            e.websiteURL,
            e.phone,
            e.email,
            e.category,
            e.status,
            e.eventTime,
            IFNULL(r.review_count, 0) AS reviews,
            IFNULL(r.avg_rating, 0) AS rating
        FROM event e
        LEFT JOIN (
            SELECT eventID, COUNT(*) AS review_count, AVG(rating) AS avg_rating
            FROM feedback
            WHERE reviewType = 'event'
            GROUP BY eventID
        ) r ON e.eventID = r.eventID
        WHERE e.status = 'Approved'
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $events = array_map(function ($row) {
        $schedule = [];
        if (!empty($row['eventTime'])) {
            $schedule[] = [
                "time" => $row['eventTime'],
                "activity" => "Main Event"
            ];
        }
        $mapLink = "";
        if (!empty($row['address'])) {
            $mapLink = "https://maps.google.com?q=" . urlencode($row['address']);
        }
        return [
            "id" => $row['eventID'],
            "name" => $row['eventName'],
            "date" => date('c', strtotime($row['eventDate'])),
            "description" => $row['eventDescription'],
            "price" => $row['ticketPrice'],
            "location" => $row['address'],
            "schedule" => $schedule,
            "photos" => !empty($row['photos']) ? array_map('trim', explode(',', $row['photos'])) : [],
            "contact" => [
                "website" => $row['websiteURL'],
                "phone" => $row['phone'],
                "email" => $row['email'],
                "date" => date('c', strtotime($row['eventDate']))
            ],
            "rating" => $row['rating'],
            "reviews" => $row['reviews'],
            "breadcrumb" => "",
            "mapLink" => $mapLink,
            "category" => $row['category'],
            "status" => $row['status']
        ];
    }, $results);
    echo json_encode($events);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
