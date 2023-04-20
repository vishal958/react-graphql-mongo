const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')

const User = require('../../models/Users')
const { validateRegisterInput, validateLoginInput } = require('../../utils/validators')

function generateToken(user) {
    return jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email
    }, 'SECRETKEY', { expiresIn: '1h' })
}

module.exports = {
    Mutation: {
        async login(_, { username, password }) {
            const { errors, valid } = validateLoginInput(username, password);
            if (!valid) {
                throw new UserInputError('Invalid Inputs', { errors })
            }
            const user = await User.findOne({ username })
            if (!user) {
                errors.general = 'User not found'
                throw new UserInputError('User not found', {
                    errors
                })
            }
            const match = await bcryptjs.compare(password, user.password)
            if (!match) {
                errors.general = 'Wrong Credentials'
                throw new UserInputError('Wrong Credentials', {
                    errors
                })
            }
            const token = generateToken(user);
            return {
                ...user._doc,
                id: user._id,
                token,
            }
        },
        async register(_, {
            registerInput: { username, email, password, confirmPassword }
        }, context, info) {
            const { errors, valid } = validateRegisterInput(username, email, password, confirmPassword);
            if (!valid) {
                throw new UserInputError('Validation errror', {
                    errors
                })
            }
            password = await bcryptjs.hash(password, 12)
            const user = await User.findOne({ username })
            if (user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is already taken'
                    }
                })
            }

            const newUser = new User({
                username, password, email, createdAt: new Date().toISOString()
            })
            const response = await newUser.save()
            const token = generateToken(response);

            return {
                ...response._doc,
                id: response._id,
                token,
            }

        }
    }
}