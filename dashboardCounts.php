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
    $result = [];

    $stmt1 = $pdo->query("SELECT COUNT(*) AS total FROM businessowner WHERE status = 'approved'");
    $result['businesses'] = $stmt1->fetch(PDO::FETCH_ASSOC)['total'];

    $stmt2 = $pdo->query("SELECT COUNT(*) AS total FROM event WHERE status = 'approved'");
    $result['events'] = $stmt2->fetch(PDO::FETCH_ASSOC)['total'];

    $stmt3 = $pdo->query("SELECT COUNT(*) AS total FROM service WHERE status = 'approved'");
    $result['services'] = $stmt3->fetch(PDO::FETCH_ASSOC)['total'];

    $stmt4 = $pdo->query("SELECT COUNT(*) AS total FROM feedback");
    $result['reviews'] = $stmt4->fetch(PDO::FETCH_ASSOC)['total'];

    echo json_encode(["success" => true, "data" => $result]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
