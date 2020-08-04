/**
 * Get the MYSQL_HOST
 *
 * @returns {string}
 */
const MYSQL_HOST = () => env('MYSQL_HOST');

/**
 * Get the MYSQL_USERNAME
 *
 * @returns {string}
 */
const MYSQL_USERNAME = () => env('MYSQL_USERNAME');

/**
 * Get the MYSQL_PASSWORD
 *
 * @returns {string}
 */
const MYSQL_PASSWORD = () => env('MYSQL_PASSWORD');

/**
 * Get the MYSQL_DATABASE
 *
 * @returns {string}
 */
const MYSQL_DATABASE = () => env('MYSQL_DATABASE');

/**
 * Get the listen port
 *
 * @returns {string}
 */
const LISTEN_PORT = () =>  parseInt(env('LISTEN_PORT'));

/**
 * Get the env var from process.env
 * @param str
 * @returns {string}
 */
const env = (str) => process.env[str];


module.exports = {
    MYSQL_HOST,
    MYSQL_USERNAME,
    MYSQL_PASSWORD,
    MYSQL_DATABASE,
    LISTEN_PORT
}