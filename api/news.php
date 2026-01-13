<?php
// API для новостей
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        // Получить все новости
        $news = readData('news');
        if (empty($news)) {
            // Данные по умолчанию
            $news = [
                [
                    'id' => 1,
                    'date' => date('Y-m-d'),
                    'title' => 'Добро пожаловать на корпоративный портал БСО!',
                    'text' => 'Строим будущее с надёжностью и инновациями. Более 15 лет опыта в строительстве.'
                ]
            ];
            writeData('news', $news);
        }
        respond($news);
        break;
        
    case 'POST':
        // Добавить новость
        $news = readData('news');
        $newItem = [
            'id' => time(),
            'date' => $data['date'] ?? date('Y-m-d'),
            'title' => $data['title'] ?? '',
            'text' => $data['text'] ?? ''
        ];
        array_unshift($news, $newItem);
        writeData('news', $news);
        respond($newItem, 201);
        break;
        
    case 'PUT':
        // Обновить новость
        if (!isset($data['id'])) error('ID не указан');
        $news = readData('news');
        foreach ($news as &$item) {
            if ($item['id'] == $data['id']) {
                $item['date'] = $data['date'] ?? $item['date'];
                $item['title'] = $data['title'] ?? $item['title'];
                $item['text'] = $data['text'] ?? $item['text'];
                writeData('news', $news);
                respond($item);
            }
        }
        error('Новость не найдена', 404);
        break;
        
    case 'DELETE':
        // Удалить новость
        $id = $_GET['id'] ?? null;
        if (!$id) error('ID не указан');
        $news = readData('news');
        $news = array_filter($news, fn($item) => $item['id'] != $id);
        $news = array_values($news);
        writeData('news', $news);
        respond(['success' => true]);
        break;
        
    default:
        error('Метод не поддерживается', 405);
}
