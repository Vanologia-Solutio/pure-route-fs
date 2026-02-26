import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { PromotionType } from '@/shared/enums/promotion'
import { Promotion } from '@/shared/types/promotion'
import { format } from 'date-fns'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface PromotionCardProps {
  promotion: Promotion
}

function getValueLabel(type: PromotionType, value: number) {
  if (type === PromotionType.DISCOUNT) return `${value || 0}%`
  if (type === PromotionType.FIXED) return `$${value || 0}`
  if (type === PromotionType.FREE_SHIPPING) return 'Free Shipping'
  return '-'
}

function formatDate(value: Date | null) {
  if (!value) return '-'
  return format(value, 'MMM d, yyyy')
}

export default function PromotionCard({ promotion }: PromotionCardProps) {
  const [isCopied, setIsCopied] = useState<boolean>(false)

  const handleCopy = () => {
    setIsCopied(true)
    navigator.clipboard.writeText(promotion.code)
    toast.success('Promo code copied to clipboard')
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return (
    <Card className='gap-1.5 sm:gap-2.5'>
      <CardHeader>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <div className='flex flex-wrap items-center gap-2'>
            <CardTitle className='text-base'>{promotion.code}</CardTitle>
            <span onClick={handleCopy}>
              {isCopied ? (
                <Check className='size-3 text-green-700' />
              ) : (
                <Copy className='size-3' />
              )}
            </span>
          </div>
          <Badge
            className={cn(
              promotion.is_active
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700',
            )}
          >
            {promotion.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-2 text-xs'>
        <div className='grid grid-cols-2 gap-2'>
          <p>
            <span className='text-muted-foreground'>Value:</span>{' '}
            {getValueLabel(promotion.type, promotion.value)}
          </p>
          <p>
            <span className='text-muted-foreground'>Usage limit:</span>{' '}
            {promotion.usage_limit || '-'}
          </p>
        </div>
        <div className='grid grid-cols-2 gap-2'>
          <p>
            <span className='text-muted-foreground'>Starts:</span>{' '}
            {formatDate(promotion.starts_at)}
          </p>
          <p>
            <span className='text-muted-foreground'>Expires:</span>{' '}
            {formatDate(promotion.expires_at)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
