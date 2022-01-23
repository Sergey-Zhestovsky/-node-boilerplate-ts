import nodeEnv from '@/data/env.json';

export type TNodeEnv = keyof typeof nodeEnv;

export type TEnumNodeEnv = { [k in TNodeEnv]: k };

export type TPreValidationHook = () => void;
