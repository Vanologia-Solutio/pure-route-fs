export interface Cart {
  id: number
  products: {
    id: number
    name: string
    description: string
    quantity: number
    price: number
    file_path: string
  }[]
}
