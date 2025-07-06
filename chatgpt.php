<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$apiKey = "";

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);
$userMessage = $input['message'] ?? '';

if (!$userMessage) {
    echo json_encode(["error" => "No message provided"]);
    exit;
}

$chatRequest = [
    "model" => "gpt-3.5-turbo",
    "messages" => [
        [
            "role" => "system",
            "content" => "You are Nova, the multilingual AI assistant for BizLinker — a platform where businesses, events, and service providers can list their offerings for visibility and promotion. Users can browse listings, leave comments, write reviews, and discover new local services.
          
          You automatically detect and respond in the user's language.
          
          If someone wants to list a business, direct them to: https://getbizlinker.site/business-application-form
          
          If they want to list a service, direct them to: https://getbizlinker.site/service-application-form
          
          If they want to post an event, direct them to: https://getbizlinker.site/event-application-form
          
          If a user asks to speak with a real person, give them this contact info:
          Email: help@bizlinker.com
          Phone: +1-312-841-8827 (Toll Free)
          
          If they tell you their name, remember it for the conversation. Be warm and friendly, and personalize replies when possible.
          
          Only help with questions related to the BizLinker platform."
        ],
        [
            "role" => "user",
            "content" => $userMessage
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
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($chatRequest));

$response = curl_exec($ch);
curl_close($ch);

$responseData = json_decode($response, true);
$botReply = $responseData['choices'][0]['message']['content'] ?? "Sorry, I couldn't respond.";

echo json_encode(["reply" => $botReply]);
