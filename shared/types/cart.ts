export interface Cart {
  id: string
  products: {
    id: string
    name: string
    description: string
    quantity: number
    price: number
    file_path: string
  }[]
}
