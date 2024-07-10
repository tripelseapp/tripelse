import { hash } from 'bcrypt';

export default async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // Adjust the number of salt rounds as needed
  return hash(password, saltRounds);
}
