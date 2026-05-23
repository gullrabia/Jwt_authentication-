import mongoos from 'mongoose'


const connectDB = async ()=> {

    mongoos.connection.on('connected', ()=>console.log("Database is Connected.."))
    await mongoos.connect(`${process.env.MONGODB_URI}/auth`)
}


export default connectDB;