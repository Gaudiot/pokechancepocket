'use client'

import AxiosNetwork from '@/core/network/implementations/axios_network'
import { useEffect, useState } from 'react'

interface Collection {
  cards: string[]
}

export default function Home() {
  const axios = new AxiosNetwork()
  const [collections, setCollections] = useState<string[]>([])

  useEffect(() => {
    const getCollections = async () => {
      
      try {
        const response = await axios.get<any>('http://localhost:8080/collections/')
        const collections = Object.keys(response.collections)
        setCollections(collections)
      } catch (error) {
        console.error('Erro ao buscar coleções:', error)
        setCollections(Array.from({length: 20}, (_, i) => `teste${i+1}`))
      }
    }

    getCollections()
  }, [])

  const onCollectionPress = (collection: string) => {
    console.log('Coleção selecionada:', collection)
  }

  return (
    <div>
      <h1>Poke Chance Pocket</h1>
      <div className="flex justify-between w-full gap-5">
        <div className="flex-1 bg-gray-200 p-5 h-[500px] overflow-y-auto">
          <ul className="space-y-2">
            {collections.map((collection, index) => (
              <li 
                key={index}
                onClick={() => onCollectionPress(collection)}
                className="cursor-pointer hover:bg-gray-300 p-2 rounded"
              >
                {collection}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 bg-gray-200 p-5">
          Componente 2
        </div>
        <div className="flex-1 bg-gray-200 p-5">
          Componente 3
        </div>
      </div>
    </div>
  )
}
