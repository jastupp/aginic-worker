const { pool } = require('./MySQLConnect');
const State = require('./State');

/**
 * Generic query method
 *
 * @param query - the query string
 * @param connection - the connection
 * @param params - the query parameters
 * @returns {Promise<JSON>}
 */
const query = async (query, connection, params = []) =>
    await new Promise((resolve, reject) => {
        connection.query(query, params, (error, result) => {
            error && reject(error);
            error || resolve(JSON.parse(JSON.stringify(result)));
        });
    });

/**
 * Generic method to update the state of a row
 *
 * @param connection - the connection
 * @param id - the id of the row
 * @param from - the current state
 * @param to - the to be state
 * @returns {Promise<boolean>}
 */
const updateState = async (connection, [id, from, to]) => {
    const update = `update ServerTasks set state = ? 
                        where state = ? and id = ?`;
    const result = await query(update, connection, [to, from, id]);
    return result.affectedRows === 1;
}

/**
 * Update the state fro pending
 *
 * @param connection - the connection
 * @param id - the id
 * @param state - the to be state
 * @returns {Promise<boolean>}
 */
const pendingTo = async (connection, [ id, state ]) =>
    await updateState(connection, [id, State.PENDING, state]);

/**
 * Update from waiting to pending
 *
 * @param connection - the connection
 * @param id - the id
 * @returns {Promise<boolean>}
 */
const waitingToPending = async (connection, [ id ]) =>
    await updateState(connection, [id, State.WAITING, State.PENDING]);

/**
 * Get the record with the minimum id in the waiting state
 *
 * @returns {{} | null}
 */
const minWaiting = async () => {
    const getMin = `select id, URL from ServerTasks
                        where id = ( select min(id) from ServerTasks 
                                        where state = "${State.WAITING}")`;
    const result = await query(getMin, pool);
    return result.length === 1 ? result[0] : null;
}

module.exports = {
    pendingTo,
    waitingToPending,
    minWaiting
}