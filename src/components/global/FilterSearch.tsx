import { Search } from 'lucide-react'
import React, { useState } from 'react'

type Props = {
  applyFilter : () => void
  placeholder?: string
}

export default function FilterSearch({
  applyFilter,
  placeholder
}: Props) {

  const [query, setQuery] = useState('')

  return (
    <div className="flex gap-2 w-11/12 lg:w-1/2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder || "Search by tags or users..."}
        className="w-full mx-auto p-2 bg-slate-700 outline-none rounded"
      ></input>
      <button
        onClick={applyFilter}
        className=" mx-auto p-2 bg-blue-600 hover:bg-blue-700 outline-none rounded"
      >
        <Search />
      </button>
    </div>
  )
}