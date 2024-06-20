<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wowwendor' );

/** Database username */
define( 'DB_USER', 'user' );

/** Database password */
define( 'DB_PASSWORD', 'pass' );

/** Database hostname */
define( 'DB_HOST', 'db:3306' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '`x`xnS)8^.Mb^}5om6mE^wV]?<=v$[qn.}8tNC|C88NB[iI)DE4~bn-Ck~HByVf|' );
define( 'SECURE_AUTH_KEY',  '#A(p@9|O.YL|1?)v-bT*f^/%s]_]l9|X]>#9vb-$)&OHgzIk8`*$44U<c(e#Iqb=' );
define( 'LOGGED_IN_KEY',    'jSY0cN!K50cVs4<gjw(A%ea%qYVe-;Sc%l]T|Z~<IOtyvA%_cVjnIBvbb~n2O1Ao' );
define( 'NONCE_KEY',        '8)_W&w:ELHtw%%qFmuw_<qAByG-)&L>Jwf6bCw,C36$ov#x#Xl1IW/s{U`:%w[rK' );
define( 'AUTH_SALT',        '[6?@rNGZcdcWVgnzAv>Z(:^MjQldC3l:+RHV_3VM$>V@@URL{KYCDakMf[Q,,tRh' );
define( 'SECURE_AUTH_SALT', ',zo,4k3Y%+y-Vhl`-{f0EnE{J/eUGb$nUt)qe&%g^Ia|wj+$k[A!n]10Va1G*OU{' );
define( 'LOGGED_IN_SALT',   'LVEm|b A!F<x#WiKpW6[|Ft#yZEFy2)AZN%Z|AoDWcw1v(eZ_sjCp6.#a@K,7xKT' );
define( 'NONCE_SALT',       '`<)!# aM))0N*fV(=(P@Ym9M9B;Smo>kkMe.j0jyZPU(9agdaSPp9j~btF}*U`UF' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
