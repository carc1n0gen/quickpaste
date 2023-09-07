const alphabet = process.env.ID_ALPHABET || 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890_-';

// pick <length> number of random characters from the alphabet
export function makeId(length=7) {
  const alphabetLength = alphabet.length;
  let id = '';
  for (let i = 0; i < length; i += 1) {
    id += alphabet[Math.floor(Math.random() * alphabetLength)];
  }
  return id;
}
