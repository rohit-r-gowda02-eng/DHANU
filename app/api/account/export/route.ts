import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { exportUserDataJSON, exportUserJournalCSV } from '@/lib/export'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const format = searchParams.get('format') || 'json'

  try {
    if (format === 'csv') {
      const csvData = await exportUserJournalCSV(user.id)
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="dhanu-journal-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    }

    const jsonData = await exportUserDataJSON(user.id)
    return new NextResponse(JSON.stringify(jsonData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="dhanu-data-export-${new Date().toISOString().split('T')[0]}.json"`,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

