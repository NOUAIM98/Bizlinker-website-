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
        SELECT e.eventID, e.eventName, e.category, e.websiteURL, e.email, e.phone,
               e.address, e.eventDescription, e.eventDate, e.eventTime, e.ticketType,
               e.ticketPrice, e.totalTickets, e.photos, e.facebook, e.instagram,
               e.otherPlatforms, e.created_at, e.updated_at, e.status
        FROM event e
        WHERE e.status = 'Pending'
    ");

    $stmt->execute();
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $organizedEvents = [];
    foreach ($events as $event) {
        $eventID = $event['eventID'];
        if (!isset($organizedEvents[$eventID])) {
            $organizedEvents[$eventID] = [
                'eventID'         => $event['eventID'],
                'eventName'       => $event['eventName'],
                'category'        => $event['category'],
                'websiteURL'      => $event['websiteURL'],
                'email'           => $event['email'],
                'phone'           => $event['phone'],
                'address'         => $event['address'],
                'eventDescription'=> $event['eventDescription'],
                'eventDate'       => $event['eventDate'],
                'eventTime'       => $event['eventTime'],
                'ticketType'      => $event['ticketType'],
                'ticketPrice'     => $event['ticketPrice'],
                'totalTickets'    => $event['totalTickets'],
                'photos'          => $event['photos'],
                'facebook'        => $event['facebook'],
                'instagram'       => $event['instagram'],
                'otherPlatforms'  => $event['otherPlatforms'],
                'created_at'      => $event['created_at'],
                'updated_at'      => $event['updated_at'],
                'status'          => $event['status'],
            ];
        }
    }

    echo json_encode([
        "success" => true,
        "data"    => array_values($organizedEvents)
    ]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
