<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require 'db_connection.php';

// DEBUG: log incoming request to debug.txt
$inputData = json_decode(file_get_contents('php://input'), true);
file_put_contents('debug.txt', json_encode($inputData) . PHP_EOL, FILE_APPEND);

$email = $inputData['email'];
$password = $inputData['password'];

if (empty($email) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM user WHERE email = :email");
$stmt->bindParam(':email', $email);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
    exit;
}

if (!empty($user['isDeleted']) && $user['isDeleted'] == 1) {
    echo json_encode(['status' => 'error', 'message' => 'Account Does Not Exist']);
    exit;
}

$hashed_password = $user['password'];

if (password_verify($password, $hashed_password)) {
    echo json_encode([
        'status' => 'success',
        'message' => 'You have successfully logged in',
        'user' => [
            'userID' => $user['userID'],
            'firstName' => $user['firstName'],
            'lastName' => $user['lastName'],
            'email' => $user['email'],
            'phone' => $user['phone'],
            'profilePicture' => $user['profilePicture']
        ]
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
}
