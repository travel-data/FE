function IndexMarker({ index }: { index: number }) {
  return (
    <div className="size-7 bg-brand-primary rounded-full flex items-center justify-center text-caption font-bold text-white">
      {index}
    </div>
  )
}

export default IndexMarker
