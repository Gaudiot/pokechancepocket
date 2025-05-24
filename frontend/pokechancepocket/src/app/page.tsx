'use client'

import IAnalytics from '@/core/analytics/ianalytics'
import FirebaseAnalytics from '@/core/analytics/implementations/firebase_analytics'
import AxiosNetwork from '@/core/network/implementations/axios_network'
import INetwork from '@/core/network/inetwork'
import { useEffect, useRef, useState } from 'react'

function onCalculateOddsClick(analytics: IAnalytics) {
  analytics.trackEvent({
    name: 'calculate_odds_click',
    properties: {
      pressed: "true"
    }
  })
}

interface CollectionListProps {
  collections: {
    name: string
    id: string
  }[]
  onCollectionPress: (collection: string) => void
  selectedCollectionId?: string
}

type Card = {
  name: string
  id: string
}

function CollectionList({collections, onCollectionPress, selectedCollectionId}: CollectionListProps) {
  return(
    <div className="flex-1 bg-gray-200 p-5 h-[500px] overflow-y-auto">
      <ul className="space-y-2">
        {collections.map((collection) => (
          <li 
            key={collection.id}
            onClick={() => onCollectionPress(collection.id)}
            className={`cursor-pointer hover:bg-gray-300 p-2 rounded ${
              selectedCollectionId === collection.id ? 'border-2 border-blue-500 font-bold' : ''
            }`}
          >
            {`[${collection.id}] - ${collection.name}`}
          </li>
        ))}
      </ul>
    </div>
  )
}

function CardList({cards}: {cards: Card[]}) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0
    }
  }, [cards])

  return (
    <div ref={listRef} className="flex-1 bg-gray-200 p-5 h-[500px] overflow-y-auto">
      <ul className="space-y-2">
        {cards.map((card) => (
          <li key={card.id}>
            {`[${card.id}] - ${card.name}`}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Home() {
  const axios: INetwork = new AxiosNetwork()
  let analytics: IAnalytics
  const [collections, setCollections] = useState<{name: string, id: string}[]>([])
  const [selectedCollection, setSelectedCollection] = useState<string>()
  const [cards, setCards] = useState<Card[]>([])

  useEffect(() => {
    analytics = new FirebaseAnalytics()
    const getCollections = async () => {
      try {
        const response = await axios.get<any>('http://localhost:8080/collections/')
        const collections = Object.keys(response.collections).map((key) => ({name: response.collections[key], id: key}))
        setCollections(collections)
      } catch (error) {
        console.error('Erro ao buscar coleções:', error)
        setCollections(Array.from({length: 20}, (_, i) => ({name: `teste${i+1}`, id: `teste${i+1}`})))
      }
    }

    getCollections()
  }, [])

  useEffect(() => {
    const getCollectionCards = async () => {
      try {
        const response = await axios.get<any>(`http://localhost:8080/collection/${selectedCollection}`)
        const cards: Card[] = response.cards.map((card: any) => ({
          name: card.CardName,
          id: card.CardId
        }))
        setCards(cards)
      } catch (error) {
        console.error('Erro ao buscar cartas:', error)
        setCards([])
      }
    }

    if (selectedCollection) {
      getCollectionCards()
    }
  }, [selectedCollection])

  const onCollectionPress = (collectionId: string) => {
    setSelectedCollection(collectionId)
  }

  return (
    <div>
      <h1>Poke Chance Pocket</h1>
      <div className="flex justify-between w-full gap-5">
        <CollectionList collections={collections} onCollectionPress={onCollectionPress} selectedCollectionId={selectedCollection} />
        <CardList cards={cards}/>
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
