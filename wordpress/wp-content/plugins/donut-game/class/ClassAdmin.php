<?php declare(strict_types=1);

namespace DonutGame;
require_once plugin_dir_path(__FILE__) . 'ClassRender.php';

class ClassAdmin {
    // Отображение игры на страницах и постах с помощью чекбокса в админке
    public static function init(): void {
        add_filter('the_content', [self::class, 'insert_donut_game']);
        add_action('add_meta_boxes', [self::class, 'add_game_display_meta_box']);
        add_action('save_post', [self::class, 'save_game_display_meta']);
    }

    public static function insert_donut_game(string $content): string {
        if (is_singular(['post', 'page'])) {
            $game_display = get_post_meta(get_the_ID(), 'game_display', true);
            if ($game_display === '1') {
                $content = ClassRender::render_donut_game() . $content;
            }
        }
        return $content;
    }

    public static function add_game_display_meta_box(): void {
        $screens = ['post', 'page'];
        foreach ($screens as $screen) {
            add_meta_box('game_display_meta_box', 'Игра "Пончик"', [self::class, 'game_display_meta_box_callback'], $screen, 'side', 'default');
        }
    }

    public static function game_display_meta_box_callback(\WP_Post $post): void {
        $game_display = get_post_meta($post->ID, 'game_display', true);
        ?>
        <input type="checkbox" name="game_display" value="1" <?php checked($game_display, '1'); ?>> Отображать игру
        <?php
    }

    public static function save_game_display_meta(int $post_id): void {
        if (array_key_exists('game_display', $_POST)) {
            update_post_meta($post_id, 'game_display', '1');
        } else {
            delete_post_meta($post_id, 'game_display');
        }
    }
}

ClassAdmin::init();

?>
