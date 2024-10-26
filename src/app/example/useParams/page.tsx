'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Component() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [urlParam, setUrlParam] = useState('')
    const [searchParam, setSearchParam] = useState('')
    const [searchParamWithBack, setSearchParamWithBack] = useState('')

    useEffect(() => {
        // Initialize states from URL and search params
        const path = window.location.pathname.split('/')
        setUrlParam(path[path.length - 1] || '')
        setSearchParam(searchParams.get('search') || '')
        setSearchParamWithBack(searchParams.get('backSearch') || '')
    }, [searchParams])

    const handleUrlParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setUrlParam(value)
        router.push(`/${value}`)
    }

    const handleSearchParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchParam(value)
        router.push(`?search=${value}`)
    }

    const handleSearchParamWithBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchParamWithBack(value)
        router.push(`?backSearch=${value}`, { scroll: false })
    }

    const handleBack = () => {
        router.back()
    }

    return (
        <div className="space-y-8 p-8">
            <div className="space-y-2">
                <label htmlFor="urlParam">URL Parameter Input</label>
                <Input
                    id="urlParam"
                    value={urlParam}
                    onChange={handleUrlParamChange}
                    placeholder="Enter URL parameter"
                />
                <p className="text-sm text-muted-foreground">Current URL: /{urlParam}</p>
            </div>

            <div className="space-y-2">
                <label htmlFor="searchParam">Search Parameter Input</label>
                <Input
                    id="searchParam"
                    value={searchParam}
                    onChange={handleSearchParamChange}
                    placeholder="Enter search parameter"
                />
                <p className="text-sm text-muted-foreground">Current search param: {searchParam}</p>
            </div>

            <div className="space-y-2">
                <label htmlFor="searchParamWithBack">Search Parameter with Back Button</label>
                <div className="flex space-x-2">
                    <Input
                        id="searchParamWithBack"
                        value={searchParamWithBack}
                        onChange={handleSearchParamWithBackChange}
                        placeholder="Enter search parameter"
                    />
                    <Button onClick={handleBack}>Back</Button>
                </div>
                <p className="text-sm text-muted-foreground">Current search param: {searchParamWithBack}</p>
            </div>
        </div>
    )
}