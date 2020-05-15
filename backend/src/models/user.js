import mongoose from 'mongoose';
import { SHA256 } from 'crypto-js';
import { hashSync } from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        validate: {
            validator: username => User.doesNotExist({ username }),
            message: "Username already exists"
        }
    },
    email: {
        type: String,
        validate: {
            validator: email => User.doesNotExist({ email }),
            message: "Email already exists"
        }
    },
      salt: {
        type: String,
        required: true,
        validate: {
          validator: salt => User.doesNotExist({ salt }),
          message: "Salt already exists"
        }
      },
    auth: {
        type: String,
        required: true
    }
}, { timestamps: true });

UserSchema.pre('save', function() {
    // if (this.isModified('auth')) {
    //     this.auth = hashSync(this.auth, 10);
    // }
});

UserSchema.statics.doesNotExist = async function (field) {
    return await this.where(field).countDocuments() === 0;
};

UserSchema.methods.comparePasswords = function (passwordHash) {
    var emailHash = this.email;
    var userSalt = this.salt;
    var retrievedAuthHash = this.auth;
    var genAuthHash = hashSync(emailHash + passwordHash, `$2b$10$${SHA256(userSalt + emailHash + passwordHash).toString().slice(-22)}`).slice(-50);
  
    //return compareSync(password, this.password);
    return retrievedAuthHash === genAuthHash;
};

const User = mongoose.model('User', UserSchema);
export default User;