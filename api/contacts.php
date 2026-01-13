<?php
// API для контактов
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        $contacts = readData('contacts');
        if (empty($contacts)) {
            $contacts = [
                [
                    'id' => 1,
                    'name' => 'Приёмная',
                    'position' => 'Общие вопросы',
                    'department' => 'Руководство',
                    'phone' => '+7 (495) 147-55-66',
                    'email' => 'info@bso-cc.ru'
                ],
                [
                    'id' => 2,
                    'name' => 'Отдел проектирования',
                    'position' => 'Проектная документация',
                    'department' => 'Проектирование',
                    'phone' => '+7 (495) 147-55-66',
                    'email' => 'project@bso-cc.ru'
                ],
                [
                    'id' => 3,
                    'name' => 'IT отдел',
                    'position' => 'Техническая поддержка',
                    'department' => 'IT отдел',
                    'phone' => '+7 (495) 147-55-66',
                    'email' => 'it@bso-cc.ru'
                ]
            ];
            writeData('contacts', $contacts);
        }
        respond($contacts);
        break;
        
    case 'POST':
        $contacts = readData('contacts');
        $newItem = [
            'id' => time(),
            'name' => $data['name'] ?? '',
            'position' => $data['position'] ?? '',
            'department' => $data['department'] ?? '',
            'phone' => $data['phone'] ?? '',
            'email' => $data['email'] ?? ''
        ];
        $contacts[] = $newItem;
        writeData('contacts', $contacts);
        respond($newItem, 201);
        break;
        
    case 'PUT':
        if (!isset($data['id'])) error('ID не указан');
        $contacts = readData('contacts');
        foreach ($contacts as &$item) {
            if ($item['id'] == $data['id']) {
                $item['name'] = $data['name'] ?? $item['name'];
                $item['position'] = $data['position'] ?? $item['position'];
                $item['department'] = $data['department'] ?? $item['department'];
                $item['phone'] = $data['phone'] ?? $item['phone'];
                $item['email'] = $data['email'] ?? $item['email'];
                writeData('contacts', $contacts);
                respond($item);
            }
        }
        error('Контакт не найден', 404);
        break;
        
    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) error('ID не указан');
        $contacts = readData('contacts');
        $contacts = array_filter($contacts, fn($item) => $item['id'] != $id);
        $contacts = array_values($contacts);
        writeData('contacts', $contacts);
        respond(['success' => true]);
        break;
        
    default:
        error('Метод не поддерживается', 405);
}
