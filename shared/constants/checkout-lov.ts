type ShipmentMethod = {
  id: string
  name: string
  description: string
  price: number
}

type PaymentMethod = {
  id: string
  name: string
}

type Country = {
  id: string
  name: string
}

type State = {
  id: string
  name: string
}

export const CHECKOUT_LOV: {
  SHIPMENT_METHODS: ShipmentMethod[]
  PAYMENT_METHODS: PaymentMethod[]
  COUNTRIES: Country[]
  STATES: State[]
} = {
  SHIPMENT_METHODS: [
    {
      id: 'standard',
      name: 'UPS 2nd Day Air',
      description: '5-7 business days',
      price: 10,
    },
    {
      id: 'express',
      name: 'UPS Express',
      description: '2-3 business days',
      price: 15,
    },
    {
      id: 'overnight',
      name: 'UPS Overnight',
      description: '1-2 business days',
      price: 20,
    },
  ],
  PAYMENT_METHODS: [
    {
      id: 'card',
      name: 'Credit/Debit Card',
    },
    {
      id: 'paypal',
      name: 'PayPal',
    },
  ],
  COUNTRIES: [
    {
      id: 'united-states',
      name: 'United States',
    },
  ],
  STATES: [
    {
      id: 'california',
      name: 'California',
    },
    {
      id: 'new-york',
      name: 'New York',
    },
    {
      id: 'texas',
      name: 'Texas',
    },
    {
      id: 'florida',
      name: 'Florida',
    },
    {
      id: 'illinois',
      name: 'Illinois',
    },
    {
      id: 'michigan',
      name: 'Michigan',
    },
  ],
}
