import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'

export const runtime = 'edge'

export async function POST(req: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore
  })
  const json = await req.json()
  const { messages } = json
  const userId = (await auth({ cookieStore }))?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  const apiRequestBody = {
    query: messages[0]?.content,
    artist_name: "John Doe",
    your_name: "Lucas Mandelbaum"
  }

  const res = await fetch('http://127.0.0.1:5000/generate-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apiRequestBody),
  })

  if (!res.ok) {
    console.error('API request failed:', res.statusText);
    return new Response('API request failed', { status: res.status });
  }

  const responseData = await res.json()

  const title = json.messages[0].content.substring(0, 100)
  const id = json.id ?? nanoid()
  const createdAt = Date.now()
  const path = `/chat/${id}`
  const payload = {
    id,
    title,
    userId,
    createdAt,
    path,
    messages: [
      ...messages,
      {
        content: responseData.email,
        role: 'assistant'
      }
    ]
  }


  return new Response(payload.messages[1].content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })

}
