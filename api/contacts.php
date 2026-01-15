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
                    'company' => 'БСО',
                    'internalNumber' => '',
                    'birthDate' => '',
                    'phone' => '+7 (495) 147-55-66',
                    'email' => 'info@bso-cc.ru'
                ],
                [
                    'id' => 2,
                    'name' => 'Отдел проектирования',
                    'position' => 'Проектная документация',
                    'company' => 'БСО',
                    'internalNumber' => '',
                    'birthDate' => '',
                    'phone' => '+7 (495) 147-55-66',
                    'email' => 'project@bso-cc.ru'
                ],
                [
                    'id' => 3,
                    'name' => 'IT отдел',
                    'position' => 'Техническая поддержка',
                    'company' => 'БСО',
                    'internalNumber' => '',
                    'birthDate' => '',
                    'phone' => '+7 (495) 147-55-66',
                    'email' => 'it@bso-cc.ru'
                ]
            ];
            writeData('contacts', $contacts);
        }
        $contacts = array_map(function ($item) {
            return [
                'id' => $item['id'] ?? round(microtime(true) * 1000),
                'name' => $item['name'] ?? '',
                'position' => $item['position'] ?? '',
                'company' => $item['company'] ?? ($item['department'] ?? ''),
                'internalNumber' => $item['internalNumber'] ?? '',
                'birthDate' => $item['birthDate'] ?? '',
                'phone' => $item['phone'] ?? '',
                'email' => $item['email'] ?? ''
            ];
        }, $contacts);
        respond($contacts);
        break;
        
    case 'POST':
        requireAuth();
        $contacts = readData('contacts');
        $incomingId = $data['id'] ?? null;
        $newItem = [
            'id' => is_numeric($incomingId) ? (int)$incomingId : round(microtime(true) * 1000),
            'name' => $data['name'] ?? '',
            'position' => $data['position'] ?? '',
            'company' => $data['company'] ?? '',
            'internalNumber' => $data['internalNumber'] ?? '',
            'birthDate' => $data['birthDate'] ?? '',
            'phone' => $data['phone'] ?? '',
            'email' => $data['email'] ?? ''
        ];
        $contacts[] = $newItem;
        writeData('contacts', $contacts);
        respond($newItem, 201);
        break;
        
    case 'PUT':
        requireAuth();
        if (!isset($data['id'])) error('ID не указан');
        $contacts = readData('contacts');
        foreach ($contacts as &$item) {
            if ($item['id'] == $data['id']) {
                $item['name'] = $data['name'] ?? $item['name'];
                $item['position'] = $data['position'] ?? $item['position'];
                $item['company'] = $data['company'] ?? ($item['company'] ?? '');
                $item['internalNumber'] = $data['internalNumber'] ?? ($item['internalNumber'] ?? '');
                $item['birthDate'] = $data['birthDate'] ?? ($item['birthDate'] ?? '');
                $item['phone'] = $data['phone'] ?? $item['phone'];
                $item['email'] = $data['email'] ?? $item['email'];
                writeData('contacts', $contacts);
                respond($item);
            }
        }
        error('Контакт не найден', 404);
        break;
        
    case 'DELETE':
        requireAuth();
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
