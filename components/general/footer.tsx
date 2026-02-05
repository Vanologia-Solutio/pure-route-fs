import { Separator } from '../ui/separator'

export default function Footer() {
  return (
    <footer className='bg-white py-8 px-4 lg:px-0'>
      <div className='max-w-6xl mx-auto text-sm text-center text-gray-500'>
        <p>
          All products offered by Pure Route are for laboratory and research use
          only. These materials are not intended for human consumption, medical
          use, veterinary use, or any form of therapeutic application. By
          purchasing from Pure Route, you acknowledge that you are a qualified
          researcher and that you understand and agree to abide by all
          applicable laws and regulations regarding the handling of research
          chemicals.
        </p>
        <Separator className='my-4' />
        <p>
          &copy; {new Date().getFullYear()} Pure Route Peptides. All rights
          reserved.
        </p>
      </div>
    </footer>
  )
}
