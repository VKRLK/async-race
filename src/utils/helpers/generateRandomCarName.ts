export function generateRandomCarName(): string {
  const brands = ['Ford', 'Toyota', 'BMW', 'Audi', 'Tesla', 'Honda', 'Mazda', 'Chevy'];
  const models = ['X', 'GT', 'Turbo', 'Classic', 'A', 'RX', 'Eco', 'Pro'];
  return `${brands[Math.floor(Math.random() * brands.length)]} ${models[Math.floor(Math.random() * models.length)]}`;
}
