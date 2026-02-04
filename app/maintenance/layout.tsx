export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Site Under Maintenance</title>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { overflow: hidden; }
        `}</style>
      </head>
      <body style={{margin: 0, padding: 0, height: '100vh', overflow: 'hidden'}}>
        {children}
      </body>
    </html>
  )
}

