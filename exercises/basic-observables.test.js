import { from, of } from 'rxjs';

// done
describe('Basic Observables', () => {
  describe(of, () => {
    it('should create an observable from its arguments', () => {
      const result = [];
      const obs = of(1, 2, 3, 4);
      obs.subscribe(value => result.push(value))

      expect(result).toEqual([1, 2, 3, 4]);
    });
  });

  describe(from, () => {
    it('should create an observable', () => {
      const result = [];
      const obs = from([1, 2, 3, 4]);
      obs.subscribe(value => result.push(value));
      expect(result).toEqual([1, 2, 3, 4]);
    });
  });
});
