'use client'

import IAnalytics from '@/core/analytics/ianalytics'
import FirebaseAnalytics from '@/core/analytics/implementations/firebase_analytics'
import AxiosNetwork from '@/core/network/implementations/axios_network'
import INetwork from '@/core/network/inetwork'
import { useEffect, useRef, useState } from 'react'

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

interface CardListProps {
  cards: Card[];
  selectedCardIds: string[];
  onSelectionChange: (selectedCardIds: string[]) => void;
}

function CardList({cards, selectedCardIds, onSelectionChange}: CardListProps) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0
    }
  }, [cards])

  return (
    <div className="flex-1 bg-gray-200 p-5 h-[500px] relative">
      <div className="mb-4 font-bold flex bg-gray-300 sticky top-0 z-10 pb-2">
        <div className="w-20">Possui</div>
        <div>{"[ID] - Nome da Carta"}</div>
      </div>
      <div ref={listRef} className="overflow-y-auto h-[calc(100%-2rem)]">
        <ul className="space-y-2">
          {cards.map((card) => (
            <li key={card.id} className="flex items-center">
              <input
                type="checkbox"
                className="mr-4 w-12"
                checked={selectedCardIds.includes(card.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onSelectionChange([...selectedCardIds, card.id]);
                  } else {
                    onSelectionChange(selectedCardIds.filter(id => id !== card.id));
                  }
                }}
              />
              <span>{`[${card.id}] - ${card.name}`}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function PullChanceList({pullChance}: {pullChance: PullChance[]}) {
  return (
    <div className="flex-1 bg-gray-200 p-5 h-[500px] overflow-y-auto">
      <ul className="space-y-2">
        {pullChance.map((pack) => (
          <li key={pack.packName}>{`${pack.packName} - ${pack.pullChance.toFixed(5)}%`}</li>
        ))}
      </ul>
    </div>
  )
}

type PullChance = {
  packName: string,
  pullChance: number
}

export default function Home() {
  const axios: INetwork = new AxiosNetwork()
  const analyticsRef = useRef<IAnalytics | null>(null)
  const [collections, setCollections] = useState<{name: string, id: string}[]>([])
  const [selectedCollection, setSelectedCollection] = useState<string>()
  const [cards, setCards] = useState<Card[]>([])
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([])
  const [pullChance, setPullChance] = useState<PullChance[]>([])

  useEffect(() => {
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
    setSelectedCardIds([])
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

  useEffect(() => {
    analyticsRef.current = new FirebaseAnalytics()
  }, [])

  const onCollectionPress = (collectionId: string) => {
    setSelectedCollection(collectionId)
  }

  async function onCalculateOddsClick() {
    try {
      analyticsRef.current?.trackEvent({
        name: 'calculate_odds_click',
        properties: {
          pressed: "true"
        }
      })
    } catch (error) {
      console.error('Erro ao trackEvent:', error)
    }

    try {
      const response = await axios.get<any>(`http://localhost:8080/collection/pullchance/${selectedCollection}?owned=${selectedCardIds.join(',')}`)

      const pullChance: PullChance[] = Object.entries(response.pullchances).map(([packName, pullChanceValue]) => ({
        packName: packName,
        pullChance: pullChanceValue
      } as PullChance))

      setPullChance(pullChance)
    } catch (error) {
      console.error('Erro ao calcular odds:', error)
    }
  }

  return (
    <div style={{
      backgroundImage: `url(https://i.imgur.com/eVcYPSa.png)`,
      minHeight: '100vh'
    }}>
      <h1>Poke Chance Pocket</h1>
      <div className="flex justify-between w-full gap-5">
        <CollectionList collections={collections} onCollectionPress={onCollectionPress} selectedCollectionId={selectedCollection} />
        <CardList
          cards={cards}
          selectedCardIds={selectedCardIds}
          onSelectionChange={setSelectedCardIds}
        />
        <PullChanceList pullChance={pullChance} />
      </div>
      <div className="mt-4 text-center">
        <button 
          onClick={() => onCalculateOddsClick()}
          className="bg-blue-500 hover:bg-blue-700 active:bg-blue-900 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          Calculate Odds
        </button>
      </div>
    </div>
  )
}
