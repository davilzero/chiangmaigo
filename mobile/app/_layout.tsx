import { Stack } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'หน้าแรก' }} />
        <Stack.Screen name="services/index" options={{ title: 'บริการ' }} />
        <Stack.Screen name="services/[id]" options={{ title: 'รายละเอียดบริการ' }} />
        <Stack.Screen name="(auth)/login" options={{ title: 'เข้าสู่ระบบ' }} />
        <Stack.Screen name="user/dashboard" options={{ title: 'แดชบอร์ด' }} />
      </Stack>
    </QueryClientProvider>
  )
}


