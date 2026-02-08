export default function Footer() {
  return (
    <footer className='bg-white p-4 border-t'>
      <div className='mx-auto text-sm text-center text-muted-foreground space-y-2'>
        <p>
          All products offered by Pure Route are for laboratory and research use
          only. These materials are not intended for human consumption, medical
          use, veterinary use, or any form of therapeutic application.
        </p>
        <p className='text-xs'>
          &copy; {new Date().getFullYear()} Pure Route Peptides. All rights
          reserved.
        </p>
      </div>
    </footer>
  )
}
