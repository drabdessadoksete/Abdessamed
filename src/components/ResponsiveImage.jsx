export default function ResponsiveImage({
  asset,
  className = '',
  imageClassName = '',
  eager = false,
}) {
  if (!asset) return null

  return (
    <figure className={className}>
      <picture>
        {asset.sources?.avif ? <source type="image/avif" srcSet={asset.sources.avif} sizes={asset.sizes} /> : null}
        {asset.sources?.webp ? <source type="image/webp" srcSet={asset.sources.webp} sizes={asset.sizes} /> : null}
        <img
          src={asset.fallback}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          decoding="async"
          className={imageClassName}
          style={asset.focalPoint ? { objectPosition: asset.focalPoint } : undefined}
        />
      </picture>
    </figure>
  )
}
