<?php
// API для FAQ
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        $faq = readData('faq');
        if (empty($faq)) {
            $faq = [
                [
                    'id' => 1,
                    'question' => 'Как подключиться к корпоративной сети VPN?',
                    'answer' => 'Для подключения к VPN необходимо установить приложение OpenVPN и использовать конфигурационный файл, который можно получить в IT отделе.'
                ],
                [
                    'id' => 2,
                    'question' => 'Как сбросить пароль от учётной записи?',
                    'answer' => 'Обратитесь в IT отдел по телефону или создайте заявку через Help Desk.'
                ],
                [
                    'id' => 3,
                    'question' => 'Как получить доступ к общим папкам?',
                    'answer' => 'Доступ к общим папкам предоставляется руководителем отдела через заявку в IT.'
                ]
            ];
            writeData('faq', $faq);
        }
        respond($faq);
        break;
        
    case 'POST':
        $faq = readData('faq');
        $newItem = [
            'id' => time(),
            'question' => $data['question'] ?? '',
            'answer' => $data['answer'] ?? ''
        ];
        $faq[] = $newItem;
        writeData('faq', $faq);
        respond($newItem, 201);
        break;
        
    case 'PUT':
        if (!isset($data['id'])) error('ID не указан');
        $faq = readData('faq');
        foreach ($faq as &$item) {
            if ($item['id'] == $data['id']) {
                $item['question'] = $data['question'] ?? $item['question'];
                $item['answer'] = $data['answer'] ?? $item['answer'];
                writeData('faq', $faq);
                respond($item);
            }
        }
        error('FAQ не найден', 404);
        break;
        
    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) error('ID не указан');
        $faq = readData('faq');
        $faq = array_filter($faq, fn($item) => $item['id'] != $id);
        $faq = array_values($faq);
        writeData('faq', $faq);
        respond(['success' => true]);
        break;
        
    default:
        error('Метод не поддерживается', 405);
}
