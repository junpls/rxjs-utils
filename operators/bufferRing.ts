import { OperatorFunction } from "rxjs";
import { scan } from "rxjs/operators";

/**
 * A ring buffer. Newest element first. Will have a length shorter than `size`
 * until `size` is reached.
 *
 * Example:
 * ```ts
 * of(1, 2, 3)
 * 	.pipe(bufferRing(2))
 * 	.subscribe(console.log)
 * ```
 * will print
 * ```ts
 * [1]
 * [2, 1]
 * [3, 2]
 * ```
 *
 * @param size How many elements to buffer at most.
 */
export function bufferRing<T>(size: number): OperatorFunction<T, T[]> {
	return scan((acc, curr) => [curr, ...acc].slice(0, size), [] as T[]);
}
