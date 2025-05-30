import { useState, useCallback } from 'react'
import INetwork from '@/core/network/inetwork'
import AxiosNetwork from '@/core/network/implementations/axios_network'

export type PullChance = {
  packName: string
  pullChance: number
}

export interface UseGetCollectionPullChanceResult {
  pullChance: PullChance[]
  isLoading: boolean
  hasError: boolean
  errorMessage?: string
  fetchPullChance: () => Promise<void>
}

export function useGetCollectionPullChance(
  collectionId?: string,
  ownedCardIds: string[] = []
): UseGetCollectionPullChanceResult {
  const [pullChance, setPullChance] = useState<PullChance[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  const fetchPullChance = useCallback(async () => {
    if (!collectionId) {
      setPullChance([])
      return
    }

    const network: INetwork = new AxiosNetwork()
    setIsLoading(true)
    setHasError(false)
    setErrorMessage(undefined)

    try {
      const response = await network.get<any>({
        url: `http://localhost:8080/collection/pullchance/${collectionId}?owned=${ownedCardIds.join(',')}`,
        header: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      const data: PullChance[] = Object.entries(response.pullchances).map(
        ([packName, pullChanceValue]) => ({
          packName,
          pullChance: pullChanceValue as number
        })
      )
      setPullChance(data)
    } catch (error: any) {
      console.error('Erro ao calcular odds:', error)
      setHasError(true)
      setErrorMessage(error.message || 'Erro ao calcular odds.')
      setPullChance([])
    } finally {
      setIsLoading(false)
    }
  }, [collectionId, ownedCardIds])

  return { pullChance, isLoading, hasError, errorMessage, fetchPullChance }
}
