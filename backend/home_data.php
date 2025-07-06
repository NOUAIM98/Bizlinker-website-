<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require 'db_connection.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    $result = [];

    $stmt1 = $pdo->query("
    SELECT 
        b.ownerID AS businessID,
        b.businessName,
        b.photos,
        b.location,
        b.category,
        COALESCE(AVG(f.rating), 0) AS rating,
        COUNT(f.feedbackID) AS reviewCount
    FROM businessowner b
    LEFT JOIN feedback f 
        ON f.businessID = b.ownerID AND f.reviewType = 'business'
    WHERE b.status = 'approved' AND b.promoted = 1
    GROUP BY b.ownerID
    LIMIT 10
");

    $result['businesses'] = array_map(function ($b) {
        return [
            'id' => $b['businessID'],
            'name' => $b['businessName'],
            'image' => $b['photos'],
            'place' => $b['location'],
            'category' => $b['category'],
            'rating' => round((float) $b['rating'], 1),
            'reviews' => (int) $b['reviewCount']
        ];
    }, $stmt1->fetchAll(PDO::FETCH_ASSOC));


    // ---------- Events ----------
    $stmt2 = $pdo->query("
        SELECT 
            e.eventID,
            e.eventName,
            e.photos,
            e.address,
            e.category,
            COALESCE(AVG(f.rating), 0) AS rating,
            COUNT(f.feedbackID) AS reviewCount
        FROM event e
        LEFT JOIN feedback f 
            ON f.eventID = e.eventID AND f.reviewType = 'event'
        WHERE e.status = 'Approved' AND e.promoted = 1
        GROUP BY e.eventID
        LIMIT 10
    ");
    $result['events'] = array_map(function ($e) {
        return [
            'id' => $e['eventID'],
            'name' => $e['eventName'],
            'image' => $e['photos'],
            'place' => $e['address'],
            'category' => $e['category'],
            'rating' => round((float) $e['rating'], 1),
            'reviews' => (int) $e['reviewCount']
        ];
    }, $stmt2->fetchAll(PDO::FETCH_ASSOC));

    // ---------- Services ----------
    $stmt3 = $pdo->query("
        SELECT 
            s.serviceID,
            s.serviceName,
            s.photos,
            s.location,
            s.category,
            COALESCE(AVG(f.rating), 0) AS rating,
            COUNT(f.feedbackID) AS reviewCount
        FROM service s
        LEFT JOIN feedback f 
            ON f.serviceID = s.serviceID AND f.reviewType = 'service'
        WHERE s.status = 'approved' AND s.promoted = 1
        GROUP BY s.serviceID
        LIMIT 10
    ");
    $result['services'] = array_map(function ($s) {
        return [
            'id' => $s['serviceID'],
            'name' => $s['serviceName'],
            'image' => $s['photos'],
            'place' => $s['location'],
            'category' => $s['category'],
            'rating' => round((float) $s['rating'], 1),
            'reviews' => (int) $s['reviewCount']
        ];
    }, $stmt3->fetchAll(PDO::FETCH_ASSOC));

    echo json_encode([
        "success" => true,
        "data" => $result
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
