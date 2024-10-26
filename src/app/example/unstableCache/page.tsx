"use client"

import { unstable_cache } from 'next/cache'
import { revalidateTag } from 'next/cache'
import { useState } from 'react'
import { Button } from "@/components/ui/button"

// Mock database
let users = ['Alice', 'Bob', 'Charlie']

// Simulated delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock getUsers function
async function getUsers() {
    await delay(2000) // Simulate a 2-second delay
    return users
}

// Cached version of getUsers
const getCachedUsers = unstable_cache(
    async () => {
        return await getUsers()
    },
    ['users'],
    { revalidate: 60, tags: ['users'] }
)

// Server Action to add a user and revalidate
async function addUser(formData: FormData) {
    const newUser = formData.get('newUser') as string
    users.push(newUser)
    revalidateTag('userUpdate')
}

export default function Home() {
    const [uncachedResult, setUncachedResult] = useState<string[]>([])
    const [cachedResult, setCachedResult] = useState<string[]>([])
    const [uncachedTime, setUncachedTime] = useState<number>(0)
    const [cachedTime, setCachedTime] = useState<number>(0)

    const fetchUncached = async () => {
        const start = performance.now()
        const result = await getUsers()
        const end = performance.now()
        setUncachedResult(result)
        setUncachedTime(end - start)
    }

    const fetchCached = async () => {
        const start = performance.now()
        const result = await getCachedUsers()
        const end = performance.now()
        setCachedResult(result)
        setCachedTime(end - start)
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">unstable_cache Example</h1>

            <div className="space-y-4 mb-8">
                <Button onClick={fetchUncached} className="w-full">
                    Fetch Users (Uncached)
                </Button>
                <Button onClick={fetchCached} className="w-full">
                    Fetch Users (Cached)
                </Button>
                <form action={addUser} className="flex gap-2">
                    <input
                        type="text"
                        name="newUser"
                        placeholder="New user name"
                        className="flex-grow px-3 py-2 border rounded"
                    />
                    <Button type="submit">Add User & Revalidate</Button>
                </form>
            </div>

            <div className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold">Uncached Result:</h2>
                    <p>Time: {uncachedTime.toFixed(2)}ms</p>
                    <p>Users: {uncachedResult.join(', ')}</p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold">Cached Result:</h2>
                    <p>Time: {cachedTime.toFixed(2)}ms</p>
                    <p>Users: {cachedResult.join(', ')}</p>
                </div>
            </div>
        </div>
    )
}