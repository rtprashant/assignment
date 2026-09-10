import Rating from './Rating'

export default function ProductReviews({ reviews = [], rating }) {
  return (
    <section aria-labelledby="reviews-title" className="mt-10 border-t border-slate-200 pt-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 id="reviews-title" className="text-xl font-semibold">
          Customer reviews ({reviews.length})
        </h2>
        <Rating value={rating} />
      </div>
      {reviews.length === 0 ? (
        <p className="text-sm text-slate-500">No reviews yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <article key={index} className="min-w-0 rounded-xl border border-slate-200 bg-white p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{review.reviewerName}</h3>
                <Rating value={review.rating} />
              </div>
              <p className="break-words text-sm leading-6 text-slate-600">{review.comment}</p>
              {review.date && (
                <time dateTime={review.date} className="mt-4 block text-xs text-slate-400">
                  {new Date(review.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
