<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userID = $_POST['userID'] ?? null;
    $fullName = $_POST['fullName'] ?? '';
    $category = $_POST['category'] ?? '';
    $portfolioURL = $_POST['portfolioURL'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $location = $_POST['location'] ?? '';
    $serviceDescription = $_POST['description'] ?? '';
    $availability = $_POST['availability'] ?? '';
    $facebook = $_POST['facebook'] ?? '';
    $linkedin = $_POST['linkedin'] ?? '';
    $other = $_POST['other'] ?? '';
    $servicesOffered = isset($_POST['servicesOffered'])
        ? json_decode($_POST['servicesOffered'], true)
        : [];

    if (empty($userID) || empty($fullName) || empty($category) || empty($email)) {
        echo json_encode([
            "success" => false,
            "message" => "Required fields are missing."
        ]);
        exit;
    }

    $uploadedFiles = [];
    $targetDirectory = "uploads/";
    if (!file_exists($targetDirectory)) {
        mkdir($targetDirectory, 0777, true);
    }

    if (isset($_FILES['photos'])) {
        foreach ($_FILES['photos']['name'] as $key => $fileName) {
            $targetFile = $targetDirectory . basename($fileName);
            if (move_uploaded_file($_FILES['photos']['tmp_name'][$key], $targetFile)) {
                $uploadedFiles[] = $targetFile;
            }
        }
    }

    $photos = implode(',', $uploadedFiles);
    $serviceName = $servicesOffered[0]['serviceName'] ?? '';
    $servicePrice = $servicesOffered[0]['price'] ?? 0;

    try {
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("
            INSERT INTO service (
                userID, fullName, category, portfolioURL, email, 
                phone, location, serviceDescription, availability, photos,
                serviceName, servicePrice
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $userID,
            $fullName,
            $category,
            $portfolioURL,
            $email,
            $phone,
            $location,
            $serviceDescription,
            $availability,
            $photos,
            $serviceName,
            $servicePrice
        ]);

        $serviceID = $pdo->lastInsertId();

        $stmtSocial = $pdo->prepare("
            INSERT INTO socialmedia (serviceID, facebook, linkedin, otherPlatforms)
            VALUES (?, ?, ?, ?)
        ");
        $stmtSocial->execute([$serviceID, $facebook, $linkedin, $other]);

        $pdo->commit();

        echo json_encode([
            "success" => true,
            "message" => "Service application submitted successfully."
        ]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode([
            "success" => false,
            "message" => $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method."
    ]);
}
    