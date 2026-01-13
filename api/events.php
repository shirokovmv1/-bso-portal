<?php
// API для событий
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        $events = readData('events');
        if (empty($events)) {
            $events = [
                [
                    'id' => 1,
                    'date' => date('Y-m-d', strtotime('+7 days')),
                    'title' => 'Совещание по проекту',
                    'text' => 'Обсуждение этапов реализации текущих проектов'
                ]
            ];
            writeData('events', $events);
        }
        respond($events);
        break;
        
    case 'POST':
        $events = readData('events');
        $newItem = [
            'id' => time(),
            'date' => $data['date'] ?? date('Y-m-d'),
            'title' => $data['title'] ?? '',
            'text' => $data['text'] ?? ''
        ];
        array_unshift($events, $newItem);
        writeData('events', $events);
        respond($newItem, 201);
        break;
        
    case 'PUT':
        if (!isset($data['id'])) error('ID не указан');
        $events = readData('events');
        foreach ($events as &$item) {
            if ($item['id'] == $data['id']) {
                $item['date'] = $data['date'] ?? $item['date'];
                $item['title'] = $data['title'] ?? $item['title'];
                $item['text'] = $data['text'] ?? $item['text'];
                writeData('events', $events);
                respond($item);
            }
        }
        error('Событие не найдено', 404);
        break;
        
    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) error('ID не указан');
        $events = readData('events');
        $events = array_filter($events, fn($item) => $item['id'] != $id);
        $events = array_values($events);
        writeData('events', $events);
        respond(['success' => true]);
        break;
        
    default:
        error('Метод не поддерживается', 405);
}
