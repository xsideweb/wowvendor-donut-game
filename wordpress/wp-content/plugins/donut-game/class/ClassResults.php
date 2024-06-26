<?php declare(strict_types=1);

namespace DonutGame;

class ClassResults {
    
    public static function init(): void {
        register_activation_hook(__FILE__, [self::class, 'create_game_results_table']);
        add_action('wp_ajax_save_game_result', [self::class, 'save_game_result']);
        add_action('wp_ajax_nopriv_save_game_result', [self::class, 'save_game_result']);
        add_action('wp_enqueue_scripts', [self::class, 'enqueue_game_result_scripts']);
        add_action('wp_ajax_get_game_results', [self::class, 'get_game_results']);
        add_action('wp_ajax_nopriv_get_game_results', [self::class, 'get_game_results']);
    }

    // Создаём таблицу в базе при активации плагина
    public static function create_game_results_table(): void {
        global $wpdb;
        $table_name = $wpdb->prefix . "game_results";

        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
          id mediumint(9) NOT NULL AUTO_INCREMENT,
          obstacle_position float NOT NULL,
          run_time float NOT NULL,
          jump_distance float NOT NULL,
          obstacle_size float NOT NULL,
          run_result varchar(255) NOT NULL,
          PRIMARY KEY(id)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }

    // Сохраняем результат игры
    public static function save_game_result(): void {
        global $wpdb;

        $obstacle_position = (float) $_POST['obstacle_position'];
        $run_time = (float) $_POST['run_time'];
        $jump_distance = (float) $_POST['jump_distance'];
        $obstacle_size = (float) $_POST['obstacle_size'];
        $run_result = sanitize_text_field($_POST['run_result']);

        $table_name = $wpdb->prefix . 'game_results';

        $wpdb->insert(
            $table_name,
            array(
                'obstacle_position' => $obstacle_position,
                'run_time' => $run_time,
                'jump_distance' => $jump_distance,
                'obstacle_size' => $obstacle_size,
                'run_result' => $run_result
            )
        );

        wp_send_json_success('Результат сохранен успешно.');
    }

    // Включаем скрипты для обработки результатов
    public static function enqueue_game_result_scripts(): void {
        wp_enqueue_script('game-result-script', plugins_url('../js/app.js', __FILE__), [], null, true);
        wp_localize_script('game-result-script', 'gameResultAjax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('game_result_nonce')
        ));
    }

    // Получаем результаты игры
    public static function get_game_results(): void {
        global $wpdb;
        $table_name = $wpdb->prefix . 'game_results';

        $results = $wpdb->get_results("SELECT * FROM $table_name ORDER BY id DESC");

        if ($results) {
            $response = [];
            foreach ($results as $result) {
                $response[] = array(
                    'obstacle_position' => (float) $result->obstacle_position,
                    'run_time' => (float) $result->run_time,
                    'jump_distance' => (float) $result->jump_distance,
                    'obstacle_size' => (float) $result->obstacle_size,
                    'run_result' => $result->run_result,
                );
            }
            wp_send_json_success($response);
        } else {
            wp_send_json_error('Результатов не найдено');
        }
    }
}

ClassResults::init();
