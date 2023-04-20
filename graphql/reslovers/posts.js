const { AuthenticationError } = require('apollo-server');
const Post = require('../../models/Post')

const checkAuth = require('../../utils/checkAuth')

module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find()
                return posts;
            } catch (error) {
                throw new Error(error)
            }

        },
        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId)
                if (post) {
                    return post
                } else {
                    throw new Error('Post not Found')
                }
            } catch (error) {
                throw new Error(error)
            }
        }
    },
    Mutation: {
        async createPost(_, { body }, context) {
            const user = checkAuth(context)
            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })
            const post = await newPost.save()
            return post
        },
        async deletePost(_, { postId }, context) {
            const user = checkAuth(context)
            try {
                const post = await Post.findById(postId)
                if (post.username === user.username) {
                    await post.delete()
                    return 'Post delete Successfully'
                } else {
                    throw new AuthenticationError('Action not allowed')
                }
            } catch (error) {
                throw new Error(error)
            }
        },
        async createComment(_,{postId, body},context){
            
        }
    }
}