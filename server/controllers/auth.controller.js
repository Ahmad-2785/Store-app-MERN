import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import md5 from 'md5';
import User from '../models/user.model';
import logger from '../config/winston';

/**
 * Returns jwt token if valid email and password is provided
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function login(req, res) {
    const {email, password} = req.body;
    User.query({
        where: {email: email},
    }).fetch().then(user => {
        if (user) {
            if (md5(password) === user.get('password')) {

                const token = jwt.sign({
                    id: user.get('id'),
                    email: user.get('email')
                }, process.env.TOKEN_SECRET_KEY);

                res.json({
                    success: true,
                    token,
                    email:  user.get('email')
                });
            } else {
                logger.log('error', ' Invalid email or password.');

                res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: ' Invalid email or password.'
                });
            }
        } else {
            logger.log('error', 'Invalid email or password.');

            res.status(HttpStatus.UNAUTHORIZED).json({
                success: false, message: 'Invalid email or password.'
            });
        }
    });
}