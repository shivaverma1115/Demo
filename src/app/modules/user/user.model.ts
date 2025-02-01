import { model, Schema } from "mongoose"
import { IUser } from "./user.interface"

const userScema = new Schema<IUser>({
    name:{
        type:String,
        required:true,
        trim: true,
    },
    email:{
        type:String,
        required:true,
        trim: true,
    },
    password:{
        type:String,
        required:true,
        trim: true,
    },
    role:{
        type:String,
        required:true,
        trim: true,
    },
    date: {
        type:String,
        required:true,
        trim: true,
      },
      phone: {
        type: String,
        required:true,
        trim: true,
      },
      photo: {
        type: String,
        trim: true,
      },
      gender: {
        type: String,
        required:true,
        trim: true,
      },
})


export const User =  model("User", userScema)