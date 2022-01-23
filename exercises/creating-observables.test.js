import { from, of } from 'rxjs';

//done
describe('Exercise: Creating Observables', () => {
  describe(of, () => {
    /**
     * Your mission: Create an observable using `of`, subscribe to it, putting
     * the values into the `results` array, and get the expectation below to
     * pass.
     */
    it('should create an observable out of a single value', () => {
      const result = [];
      const obs = of(1);
      obs.subscribe(value => result.push(value));
      expect(result).toEqual([1]);
    });

    it('should take a series of objects as arguments and create an observable', () => {
      const result = [];
      const obs = of(
        { type: 'INCREMENT', payload: 1 },
        { type: 'RESET' },
        { type: 'INCREMENT', payload: 2 },
        { type: 'DECREMENT', payload: 1 },
      );

      obs.subscribe(value => result.push(value));

      expect(result).toEqual([
        { type: 'INCREMENT', payload: 1 },
        { type: 'RESET' },
        { type: 'INCREMENT', payload: 2 },
        { type: 'DECREMENT', payload: 1 },
      ]);
    });
  });

  describe(from, () => {
    it('should take an array of objects as arguments and create an observable', () => {
      const result = [];
      const obs = from([
        { type: 'INCREMENT', payload: 1 },
        { type: 'RESET' },
        { type: 'INCREMENT', payload: 2 },
        { type: 'DECREMENT', payload: 1 },
      ]);
      obs.subscribe(value => result.push(value));
      expect(result).toEqual([
        { type: 'INCREMENT', payload: 1 },
        { type: 'RESET' },
        { type: 'INCREMENT', payload: 2 },
        { type: 'DECREMENT', payload: 1 },
      ]);
    });

    it('should create an observable from a generator', () => {
      function* values() {
        yield 1;
        yield 2;
        yield 3;
        return 4;
      }

      const obs = from(values());
      const result = [];
      obs.subscribe(value => result.push(value));

      expect(result).toEqual([1, 2, 3]);
    });

    /**
     * So far, all of our observables have executed synchronously. We can
     * create observables from promises, but those will obviously be
     * asynchronous in nature. Observables are naturals at this, but Jest
     * (or whatever testing framework you prefer) need a little help.
     *
     * This is a good opportunity for us to learn how to handle the
     * completion of an observable differently than the values that are
     * emitted from it.
     *
     * Your mission: collect the values as their emitted, but then
     * only assert your expecation once the observable has completed.
     */
    it('should create an observable from a promise', (done) => {
      const promise = Promise.resolve(1);
      const result = [];
      const obs = from(promise);

      obs.subscribe({
        next: value => result.push(value), complete: () => {
          expect(result).toEqual([1]);
          done();
        }
      })
    });

    /**
     * We'll get into catching errors in greater detail, but this is a good
     * opportunity to see how to respond to an error—in this case, a rejected
     * promise—in our observables.
     */
    it('should create an observable from a promise that rejects', (done) => {
      const promise = Promise.reject({ error: 'Something terrible happened' });
      const obs = from(promise);
      obs.subscribe({
        next: value => { },
        error: (error) => {
          expect(error).toEqual({ error: 'Something terrible happened' });
          done();
        }
      })
    });
  });
});
