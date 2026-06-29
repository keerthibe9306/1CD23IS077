# Stage 1

I score each notification with two signals: type weight and recency score. Placement gets 3, Result gets 2, and Event gets 1. On top of that, I add a recency value that drops as the notification gets older, so newer items naturally float up even inside the same type bucket.

After assigning a score to every item, I sort descending and slice the first n records. That keeps the top list predictable and easy to inspect because rank is just position after sorting.

For scaling, there are two practical options. Re-sorting on each fetch is simple and totally fine when payloads are moderate because the implementation stays clean and easy to debug. A heap-based approach is better once streams get larger or updates are frequent, since you can maintain top n incrementally without reordering the whole list every time. The tradeoff is complexity: heaps are faster for continuous updates, but full re-sort is easier to reason about and maintain.
