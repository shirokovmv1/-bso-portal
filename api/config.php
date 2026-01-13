<?php
// Конфигурация API
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Обработка preflight запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Путь к файлам данных
define('DATA_DIR', __DIR__ . '/data/');

// Создаём папку data если не существует
if (!file_exists(DATA_DIR)) {
    mkdir(DATA_DIR, 0755, true);
}

// Функция чтения данных
function readData($file) {
    $path = DATA_DIR . $file . '.json';
    if (file_exists($path)) {
        $content = file_get_contents($path);
        return json_decode($content, true) ?: [];
    }
    return [];
}

// Функция записи данных
function writeData($file, $data) {
    $path = DATA_DIR . $file . '.json';
    return file_put_contents($path, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

// Функция ответа
function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Функция ошибки
function error($message, $code = 400) {
    respond(['error' => $message], $code);
}
