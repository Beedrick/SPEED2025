interface IUser extends Document {
  role: 'user' | 'moderator' | 'admin';
}
