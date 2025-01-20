<?php
require 'api.php';

// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// Specify allowed methods (GET, POST, etc.)
header("Access-Control-Allow-Methods: GET, OPTIONS");

// Specify allowed headers
header("Access-Control-Allow-Headers: Content-Type, Authorization");

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $connection = getConnection();

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if (!isset($_GET['username']) || empty($_GET['username'])) {
            http_response_code(400);
            echo json_encode(["error" => "Username is required."], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $username = $_GET['username'];

        // Buscar o ID do usuário
        $stmtUser = $connection->prepare("SELECT id FROM users WHERE username = ?");
        $stmtUser->bind_param('s', $username);
        $stmtUser->execute();
        $stmtUser->store_result();

        if ($stmtUser->num_rows === 0) {
            http_response_code(404);
            echo json_encode(["error" => "User not found."], JSON_UNESCAPED_UNICODE);
            $stmtUser->close();
            exit;
        }

        $stmtUser->bind_result($user_id);
        $stmtUser->fetch();
        $stmtUser->close();

        $stmtTickets = $connection->prepare("SELECT id, subject, created_at FROM tickets WHERE user_id = ? AND status = 'open'");
        $stmtTickets->bind_param('i', $user_id);
        $stmtTickets->execute();
        $stmtTickets->store_result();

        if ($stmtTickets->num_rows === 0) {
            http_response_code(404);
            echo json_encode(["message" => "No open tickets found for this user."], JSON_UNESCAPED_UNICODE);
            $stmtTickets->close();
            exit;
        }

        $tickets = [];
        $stmtTickets->bind_result($ticket_id, $subject, $created_at);

        while ($stmtTickets->fetch()) {
            $tickets[] = [
                "id" => $ticket_id,
                "subject" => $subject,
                "status" => "open",
                "created_at" => $created_at
            ];
        }

        $stmtTickets->close();

        http_response_code(200);
        echo json_encode(["open_tickets" => $tickets], JSON_UNESCAPED_UNICODE);

    } else {
        http_response_code(405);
        echo json_encode(["error" => "405 Method Not Allowed."]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error.", "details" => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}