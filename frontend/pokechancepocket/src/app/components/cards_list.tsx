import { useRef } from "react"

import { useEffect } from "react"

interface CardsListProps {
  isLoading: boolean
  hasError: boolean
  errorMessage?: string
  cards?: {
    id: string
    name: string
  }[]
  hasCollectionSelected: boolean
  selectedCardIds: string[]
  onSelectionChange: (selectedCardIds: string[]) => void
}

function NoCollectionSelected() {
    return <div>Select a collection to see the cards!</div>
}

function CardsListSkeleton() {
  return (
    <div className="shimmer flex-1 bg-gray-200 p-5 h-[500px] relative rounded-md"/>
  )
}

export default function CardsList({isLoading, hasError, hasCollectionSelected, errorMessage, cards, selectedCardIds, onSelectionChange}: CardsListProps) {
    if (isLoading) {
      return CardsListSkeleton()
    }

    if (hasError) {
        return <div>Error: {errorMessage}</div>
    }

    if (!hasCollectionSelected) {
      return <div className="flex-1 bg-gray-200 p-5 h-[500px] relative">{NoCollectionSelected()}</div>
    }
    
    const listRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (listRef.current) {
        listRef.current.scrollTop = 0
      }
    }, [cards])
  
    return (
      <div className="flex-1 bg-gray-200 p-5 h-[500px] relative rounded-md">
        <div className="mb-4 font-bold flex bg-gray-300 sticky top-0 z-10 pb-2">
          <div className="w-20">Possui</div>
          <div>{"[ID] - Nome da Carta"}</div>
        </div>
        <div ref={listRef} className="overflow-y-auto h-[calc(100%-2rem)]">
          <ul className="space-y-2">
            {cards!.map((card) => (
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