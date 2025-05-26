import { useRef } from "react"

import { useEffect } from "react"

interface CardsListProps {
  isLoading: boolean
  hasError: boolean
  errorMessage?: string
  cards: {
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

export default function CollectionCardsList({isLoading, hasError, hasCollectionSelected, errorMessage, cards, selectedCardIds, onSelectionChange}: CardsListProps) {
    if (isLoading) {
      return CardsListSkeleton()
    }

    if (hasError) {
        return <div>Error: {errorMessage}</div>
    }

    if (!hasCollectionSelected) {
      return <div className="flex-1 bg-gray-200 p-5 h-[500px] relative">{NoCollectionSelected()}</div>
    }
    
    const listRef = useRef<HTMLTableSectionElement>(null)

    useEffect(() => {
      if (listRef.current) {
        listRef.current.scrollTop = 0
      }
    }, [cards])
  
    return (
      <div className="flex-1 bg-gray-200 h-[500px] relative rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-300 sticky top-0 z-10">
            <tr className="font-bold">
              <th className="w-20 text-left">Possui</th>
              <th className="w-32 text-left">ID</th>
              <th className="text-left">Nome da Carta</th>
            </tr>
          </thead>
        </table>
        <div className="overflow-y-auto h-[calc(100%-48px)]">
          <table className="w-full">
            <tbody ref={listRef}>
              {cards.map((card, index) => {
                const isSelected = selectedCardIds.includes(card.id);
                return (
                  <tr 
                    key={card.id} 
                    className={`hover:bg-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} cursor-pointer`}
                    onClick={() => {
                      if (isSelected) {
                        onSelectionChange(selectedCardIds.filter(id => id !== card.id));
                      } else {
                        onSelectionChange([...selectedCardIds, card.id]);
                      }
                    }}
                  >
                    <td className="w-20 py-2">
                      <input
                        type="checkbox"
                        className="w-12"
                        checked={isSelected}
                        onChange={() => {}} // Controlled by parent tr onClick
                      />
                    </td>
                    <td className="w-32 py-2">{card.id}</td>
                    <td className="py-2">{card.name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
}