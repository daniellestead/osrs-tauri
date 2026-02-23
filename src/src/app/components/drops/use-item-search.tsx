import { useState, useRef } from 'react'
import { invoke } from '@tauri-apps/api/core'
import type { Item } from './types'

export function UseItemSearch() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const cache = useRef<Map<string, Item[]>>(new Map())

  const searchItems = async (searchTerm: string) => {
    if (!searchTerm) {
      setError('Please provide a search term')
      return
    }

    const lowerSearch = searchTerm.toLowerCase()

    // Check cache first
    if (cache.current.has(lowerSearch)) {
      setItems(cache.current.get(lowerSearch)!)
      return
    }

    setLoading(true)
    setError('')
    setItems([])

    try {
      const result = await invoke<Item[]>('search_items', {
        letter: lowerSearch,
      })
      cache.current.set(lowerSearch, result)
      setItems(result)
    } catch (err) {
      setError(err as string)
    } finally {
      setLoading(false)
    }
  }

  return { items, loading, error, searchItems }
}
