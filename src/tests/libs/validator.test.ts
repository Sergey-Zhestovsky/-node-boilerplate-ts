import Validator from '../../libs/Validator';

interface ITestSchema<T = string> {
  name: T;
}

describe('Validator', () => {
  test('validate trough object', () => {
    const validator = new Validator();
    validator.setSchema((Joi) => ({
      name: Joi.string(),
    }));

    const firstRes = validator.validate<ITestSchema>({
      name: 'test',
    });
    expect(firstRes).not.toBeNull();
    expect(firstRes!.errors).toBeNull();

    const secondRes = validator.validate<ITestSchema>({
      name: 42,
    });
    expect(secondRes).not.toBeNull();
    expect(typeof secondRes!.errorMessage).toBe('string');
  });

  test('validate trough array', () => {
    const validator = new Validator();
    validator.setSchema(['name']);

    const firstRes = validator.validate<ITestSchema<any>>({
      name: 'test',
    });
    expect(firstRes).not.toBeNull();
    expect(firstRes!.errors).toBeNull();

    const secondRes = validator.validate<ITestSchema<any>>({
      age: 42,
    });
    expect(secondRes).not.toBeNull();
    expect(typeof secondRes!.errorMessage).toBe('string');
  });
});
