type Country = {
  id: string
  name: string
}

type State = {
  id: string
  name: string
}

export const CHECKOUT_LOV: {
  COUNTRIES: Country[]
  STATES: State[]
} = {
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
