const postResolver = require('./posts')
const usersResolver = require('./users')

module.exports = {
    Query: {
        ...postResolver.Query,
        // ...usersResolver.Query
    },
    Mutation: {
        ...usersResolver.Mutation,
        ...postResolver.Mutation
    }
}