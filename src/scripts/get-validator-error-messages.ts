import { Validator } from '@/libs/validator';

interface IMessages {
  [key: string]: {
    source: string;
    rendered: string;
  };
}

const getValidatorErrorMessages = async () => {
  const validator = new Validator();
  const resMessages: Record<string, string> = {};

  // @ts-ignore: extract _types
  // eslint-disable-next-line
  const joiTypes: Set<string> = validator.joi._types;

  joiTypes.forEach((type) => {
    // @ts-ignore: extract each type
    // eslint-disable-next-line
    const messages: IMessages = validator.joi[type]()._definition.messages as IMessages;

    for (const [key, value] of Object.entries(messages)) {
      resMessages[key] = value.source;
    }
  });

  return JSON.stringify(resMessages, null, '  ');
};

export default getValidatorErrorMessages;
