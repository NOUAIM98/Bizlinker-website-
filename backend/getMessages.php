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

$defaultImage = "https://getbizlinker.site/graduation/backend/uploads/default.png";

if (isset($data['user1']) && isset($data['user2'])) {
    $user1 = $data['user1'];
    $user2 = $data['user2'];
    try {
        $stmt = $pdo->prepare("
            SELECT m.*,
              -- For sender info:
              CASE 
                WHEN u_sender.userID IS NOT NULL THEN u_sender.firstName
                ELSE b_sender.businessName
              END AS senderName,
              CASE 
                WHEN u_sender.userID IS NOT NULL THEN COALESCE(NULLIF(u_sender.profilePicture, ''), '$defaultImage')
                ELSE '$defaultImage'
              END AS senderProfileImage,
              -- For receiver info:
              CASE 
                WHEN u_receiver.userID IS NOT NULL THEN u_receiver.firstName
                ELSE b_receiver.businessName
              END AS receiverName,
              CASE 
                WHEN u_receiver.userID IS NOT NULL THEN COALESCE(NULLIF(u_receiver.profilePicture, ''), '$defaultImage')
                ELSE '$defaultImage'
              END AS receiverProfileImage
            FROM messages m
            LEFT JOIN user u_sender ON m.senderID = u_sender.userID
            LEFT JOIN businessowner b_sender ON m.senderID = b_sender.ownerID
            LEFT JOIN user u_receiver ON m.receiverID = u_receiver.userID
            LEFT JOIN businessowner b_receiver ON m.receiverID = b_receiver.ownerID
            WHERE (m.senderID = ? AND m.receiverID = ?)
               OR (m.senderID = ? AND m.receiverID = ?)
            ORDER BY m.created_at ASC
        ");
        $stmt->execute([$user1, $user2, $user2, $user1]);
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["success" => true, "messages" => $messages]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
} 
elseif (isset($data['id'])) {
    $id = $data['id'];
    try {
        $stmt = $pdo->prepare("
            SELECT m.*,
              CASE 
                WHEN u_sender.userID IS NOT NULL THEN u_sender.firstName
                ELSE b_sender.businessName
              END AS senderName,
              CASE 
                WHEN u_sender.userID IS NOT NULL THEN COALESCE(NULLIF(u_sender.profilePicture, ''), '$defaultImage')
                ELSE '$defaultImage'
              END AS senderProfileImage,
              CASE 
                WHEN u_receiver.userID IS NOT NULL THEN u_receiver.firstName
                ELSE b_receiver.businessName
              END AS receiverName,
              CASE 
                WHEN u_receiver.userID IS NOT NULL THEN COALESCE(NULLIF(u_receiver.profilePicture, ''), '$defaultImage')
                ELSE '$defaultImage'
              END AS receiverProfileImage
            FROM messages m
            LEFT JOIN user u_sender ON m.senderID = u_sender.userID
            LEFT JOIN businessowner b_sender ON m.senderID = b_sender.ownerID
            LEFT JOIN user u_receiver ON m.receiverID = u_receiver.userID
            LEFT JOIN businessowner b_receiver ON m.receiverID = b_receiver.ownerID
            WHERE m.senderID = ? OR m.receiverID = ?
            ORDER BY m.created_at DESC
        ");
        $stmt->execute([$id, $id]);
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["success" => true, "messages" => $messages]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Missing parameters"]);
}
?>
