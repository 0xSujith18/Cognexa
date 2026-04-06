import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 80,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
}, { timestamps: true })

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare password helper
userSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password)
}

export default mongoose.model('User', userSchema)
