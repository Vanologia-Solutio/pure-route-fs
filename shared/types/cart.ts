export interface Cart {
  id: string
  products: {
    id: string
    name: string
    quantity: number
    price: number
  }[]
}
