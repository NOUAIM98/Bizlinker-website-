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
      SELECT adminID, firstName, lastName, email, role, permissions
      FROM admin_users
      WHERE role = 'subadmin'
  ");
  $stmt->execute();
  $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

  $subAdmins = [];
  foreach ($rows as $row) {
      $decoded = [];
      if (!empty($row['permissions'])) {
          $decoded = json_decode($row['permissions'], true);
      }
      $subAdmins[] = [
          'id'    => $row['adminID'],
          'name'  => $row['firstName'].' '.$row['lastName'],
          'photo' => 'uploads/default.png',
          'permissions' => $decoded
      ];
  }

  echo json_encode([
      "success"   => true,
      "subadmins" => $subAdmins
  ]);
} catch (PDOException $e) {
  echo json_encode([
      "success" => false,
      "message" => "DB Error: " . $e->getMessage()
  ]);
}
