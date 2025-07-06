<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  exit(0);
}

require 'db_connection.php';

$input = json_decode(file_get_contents('php://input'), true);
$reviews = $input['reviews'] ?? [];
$targetID = $input['targetID'] ?? null;
$reviewType = $input['reviewType'] ?? '';

if (!$targetID || !$reviewType) {
  echo json_encode(["success" => false, "message" => "Missing ID or review type."]);
  exit;
}

if (empty($reviews)) {
  echo json_encode(["success" => false, "message" => "No reviews provided."]);
  exit;
}

$tableMap = [
  "business" => "businessID",
  "event" => "eventID",
  "service" => "serviceID"
];

if (!isset($tableMap[$reviewType])) {
  echo json_encode(["success" => false, "message" => "Invalid review type."]);
  exit;
}

$keyColumn = $tableMap[$reviewType];
$reviewCount = count($reviews);

$stmt = $pdo->prepare("SELECT summary, lastReviewCount FROM ai_summary WHERE $keyColumn = ?");
$stmt->execute([$targetID]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if ($row) {
  $lastCount = (int) $row['lastReviewCount'];
  if ($reviewCount < 5 || $reviewCount % 5 !== 0 || $reviewCount === $lastCount) {
    echo json_encode(["success" => true, "summary" => $row['summary']]);
    exit;
  }
}

if ($reviewCount < 5) {
  echo json_encode(["success" => false, "message" => "Waiting for more reviews to generate summary."]);
  exit;
}

$joinedReviews = implode("\n- ", $reviews);

$apiKey = "";

$data = [
  "model" => "gpt-3.5-turbo",
  "messages" => [
    [
      "role" => "system",
      "content" => "You are an assistant that summarizes customer reviews in a clear and helpful paragraph. Do not repeat reviews verbatim or use quotes. Focus on highlighting overall themes, quality, strengths, and tone."
    ],
    [
      "role" => "user",
      "content" => "Summarize the following customer reviews:\n- " . $joinedReviews
    ]
  ]
];

$ch = curl_init("https://api.openai.com/v1/chat/completions");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  "Authorization: Bearer $apiKey",
  "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
$response = curl_exec($ch);

if (curl_errno($ch)) {
  echo json_encode(["success" => false, "message" => "cURL error: " . curl_error($ch)]);
  exit;
}

curl_close($ch);
file_put_contents("openai_response_log.json", $response);
$result = json_decode($response, true);
$summary = $result['choices'][0]['message']['content'] ?? "No summary available.";

$pdo->prepare("DELETE FROM ai_summary WHERE $keyColumn = ?")->execute([$targetID]);

$insert = $pdo->prepare("
  INSERT INTO ai_summary ($keyColumn, summary, lastReviewCount)
  VALUES (?, ?, ?)
");
$insert->execute([$targetID, $summary, $reviewCount]);

echo json_encode(["success" => true, "summary" => $summary]);
