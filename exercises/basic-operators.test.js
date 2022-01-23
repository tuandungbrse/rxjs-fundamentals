import { from, of } from 'rxjs';
import {
  take,
  skip,
  filter,
  map,
  mapTo,
  reduce,
  scan,
  takeWhile,
} from 'rxjs/operators';
import { fibonacci } from '../utilities/fibonacci';

/**
 * Returns all of the values emitted by an observable as an array.
 * I'm tired of typing this out for every test.
 */
const getResult = async (observable) => {
  return new Promise((resolve, reject) => {
    const result = [];
    const subscription = observable.subscribe({
      next: (value) => result.push(value),
      error: reject,
      complete: () => {
        resolve(result);
        subscription.unsubscribe();
      },
    });
  });
};

describe('Basic Operators', () => {
  it('should take the first 5 values and map them to the word "DINOSAUR"', async () => {
    const observable$ = of(1, 2, 3, 4, 5, 6, 7).pipe(
      take(5),
      mapTo('DINOSAUR')
    );

    return expect(await getResult(observable$)).toEqual([
      'DINOSAUR',
      'DINOSAUR',
      'DINOSAUR',
      'DINOSAUR',
      'DINOSAUR',
    ]);
  });

  it('should skip the first 5 values and double last two', async () => {
    const observable$ = of(1, 2, 3, 4, 5, 6, 7).pipe(
      skip(5),
      map(n => n * 2)
    );

    return expect(await getResult(observable$)).toEqual([12, 14]);
  });

  it('should emit the square of every even number in the stream', async () => {
    const observable$ = of(1, 2, 3, 4, 5, 6, 7).pipe(
      filter(n => n % 2 === 0),
      map(n => n * n)
    );

    return expect(await getResult(observable$)).toEqual([4, 16, 36]);
  });

  it('should sum of the total of all of the Fibonacci numbers under 200', async () => {
    const observable$ = from(fibonacci()).pipe(
      takeWhile(n => n < 200),
      reduce((acc, value) => acc + value, 0)
    );

    expect(await getResult(observable$)).toEqual([376]);
  });

  it('should merge each object emited into a single object, emitting each state along the way', async () => {
    const observable$ = of(
      { isRunning: true },
      { currentSpeed: 100 },
      { currentSpeed: 200 },
      { distance: 500 },
    ).pipe(
      scan((acc, value) => ({ ...acc, ...value })),
    );

    expect(await getResult(observable$)).toEqual([
      { isRunning: true },
      { isRunning: true, currentSpeed: 100 },
      { isRunning: true, currentSpeed: 200 },
      { isRunning: true, currentSpeed: 200, distance: 500 },
    ]);
  });
});
