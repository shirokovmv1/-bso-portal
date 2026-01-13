<?php
// API для заявок
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        $applications = readData('applications');
        if (empty($applications)) {
            $applications = [
                [
                    'id' => 1,
                    'name' => 'Заявка на согласование договора',
                    'description' => 'Согласование или изменение договорных документов с контрагентами',
                    'url' => 'forms/contract-request.html'
                ],
                [
                    'id' => 2,
                    'name' => 'Заявка на отпуск',
                    'description' => 'Форма заявления на ежегодный оплачиваемый отпуск',
                    'url' => 'forms/vacation.html'
                ],
                [
                    'id' => 3,
                    'name' => 'Заявка на командировку',
                    'description' => 'Оформление командировочных документов',
                    'url' => 'forms/business-trip.html'
                ]
            ];
            writeData('applications', $applications);
        }
        respond($applications);
        break;
        
    case 'POST':
        $applications = readData('applications');
        $newItem = [
            'id' => time(),
            'name' => $data['name'] ?? '',
            'description' => $data['description'] ?? '',
            'url' => $data['url'] ?? ''
        ];
        $applications[] = $newItem;
        writeData('applications', $applications);
        respond($newItem, 201);
        break;
        
    case 'PUT':
        if (!isset($data['id'])) error('ID не указан');
        $applications = readData('applications');
        foreach ($applications as &$item) {
            if ($item['id'] == $data['id']) {
                $item['name'] = $data['name'] ?? $item['name'];
                $item['description'] = $data['description'] ?? $item['description'];
                $item['url'] = $data['url'] ?? $item['url'];
                writeData('applications', $applications);
                respond($item);
            }
        }
        error('Заявка не найдена', 404);
        break;
        
    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) error('ID не указан');
        $applications = readData('applications');
        $applications = array_filter($applications, fn($item) => $item['id'] != $id);
        $applications = array_values($applications);
        writeData('applications', $applications);
        respond(['success' => true]);
        break;
        
    default:
        error('Метод не поддерживается', 405);
}
