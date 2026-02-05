import { Card } from '@/components/ui/card'
import { Beaker, Shield, Zap } from 'lucide-react'

const features = [
  {
    icon: Beaker,
    title: 'Advanced Research',
    description:
      'State-of-the-art R&D facilities and cutting-edge technology for drug discovery and development.',
  },
  {
    icon: Shield,
    title: 'Safety & Quality',
    description:
      'Rigorous quality control and safety standards exceeding international pharmaceutical regulations.',
  },
  {
    icon: Zap,
    title: 'Fast Development',
    description:
      'Accelerated development cycles ensuring rapid deployment of breakthrough medications.',
  },
]

export default function Features() {
  return (
    <section id='features' className='py-20 md:py-32 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold text-foreground mb-4'>
            Why Choose{' '}
            <span className='text-green-700'>Pure Route Peptides</span>
          </h2>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            We combine scientific excellence with a commitment to improving
            global health outcomes
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className='p-8 hover:shadow-lg hover:border-primary/50 transition-all border border-border/50 group'
              >
                <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors'>
                  <Icon className='w-6 h-6 text-primary' />
                </div>
                <h3 className='text-xl font-bold text-foreground mb-3'>
                  {feature.title}
                </h3>
                <p className='text-muted-foreground'>{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
