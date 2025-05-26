'use client'

import IAnalytics from '@/core/analytics/ianalytics'
import FirebaseAnalytics from '@/core/analytics/implementations/firebase_analytics'
import AxiosNetwork from '@/core/network/implementations/axios_network'
import INetwork from '@/core/network/inetwork'
import { useEffect, useRef, useState } from 'react'
import CollectionList from './components/collection_list'

import pokechancetitle from '@/assets/pokechance_title.png'
import CardsList from './components/cards_list'
import { useGetCollectionCards } from './hooks/get_collection_cards_hook'
import { useGetCollections } from './hooks/get_collections_hook'
import { useGetCollectionPullChance } from './hooks/get_collection_pullchance_hook'
import CollectionPullchancesList from './components/collection_pullchances_list'

export default function Home() {
  const analyticsRef = useRef<IAnalytics | null>(null)
  const [selectedCollection, setSelectedCollection] = useState<string>()
  const {collections, isLoading: isCollectionsLoading, hasError: hasCollectionsError, errorMessage: collectionsErrorMessage} = useGetCollections()
  const {cards, isLoading: isCardsLoading, hasError: hasCardsError, errorMessage: cardsErrorMessage} = useGetCollectionCards(selectedCollection)
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([])
  const {pullChance, isLoading: isPullChanceLoading, hasError: hasPullChanceError, errorMessage: pullChanceErrorMessage, fetchPullChance} = useGetCollectionPullChance(selectedCollection, selectedCardIds)

  // Resetar lista de cartas selecionadas ao trocar de coleção
  useEffect(() => {
    setSelectedCardIds([])
  }, [selectedCollection])

  useEffect(() => {
    analyticsRef.current = new FirebaseAnalytics()
  }, [])

  return (
    <div style={{
      backgroundImage: `url(https://i.imgur.com/eVcYPSa.png)`,
      minHeight: '100vh'
    }}>
      <img src={pokechancetitle.src} alt="PokeChance Pocket" className="w-auto h-auto" style={{width: '500px'}}/>
      <CollectionList isLoading={isCollectionsLoading} hasError={hasCollectionsError} errorMessage={collectionsErrorMessage} selectedCollectionId={selectedCollection} onCollectionPress={setSelectedCollection} collections={collections} />
      <div className="flex justify-between w-full gap-5">
        <CardsList isLoading={isCollectionsLoading || isCardsLoading} hasError={false} hasCollectionSelected={selectedCollection !== undefined} errorMessage={undefined} cards={cards} selectedCardIds={selectedCardIds} onSelectionChange={setSelectedCardIds} />
        <CollectionPullchancesList pullChance={pullChance} isLoading={isCollectionsLoading || isPullChanceLoading} hasError={hasCollectionsError || hasCardsError || hasPullChanceError} errorMessage={collectionsErrorMessage || cardsErrorMessage || pullChanceErrorMessage} hasCollectionSelected={selectedCollection !== undefined} />
      </div>
      <div className="mt-4 text-center">
        <button 
          onClick={fetchPullChance}
          className="bg-red-600 hover:bg-red-500 border-3 border-black active:bg-red-800 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          Calculate Odds
        </button>
      </div>
    </div>
  )
}
