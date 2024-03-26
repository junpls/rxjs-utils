import {
	BehaviorSubject,
	MonoTypeOperatorFunction,
	NEVER,
	OperatorFunction,
	defer,
	of,
	pipe,
} from "rxjs";
import { pairwise, switchMap, filter, mergeWith, tap } from "rxjs/operators";

/**
 * Emits whenever the source produces a falsy value followed by a truthy value.
 * The result is `[<the falsy value>, <the truthy value>]`.
 */
export function filterRisingEdge<T>(): OperatorFunction<T, [T, T]> {
	return pipe(
		pairwise(),
		switchMap(([a, b]) => (!a && b ? of([a, b] as [T, T]) : NEVER)),
	);
}

/**
 * This operator can be used to mute a stream while the signal is `false`.
 * When applied to a {@link BehaviorSubject}, this can be used to hide
 * intermediate states during a computation.
 * 
 * @param signal A {@link BehaviorSubject} that mutes the stream when it is
 * `false` and opens the stream when it is `true`.
 * @param summarize When set to `true`, the operator will emit the most recent
 * value that was produced while the stream was muted, as soon as it gets
 * resumed.
 */
export function transaction<T>(
	signal: BehaviorSubject<boolean>,
	summarize: boolean = false,
): MonoTypeOperatorFunction<T> {
	return (source) =>
		defer(() => {
			let hasLatest = false;
			let latest: T | undefined;
			return source.pipe(
				tap((v) => {
					hasLatest = true;
					latest = v;
				}),
				filter(() => signal.value),
				mergeWith(
					summarize
						? signal.pipe(
								filterRisingEdge(),
								switchMap(() => (hasLatest ? of(latest!) : NEVER)),
							)
						: NEVER,
				),
                tap(() => (hasLatest = false))
			);
		});
}
