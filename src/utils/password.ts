const passwordRequirements = [
  { regex: /.{8,}/, message: "Debe tener al menos 8 caracteres" },
  { regex: /[A-Z]/, message: "Debe incluir al menos una letra mayúscula" },
  { regex: /[a-z]/, message: "Debe incluir al menos una letra minúscula" },
  { regex: /[0-9]/, message: "Debe incluir al menos un número" },
  {
    regex: /[!@#$%^&*(),.?\":{}|<>_\-]/,
    message: "Debe incluir al menos un carácter especial",
  },
];

export function validatePassword(password: string): void {
  const missingRequirements = passwordRequirements
    .filter(({ regex }) => !regex.test(password))
    .map(({ message }) => message);

  if (missingRequirements.length > 0) {
    throw new Error(`Contraseña inválida: ${missingRequirements.join(", ")}.`);
  }
}

function randomIndex(max: number): number {
  const range = 0x1_0000_0000;
  const limit = Math.floor(range / max) * max;
  const value = new Uint32Array(1);
  do {
    crypto.getRandomValues(value);
  } while (value[0] >= limit);

  return value[0] % max;
}

export function generateTemporaryPassword(): string {
  const characterSets = [
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "abcdefghijklmnopqrstuvwxyz",
    "0123456789",
    "!@#$%^*(),.?_-",
  ];
  const allCharacters = characterSets.join("");
  const password = characterSets.map((characters) => characters[randomIndex(characters.length)]);

  while (password.length < 16) {
    password.push(allCharacters[randomIndex(allCharacters.length)]);
  }

  for (let index = password.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1);
    [password[index], password[swapIndex]] = [password[swapIndex], password[index]];
  }

  return password.join("");
}
