import { Schema, model, Document } from 'mongoose';

interface Users extends Document {
    name: String,
    email: String,
    userName: String,
    password: String
}

const userSchema = new Schema<Users>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
}, {
    collection: 'Users'
});

const UsersModel = model<Users>('Users', userSchema);

export { UsersModel };