<?php declare(strict_types=1);
/*
Plugin Name: Donut Game
Description: Приложение мини-игра. Целью игры является добежать до финиша, не столкнувшись с препятствием.
Version: 1.0
Author: xside
*/

// Подключаем autoloader
require_once __DIR__ . '/vendor/autoload.php';

use DonutGame\ClassAdmin;
use DonutGame\ClassRender;
use DonutGame\ClassResults;

$classAdmin = new ClassAdmin();
$classRender = new ClassRender();
$classResults = new ClassResults();

// Подключаем скрипты и стили
function enqueue_donut_game_scripts(): void{
    wp_enqueue_script('app-core', plugins_url('/js/app.js', __FILE__), array(), null, true);
    wp_enqueue_script('app-script', plugins_url('/js/script.js', __FILE__), array(), null, true);
    wp_enqueue_style('game-css', plugins_url('/css/style.css', __FILE__));
    wp_enqueue_style('popup-css', plugins_url('/css/popup.css', __FILE__));
}
add_action('wp_enqueue_scripts', 'enqueue_donut_game_scripts');


