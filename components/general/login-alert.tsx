import { Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '../ui/alert-dialog'
import { Button } from '../ui/button'

interface LoginAlertProps {
  loginOpen: boolean
  setLoginOpen: Dispatch<SetStateAction<boolean>>
}

export default function LoginAlert({
  loginOpen,
  setLoginOpen,
}: LoginAlertProps) {
  const router = useRouter()

  const handleGoToLogin = () => {
    setLoginOpen(false)
    router.push('/login')
  }

  return (
    <AlertDialog open={loginOpen} onOpenChange={setLoginOpen}>
      <AlertDialogContent size='sm'>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Info />
          </AlertDialogMedia>
          <AlertDialogTitle>Login required</AlertDialogTitle>
          <AlertDialogDescription>
            You need to be logged in to add items to your cart.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Stay here</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className='bg-green-700 text-white hover:bg-green-800'
              onClick={handleGoToLogin}
            >
              Go to login
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
