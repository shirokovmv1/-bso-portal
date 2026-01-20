<?php
// API для авторизации
session_start();
require_once 'config.php';

// Файл с учётными данными администраторов
define('USERS_FILE', DATA_DIR . 'users.json');

// Инициализация пользователей по умолчанию
function initUsers() {
    if (!file_exists(USERS_FILE)) {
        $defaultUsers = [
            [
                'id' => 1,
                'username' => 'mshirokov',
                'password' => '$2b$12$N02rsFK5mL1tfXjyzBKkreJ2mypT7eJLTcIsAGHCBHMhBiLuRclrK',
                'name' => 'Михаил Широков',
                'role' => 'admin',
                'created' => date('Y-m-d H:i:s')
            ],
            [
                'id' => 2,
                'username' => 'afateeva',
                'password' => '$2b$12$HReixGMZdCEoeZ8rrjawZ.TYi3jGadEk388X2uMLm9KMqCHu7msOq',
                'name' => 'Анна Фатеева',
                'role' => 'admin',
                'created' => date('Y-m-d H:i:s')
            ],
            [
                'id' => 3,
                'username' => 'adminit',
                'password' => '$2b$12$JjoX2kZ9N3R0dncEfaW9gu/jdMy4H3lcqHDEQB3x7A8ABllyegfe2',
                'name' => 'Администратор ИТ',
                'role' => 'admin',
                'created' => date('Y-m-d H:i:s')
            ],
            [
                'id' => 4,
                'username' => 'skashirtsev',
                'password' => '$2b$12$.luxbLGzIUclf9TiMq.IC.pFZ3f.ZgAeUbidlHxCX6iDzdX72JBpC',
                'name' => 'Сергей Каширцев',
                'role' => 'admin',
                'created' => date('Y-m-d H:i:s')
            ]
        ];
        writeData('users', $defaultUsers);
    }
}

initUsers();

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        if ($method !== 'POST') error('Метод не поддерживается', 405);
        
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        
        if (!$username || !$password) {
            error('Введите логин и пароль', 400);
        }
        
        $users = readData('users');
        $user = null;
        
        foreach ($users as $u) {
            if ($u['username'] === $username && password_verify($password, $u['password'])) {
                $user = $u;
                break;
            }
        }
        
        if (!$user) {
            error('Неверный логин или пароль', 401);
        }
        
        // Создаём сессию
        session_regenerate_id(true);
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['name'] = $user['name'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['logged_in'] = true;
        
        // Генерируем токен для клиента
        $token = bin2hex(random_bytes(32));
        $_SESSION['token'] = $token;
        
        respond([
            'success' => true,
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'name' => $user['name'],
                'role' => $user['role']
            ],
            'token' => $token
        ]);
        break;
        
    case 'logout':
        session_destroy();
        respond(['success' => true]);
        break;
        
    case 'check':
        if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
            respond([
                'authenticated' => true,
                'user' => [
                    'id' => $_SESSION['user_id'],
                    'username' => $_SESSION['username'],
                    'name' => $_SESSION['name'],
                    'role' => $_SESSION['role']
                ]
            ]);
        } else {
            respond(['authenticated' => false]);
        }
        break;
        
    case 'change-password':
        if ($method !== 'POST') error('Метод не поддерживается', 405);
        
        if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
            error('Не авторизован', 401);
        }
        
        $oldPassword = $data['oldPassword'] ?? '';
        $newPassword = $data['newPassword'] ?? '';
        
        if (!$oldPassword || !$newPassword) {
            error('Заполните все поля', 400);
        }
        
        if (strlen($newPassword) < 6) {
            error('Пароль должен быть не менее 6 символов', 400);
        }
        
        $users = readData('users');
        $updated = false;
        
        foreach ($users as &$user) {
            if ($user['id'] === $_SESSION['user_id']) {
                if (!password_verify($oldPassword, $user['password'])) {
                    error('Неверный текущий пароль', 400);
                }
                $user['password'] = password_hash($newPassword, PASSWORD_DEFAULT);
                $updated = true;
                break;
            }
        }
        
        if ($updated) {
            writeData('users', $users);
            respond(['success' => true, 'message' => 'Пароль успешно изменён']);
        } else {
            error('Пользователь не найден', 404);
        }
        break;
        
    default:
        error('Неизвестное действие', 400);
}
