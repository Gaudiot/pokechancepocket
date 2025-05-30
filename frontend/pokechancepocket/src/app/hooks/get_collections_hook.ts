import { useState, useEffect } from 'react'
import INetwork from '@/core/network/inetwork'
import AxiosNetwork from '@/core/network/implementations/axios_network'

export type Collection = {
  name: string
  id: string
}

export interface UseGetCollectionsResult {
  collections: Collection[]
  isLoading: boolean
  hasError: boolean
  errorMessage?: string
}

export function useGetCollections(): UseGetCollectionsResult {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  useEffect(() => {
    const network: INetwork = new AxiosNetwork()

    const fetchCollections = async () => {
      setIsLoading(true)
      setHasError(false)
      setErrorMessage(undefined)

      try {
        const response = await network.get<any>({
          url: 'http://localhost:8080/collections/',
        })
        const fetched: Collection[] = Object.keys(response.collections).map((key) => ({
          name: response.collections[key],
          id: key
        }))
        setCollections(fetched)
      } catch (error: any) {
        console.error('Erro ao buscar coleções:', error)
        setHasError(true)
        setErrorMessage(error.message || 'Erro ao buscar coleções.')
        setCollections(Array.from({ length: 20 }, (_, i) => ({ name: `teste${i + 1}`, id: `teste${i + 1}` })))
      } finally {
        setIsLoading(false)
      }
    }

    fetchCollections()
  }, [])

  return { collections, isLoading, hasError, errorMessage }
}
