import {
	MonoTypeOperatorFunction,
	Observable,
	debounce,
	merge,
	timer,
} from "rxjs";
import { bounce } from "./bounce";

/**
 * For a series of events that happen in closer succession that the emissions
 * of `durationSelector`, this operator will emit the first and the last event.
 * 
 * Also, it will emit the pending trailing value if the source completes early.
 * 
 * E.g. `hug(() => timer(3))`:
 * ```text
 * in:  abc-----d-----ef|
 * out: a----c--d-----e-(f|)
 *                  ↑   ↑
 *                  |   |
 *                  └---+- Won't emit the only event in a series (d) twice.
 *                      └- Emits a pending value on source completion
 *                         (like `debounceTime`).
 * ```
 * 
 * @param durationSelector A function that receives a value from the source
 * Observable, for computing the timeout duration for each source value,
 * returned as an Observable.
 */
export function hug<T>(
	durationSelector: (arg: T) => Observable<any>,
): MonoTypeOperatorFunction<T> {
	return (source) =>
		merge(
			source.pipe(bounce(durationSelector)),
			source.pipe(bounce(durationSelector, true), debounce(durationSelector)),
		);
}

/**
 * Shortcut for using {@link hug} with a timer.
 */
export const hugTime = <T>(duration: number) => hug<T>(() => timer(duration));
