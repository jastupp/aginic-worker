const { pool } = require('./mysql/MySQLConnect');
const State = require('./mysql/State');
const { pendingTo, waitingToPending, minWaiting } = require('./mysql/Queries');
const axios = require('axios');

/**
 * Application constants
 */
const WAIT = 30 * 1000;
const TRIES = 3;

/**
 * Check the give URL
 *
 * @param url
 * @returns {Promise<boolean>}
 */
const checkURL = async (url) => {
    let tries = TRIES;
    let success = false;
    while (tries-- > 0 && !success) {
        try {
            const resp = await axios.get(`http://${url}`);
            success = success || resp.status === 200;
        } catch { /** Nothing needed here **/}
    }
    return success;
}

/**
 * Utility to rollback and resolve..
 *
 * @param connection
 * @param resolve
 * @returns {*}
 */
const rollback = (connection, resolve) =>
    connection.rollback(error => resolve())

/**
 * Utility to commit and resolve
 *
 * @param connection
 * @param resolve
 */
const commit = (connection, resolve) =>
    connection.commit(error => {
        error && rollback(commit, resolve);
        resolve();
    });

/**
 * Test the waiting URL using a transaction
 * in case of applicationm crash.
 *
 * @param row
 * @returns {Promise<void>}
 */
const runJob = async (row) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (error, connection) => {
            connection.beginTransaction(async (error) => {
                if (!error) {
                    try {
                        if (await waitingToPending(connection, [row.id])) {
                            const state = await checkURL(row.URL) ? State.SUCCESS : State.FAILURE;
                            result = await pendingTo(connection, [row.id, state]);
                            result ? commit(connection, resolve) : rollback(connection, resolve)
                        } else { rollback(connection, resolve); }
                    } catch (error) {
                        rollback(connection, resolve);
                    }
                }
            });
            connection.release();
        });
    });
};


/**
 * Main method of the application
 *
 * @returns {Promise<void>}
 */
const main = async () => {
    let row = await minWaiting();
    while (row) {
        await runJob(row);
        row = await minWaiting();
    }
    setTimeout(main, WAIT);
}

main();
