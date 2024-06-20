// Сохраняем результаты
jQuery(document).ready(function($) {
    function saveGameResult(data) {
        $.ajax({
            method: "POST",
            url: gameResultAjax.ajax_url,
            data: {
                action: 'save_game_result',
                obstacle_position: data.obstaclePosition,
                run_time: data.runTime,
                jump_distance: data.jumpDistance,
                obstacle_size: data.obstacleSize,
                run_result: data.runResult,
                _ajax_nonce: gameResultAjax.nonce
            },
            success: function(response) {
                console.log(response);
                updateGameResults(); // Обновление результатов
            },
            error: function(error) {
                console.error(error);
            }
        });
    }
    window.saveGameResult = saveGameResult;
    // Обновления результатов при загрузке страницы
    updateGameResults();
});

// Обновляем результаты в таблице
function updateGameResults() {
    jQuery.ajax({
        method: "POST",
        url: gameResultAjax.ajax_url,
        data: {
            action: 'get_game_results',
            _ajax_nonce: gameResultAjax.nonce
        },
        success: function(response) {
            if (response.success) {
                var results = response.data;
                var tableHtml = '<thead><th>Время забега</th><th>Позиция препятствия</th><th>Дистанция прыжка</th><th>Размер препятствия</th><th>Результат</th></thead>';
                results.sort((a, b) => parseFloat(a.run_time) - parseFloat(b.run_time));
                results.forEach(function(result) {
                    tableHtml += '<tr>';
                    tableHtml += '<td>' + result.run_time + ' s</td>';
                    tableHtml += '<td>' + result.obstacle_position + '</td>';
                    tableHtml += '<td>' + result.jump_distance + '</td>';
                    tableHtml += '<td>' + result.obstacle_size + '</td>';
                    tableHtml += '<td>' + result.run_result + '</td>';
                    tableHtml += '</tr>';
                });
                jQuery('.game-results-table').html(tableHtml);
            } else {
                console.error('Error:', response.data);
            }
        },
        error: function(error) {
            console.error(error);
        }
    });
}
