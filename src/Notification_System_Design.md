# Stage 1

The way I set up the priority scoring is pretty straightforward but works well in practice. Each notification gets a score based on two things combined together.

First part is the type weight. Placement notifications get a weight of 3 since those are the most urgent for students. Result notifications sit at 2, and Events get 1. This makes sure that even an older Placement notification can outrank a recent Event, which makes sense from a user perspective.

Second part is recency. I take the timestamp and calculate how many seconds ago the notification was created. Then I normalize that with a decay function: `1 / (1 + age_in_seconds / 3600)`. So a notification that just came in gets close to 1.0, while something from a day ago drops much lower. The 3600 divisor means the score halves roughly every hour, giving a nice smooth decay curve.

The final priority score is just weight + recency. So a brand new Placement would score around 3 + 1.0 = 4.0, while a day-old Event might be around 1 + 0.04 = 1.04. The sorting happens on this combined value.

For the top n selection, I just sort the entire array descending by priority score and then slice the first n elements. If two items have the same combined score (rare but possible), the tiebreaker is timestamp — newer wins.

Now about scaling. Right now I re-sort the full array every time we fetch. For our use case this is totally fine — we're dealing with maybe a few hundred notifications at most, and Array.sort is fast enough that you won't notice any lag. The alternative would be maintaining a max-heap, where you insert each notification and the heap automatically keeps the top n accessible in O(1). Insertions would be O(log n) instead of the full O(n log n) sort. In practice though, the heap approach adds complexity that isn't worth it unless you're streaming thousands of notifications in real-time. The re-sort-on-fetch approach keeps the code simple, easy to test, and good enough for this scale.
