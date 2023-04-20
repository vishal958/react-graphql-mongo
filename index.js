const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')

const resolvers = require('./graphql/reslovers')
const typeDefs = require('./graphql/typeDefs')

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
})

mongoose.connect(`mongodb+srv://vishalmaurya958:Crash20230401@cluster0.1spzv6v.mongodb.net/classed?retryWrites=true&w=majority`,
    { useNewUrlParser: true }).then(() => {
        console.log('Mongodb connected')
        return server.listen({ port: 5000 })
    }).then(res => {
        console.log(`Server is running on port ${res.url}`)
    })