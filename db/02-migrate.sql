UPDATE wp_options SET option_value = REPLACE(option_value, 'http://wowwendor-test', 'http://localhost:8000') WHERE option_name = 'home' OR option_name = 'siteurl';
UPDATE wp_posts SET post_content = REPLACE (post_content, 'http://wowwendor-test', 'http://localhost:8000');
UPDATE wp_posts SET post_excerpt = REPLACE (post_excerpt, 'http://wowwendor-test', 'http://localhost:8000');
UPDATE wp_postmeta SET meta_value = REPLACE (meta_value, 'http://wowwendor-test','http://localhost:8000');
UPDATE wp_termmeta SET meta_value = REPLACE (meta_value, 'http://wowwendor-test','http://localhost:8000');
UPDATE wp_posts SET guid = REPLACE (guid, 'http://wowwendor-test', 'http://localhost:8000') WHERE post_type = 'attachment';

DELETE FROM wp_posts WHERE post_type = "revision";