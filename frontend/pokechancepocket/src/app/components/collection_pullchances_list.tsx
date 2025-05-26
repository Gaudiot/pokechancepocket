interface CollectionPullchancesListProps {
  pullChance: {
    packName: string,
    pullChance: number
  }[]
  isLoading: boolean
  hasError: boolean
  errorMessage?: string
  hasCollectionSelected: boolean
}

function CollectionPullchancesListSkeleton() {
  return <div className="shimmer flex-1 bg-gray-200 p-5 h-[500px] relative rounded-md" />
}

function NoCollectionSelected() {
  return <div>Select a collection to see pull chances!</div>
}

export default function CollectionPullchancesList({
  pullChance,
  isLoading,
  hasError,
  errorMessage,
  hasCollectionSelected
}: CollectionPullchancesListProps) {
  if (isLoading) {
    return CollectionPullchancesListSkeleton()
  }

  if (hasError) {
    return (
      <div className="flex-1 bg-gray-200 p-5 h-[500px] relative rounded-md">
        Error: {errorMessage}
      </div>
    )
  }

  if (!hasCollectionSelected) {
    return (
      <div className="flex-1 bg-gray-200 p-5 h-[500px] relative rounded-md">
        {NoCollectionSelected()}
      </div>
    )
  }

  return (
    <div className="flex-1 bg-gray-200 p-5 h-[500px] overflow-y-auto rounded-md">
      <ul className="space-y-2">
        {pullChance.map((pack) => (
          <li key={pack.packName}>{`${pack.packName} - ${pack.pullChance.toFixed(5)}%`}</li>
        ))}
      </ul>
    </div>
  )
}
