// here we setup apollo server for graphql
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";

//db
import  db from "./_db.js"

const resolvers = {
    Query: {
        games() {
            return db.games;
        },
        authors() {
            return db.authors
        },
        reviews(){
            return db.reviews
        },
        review(parent, args, context ) {
            return db.reviews.find((review) => review.id === args.id)
        },
        game(parent, args, context ) {
            return db.games.find((g) => g.id === args.id)
        },
        author(parent, args, context ) {
            return db.authors.find((a) => a.id === args.id)
        }
    },
        Game: {
            reviews(parent){
                //filter other ids
                return db.reviews.filter((r) => r.game_id === parent.id)
            }
        },
        Author: {
            reviews(parent){
                //filter other ids
                return db.reviews.filter((r) => r.author_id === parent.id)
            }
        },
        Review: {
            author(parent){
                return db.authors.find((auth)=> auth.id === parent.author_id)
            },
            game(parent){
                return db.games.find((g)=> g.id === parent.game_id)
            }
        },
        Mutation: {
            deleteGame(parent, args, context){
                db.games = db.games.filter((g) => g.id !== args.id)
                return db.games
            },
            addGame(parent, args, context){
                let game = {
                    ...args.game, id: Math.floor(Math.random() * 1000).toString()
                }
                db.games.push(game)
                return game
            },
            updateGame(parent,args,context){
                db.games = db.games.map((g) => {
                    if(g.id === args.id){
                        return {...g, ...args.edits}
                    }
                    return g    //if game id not found return original game
                })

                //finally return the update game
                return db.games.find((g) => g.id === args.id)
            }
        }
}
// server setup
// ApolloServer takes an object with 2 values typeDefs (schema info ) & resolvers.
// Resolvers are functions or methods that resolves a value for a type or field within schema.
const server = new ApolloServer({
    typeDefs, resolvers

})

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000}
})

console.log(' Server ready at port ', 4000)