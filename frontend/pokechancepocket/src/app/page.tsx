'use client'

import IAnalytics from '@/core/analytics/ianalytics'
import FirebaseAnalytics from '@/core/analytics/implementations/firebase_analytics'
import AxiosNetwork from '@/core/network/implementations/axios_network'
import INetwork from '@/core/network/inetwork'
import { useEffect, useState } from 'react'

function onCalculateOddsClick(analytics: IAnalytics) {
  analytics.trackEvent({
    name: 'calculate_odds_click',
    properties: {
      pressed: "true"
    }
  })
}

export default function Home() {
  const axios: INetwork = new AxiosNetwork()
  const analytics: IAnalytics = new FirebaseAnalytics()
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
      <div className="mt-4 text-center">
        <button 
          onClick={() => onCalculateOddsClick(analytics)}
          className="bg-blue-500 hover:bg-blue-700 active:bg-blue-900 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          Calculate Odds
        </button>
      </div>
    </div>
  )
}
