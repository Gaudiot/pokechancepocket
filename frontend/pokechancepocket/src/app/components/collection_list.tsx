interface CollectionListProps {
  isLoading: boolean
  hasError: boolean
  errorMessage?: string
  selectedCollectionId?: string
  onCollectionPress: (collectionId: string) => void
  collections: {
    id: string
    name: string
  }[]
}

function CollectionListSkeletonItem() {
    return(
        <li className="shimmer h-10 w-32 rounded-md flex-shrink-0 bg-gray-200"/>
    )
}

function CollectionListItem({id, name, isSelected, onCollectionPress}: {id: string, name: string, isSelected: boolean, onCollectionPress: (collectionId: string) => void}) {
    return (
        <li 
        key={id}
        onClick={() => onCollectionPress(id)}
        className={`cursor-pointer px-2 py-2 rounded whitespace-nowrap ${
          isSelected ? 'bg-yellow-400 border border-black' : 'bg-white hover:bg-gray-300'
        }`}
      >
        {`[${id}] ${name}`}
      </li>
    )
}

export default function CollectionList({isLoading, hasError, errorMessage, selectedCollectionId, onCollectionPress, collections}: CollectionListProps) {
    if (isLoading) {
        return(
            <div className="flex-1 p-4 overflow-x-auto">
              <ul className="flex space-x-4">
                {[...Array(5)].map((_, index) => (
                    <CollectionListSkeletonItem key={index}/>
                ))}
              </ul>
            </div>
        )
    }

    if (hasError) {
        return <div>Error: {errorMessage}</div>;
    }

    return(
        <div className="flex-1 p-4 overflow-x-auto">
          <ul className="flex space-x-4">   
            {collections.map((collection) => (
              <CollectionListItem
                key={collection.id}
                id={collection.id}
                name={collection.name}
                isSelected={selectedCollectionId === collection.id}
                onCollectionPress={onCollectionPress}
              />
            ))}
          </ul>
        </div>
    )
}