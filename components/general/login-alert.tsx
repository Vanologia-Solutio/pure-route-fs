import { Info } from 'lucide-react'
import Link from 'next/link'
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
            <Link href='/login' onClick={() => setLoginOpen(false)}>
              <Button className='bg-green-700 text-white hover:bg-green-800'>
                Go to login
              </Button>
            </Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
