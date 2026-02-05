export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className='max-w-6xl mx-auto min-h-[calc(100vh-120px)] px-4 lg:px-0'>
      <div className='py-8'>{children}</div>
    </main>
  )
}
