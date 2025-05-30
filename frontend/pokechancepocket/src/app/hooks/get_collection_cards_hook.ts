import { useState, useEffect } from 'react'
import INetwork from '@/core/network/inetwork'
import AxiosNetwork from '@/core/network/implementations/axios_network'

export type Card = {
  name: string
  id: string
}

interface UseGetCollectionCardsResult {
  cards: Card[]
  ownedCardsIds: number[]
  isLoading: boolean
  hasError: boolean
  errorMessage?: string
}

export function useGetCollectionCards(collectionId?: string): UseGetCollectionCardsResult {
  const [cards, setCards] = useState<Card[]>([])
  const [ownedCardsIds, setOwnedCardsIds] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!collectionId) {
      setCards([])
      setIsLoading(false)
      setHasError(false)
      setErrorMessage(undefined)
      return
    }

    const network: INetwork = new AxiosNetwork()

    const fetchCards = async () => {
      setIsLoading(true)
      setHasError(false)
      setErrorMessage(undefined)

      try {
        const response = await network.get<any>({
          url: `http://localhost:8080/collection/${collectionId}`,
          header: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        const fetchedCards: Card[] = response.cards.map((card: any) => ({
          name: card.CardName,
          id: card.CardId,
        }))
        setOwnedCardsIds(response.owned)
        setCards(fetchedCards)
      } catch (error: any) {
        setHasError(true)
        setErrorMessage(error.message || 'Erro ao buscar cartas.')
        setCards([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCards()
  }, [collectionId])

  return { cards, ownedCardsIds, isLoading, hasError, errorMessage }
}
