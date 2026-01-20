<?php
require_once 'config.php';

date_default_timezone_set('Europe/Moscow');

define('HELPDESK_COUNTER_FILE', DATA_DIR . 'helpdesk_counter.json');
define('HELPDESK_REGISTRY_FILE', DATA_DIR . 'helpdesk_registry.csv');
define('HELPDESK_FROM_EMAIL', 'no_reply@bso-cc.ru');
define('HELPDESK_TO_EMAIL', 'helpdesk@bso-cc.ru');
define('HELPDESK_MAX_FILE_SIZE', 5 * 1024 * 1024);

function getCounter() {
    if (!file_exists(HELPDESK_COUNTER_FILE)) {
        return ['date' => '', 'seq' => 0];
    }
    $data = json_decode(file_get_contents(HELPDESK_COUNTER_FILE), true);
    if (!is_array($data)) {
        return ['date' => '', 'seq' => 0];
    }
    return $data + ['date' => '', 'seq' => 0];
}

function saveCounter($counter) {
    file_put_contents(HELPDESK_COUNTER_FILE, json_encode($counter, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

function getDateKey() {
    return date('dmy');
}

function formatRequestNumber($seq, $dateKey) {
    return $seq . '_' . $dateKey;
}

function nextRequestNumber($reserve) {
    $dateKey = getDateKey();
    $counter = getCounter();
    if (($counter['date'] ?? '') !== $dateKey) {
        $counter = ['date' => $dateKey, 'seq' => 0];
    }

    $nextSeq = ($counter['seq'] ?? 0) + 1;

    if ($reserve) {
        $counter['seq'] = $nextSeq;
        saveCounter($counter);
    }

    return formatRequestNumber($nextSeq, $dateKey);
}

function appendRegistry($createdAt, $requestNumber, $name, $category, $status) {
    $isNew = !file_exists(HELPDESK_REGISTRY_FILE);
    $row = [$createdAt, $requestNumber, $name, $category, $status];
    $line = implode(';', array_map(function($value) {
        $escaped = str_replace('"', '""', $value);
        return '"' . $escaped . '"';
    }, $row)) . "\r\n";

    if ($isNew) {
        $header = ['Дата и время заявки', 'Номер заявки', 'ФИО сотрудника', 'Категория проблемы', 'Статус'];
        $headerLine = implode(';', array_map(function($value) {
            $escaped = str_replace('"', '""', $value);
            return '"' . $escaped . '"';
        }, $header)) . "\r\n";
        file_put_contents(HELPDESK_REGISTRY_FILE, "\xEF\xBB\xBF" . $headerLine, FILE_APPEND);
    }

    file_put_contents(HELPDESK_REGISTRY_FILE, $line, FILE_APPEND);
}

function sendMailWithAttachments($to, $subject, $html, $from, $attachments = [], $replyTo = null) {
    $boundary = 'bso-' . md5(uniqid('', true));
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "From: {$from}\r\n";
    if ($replyTo) {
        $headers .= "Reply-To: {$replyTo}\r\n";
    }
    $headers .= "Content-Type: multipart/mixed; boundary=\"{$boundary}\"\r\n";

    $body = "--{$boundary}\r\n";
    $body .= "Content-Type: text/html; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $body .= chunk_split(base64_encode($html)) . "\r\n";

    foreach ($attachments as $attachment) {
        $body .= "--{$boundary}\r\n";
        $body .= "Content-Type: {$attachment['type']}; name=\"{$attachment['name']}\"\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n";
        $body .= "Content-Disposition: attachment; filename=\"{$attachment['name']}\"\r\n\r\n";
        $body .= chunk_split(base64_encode($attachment['content'])) . "\r\n";
    }

    $body .= "--{$boundary}--";

    return mail($to, $subject, $body, $headers);
}

$action = $_GET['action'] ?? '';

if ($action === 'meta') {
    respond([
        'requestNumber' => nextRequestNumber(false),
        'createdAt' => date('d.m.Y H:i'),
        'serverTime' => date('c')
    ]);
}

if ($action === 'reserve') {
    respond([
        'requestNumber' => nextRequestNumber(true),
        'createdAt' => date('d.m.Y H:i'),
        'serverTime' => date('c')
    ]);
}

if ($action === 'submit') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        error('Метод не поддерживается', 405);
    }

    $requestNumber = trim($_POST['requestNumber'] ?? '');
    $createdAt = trim($_POST['createdAt'] ?? '');
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $category = trim($_POST['category'] ?? '');
    $anydesk = trim($_POST['anydesk'] ?? 'НЕТ');
    $description = trim($_POST['description'] ?? '');
    $pdfBase64 = trim($_POST['pdfBase64'] ?? '');

    if (!$requestNumber) {
        $requestNumber = nextRequestNumber(true);
    }
    if (!$createdAt) {
        $createdAt = date('d.m.Y H:i');
    }
    if (!$name || !$email || !$phone || !$category || !$description || !$pdfBase64) {
        error('Заполните все обязательные поля', 400);
    }
    if (!preg_match('/^\+7\d{10}$/', $phone)) {
        error('Телефон должен быть в формате +71234567890', 400);
    }

    $attachments = [];
    if (!empty($_FILES['attachment'])) {
        if ($_FILES['attachment']['error'] === UPLOAD_ERR_INI_SIZE || $_FILES['attachment']['error'] === UPLOAD_ERR_FORM_SIZE) {
            error('Размер загружаемого файла более 5Мб', 400);
        }
        if ($_FILES['attachment']['size'] > HELPDESK_MAX_FILE_SIZE) {
            error('Размер загружаемого файла более 5Мб', 400);
        }
    }

    if (!empty($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['attachment'];
        $content = file_get_contents($file['tmp_name']);
        $safeName = preg_replace('/[^A-Za-z0-9_\.\-]+/u', '_', $file['name']);
        $attachments[] = [
            'name' => $safeName ?: 'attachment',
            'type' => $file['type'] ?: 'application/octet-stream',
            'content' => $content
        ];
    }

    $pdfBinary = base64_decode($pdfBase64, true);
    if ($pdfBinary === false) {
        error('Некорректный PDF', 400);
    }

    $pdfAttachment = [
        'name' => 'helpdesk_' . $requestNumber . '.pdf',
        'type' => 'application/pdf',
        'content' => $pdfBinary
    ];

    $helpdeskHtml = ''
        . '<strong>Номер заявки:</strong> ' . htmlspecialchars($requestNumber, ENT_QUOTES, 'UTF-8') . '<br>'
        . '<strong>Дата и время заявки:</strong> ' . htmlspecialchars($createdAt, ENT_QUOTES, 'UTF-8') . '<br>'
        . '<strong>ФИО сотрудника:</strong> ' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '<br>'
        . '<strong>E-mail сотрудника:</strong> ' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '<br>'
        . '<strong>Телефон для связи:</strong> ' . htmlspecialchars($phone, ENT_QUOTES, 'UTF-8') . '<br>'
        . '<strong>Категория проблемы:</strong> ' . htmlspecialchars($category, ENT_QUOTES, 'UTF-8') . '<br>'
        . '<strong>Any Desk установлен:</strong> ' . htmlspecialchars($anydesk, ENT_QUOTES, 'UTF-8') . '<br>'
        . '<strong>Описание проблемы:</strong><br>' . nl2br(htmlspecialchars($description, ENT_QUOTES, 'UTF-8'));

    $userHtml = ''
        . '<span style="font-weight:bold;font-size:14px;text-decoration:underline;">Это письмо сгенерировано автоматически. отвечать на данное письмо не надо.</span><br><br>'
        . 'Ваша заявка ' . htmlspecialchars($requestNumber, ENT_QUOTES, 'UTF-8') . ' сформирована и отправлена в ИТ поддержку, ожидайте ответ.<br>'
        . 'Если вопрос критический, свяжитесь ИТ поддержкой самостоятельно по телефону: 8 495 968 72 31<br>'
        . 'Все заявки формируются и сохраняются в реестре.';

    $helpdeskSent = sendMailWithAttachments(
        HELPDESK_TO_EMAIL,
        'Заявка БСО (' . $requestNumber . ')',
        $helpdeskHtml,
        HELPDESK_FROM_EMAIL,
        $attachments,
        $email
    );

    $userSent = sendMailWithAttachments(
        $email,
        'Заявка в ИТ (' . $requestNumber . ')',
        $userHtml,
        HELPDESK_FROM_EMAIL,
        [$pdfAttachment]
    );

    appendRegistry($createdAt, $requestNumber, $name, $category, 'Новая');

    if (!$helpdeskSent || !$userSent) {
        error('Не удалось отправить письмо', 500);
    }

    respond([
        'success' => true,
        'requestNumber' => $requestNumber
    ]);
}

if ($action !== '') {
    error('Неизвестное действие', 400);
}

// CRUD for Helpdesk categories
$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        $categories = readData('helpdesk');
        if (empty($categories)) {
            $categories = [
                ['id' => 1, 'label' => 'Доступы и учетные записи', 'value' => 'Доступы и учетные записи'],
                ['id' => 2, 'label' => 'ПО и лицензии', 'value' => 'ПО и лицензии'],
                ['id' => 3, 'label' => 'Компьютер/ноутбук', 'value' => 'Компьютер/ноутбук'],
                ['id' => 4, 'label' => 'Принтер/сканер', 'value' => 'Принтер/сканер'],
                ['id' => 5, 'label' => 'Сеть/интернет', 'value' => 'Сеть/интернет']
            ];
            writeData('helpdesk', $categories);
        }
        respond($categories);
        break;
    case 'POST':
        requireAuth();
        $categories = readData('helpdesk');
        $newItem = [
            'id' => time(),
            'label' => $data['label'] ?? '',
            'value' => $data['value'] ?? ''
        ];
        $categories[] = $newItem;
        writeData('helpdesk', $categories);
        respond($newItem, 201);
        break;
    case 'PUT':
        requireAuth();
        if (!isset($data['id'])) error('ID не указан');
        $categories = readData('helpdesk');
        foreach ($categories as &$item) {
            if ($item['id'] == $data['id']) {
                $item['label'] = $data['label'] ?? $item['label'];
                $item['value'] = $data['value'] ?? $item['value'];
                writeData('helpdesk', $categories);
                respond($item);
            }
        }
        error('Категория не найдена', 404);
        break;
    case 'DELETE':
        requireAuth();
        $id = $_GET['id'] ?? null;
        if (!$id) error('ID не указан');
        $categories = readData('helpdesk');
        $categories = array_filter($categories, fn($item) => $item['id'] != $id);
        $categories = array_values($categories);
        writeData('helpdesk', $categories);
        respond(['success' => true]);
        break;
    default:
        error('Метод не поддерживается', 405);
}
<?php
// API для категорий Help Desk
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        $categories = readData('helpdesk');
        if (empty($categories)) {
            $categories = [
                ['id' => 1, 'value' => 'hardware', 'label' => 'Оборудование (ПК, принтер, монитор)'],
                ['id' => 2, 'value' => 'software', 'label' => 'Программное обеспечение'],
                ['id' => 3, 'value' => 'network', 'label' => 'Сеть и интернет'],
                ['id' => 4, 'value' => 'email', 'label' => 'Электронная почта'],
                ['id' => 5, 'value' => 'access', 'label' => 'Доступ и пароли'],
                ['id' => 6, 'value' => '1c', 'label' => '1С и учётные системы'],
                ['id' => 7, 'value' => 'other', 'label' => 'Другое']
            ];
            writeData('helpdesk', $categories);
        }
        respond($categories);
        break;

    case 'POST':
        requireAuth();
        $categories = readData('helpdesk');
        $newItem = [
            'id' => time(),
            'value' => $data['value'] ?? '',
            'label' => $data['label'] ?? ''
        ];
        $categories[] = $newItem;
        writeData('helpdesk', $categories);
        respond($newItem, 201);
        break;

    case 'PUT':
        requireAuth();
        if (!isset($data['id'])) error('ID не указан');
        $categories = readData('helpdesk');
        foreach ($categories as &$item) {
            if ($item['id'] == $data['id']) {
                $item['value'] = $data['value'] ?? $item['value'];
                $item['label'] = $data['label'] ?? $item['label'];
                writeData('helpdesk', $categories);
                respond($item);
            }
        }
        error('Категория не найдена', 404);
        break;

    case 'DELETE':
        requireAuth();
        $id = $_GET['id'] ?? null;
        if (!$id) error('ID не указан');
        $categories = readData('helpdesk');
        $categories = array_filter($categories, fn($item) => $item['id'] != $id);
        $categories = array_values($categories);
        writeData('helpdesk', $categories);
        respond(['success' => true]);
        break;

    default:
        error('Метод не поддерживается', 405);
}
