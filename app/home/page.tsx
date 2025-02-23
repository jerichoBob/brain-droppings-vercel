export default function HomePage() {
  return (
    <div className="flex-1 p-8">
      <h1 className="text-2xl font-bold mb-6">Welcome</h1>
      <div className="max-w-2xl">
        <p className="text-muted-foreground mb-4">
          Welcome to your personal knowledge base. Use the navigation sidebar to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Create and manage notes</li>
          <li>Organize notes into notebooks</li>
          <li>Import content from external sources</li>
        </ul>
      </div>
    </div>
  )
}
