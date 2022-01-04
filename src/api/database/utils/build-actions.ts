import { ActionProvider, TActionProviderConstructor } from './ActionProvider';
import { TActionList, TModelList } from '../types';

type TActionConstructorParams<T extends TModelList = TModelList> = Parameters<
  TActionProviderConstructor<T>
>;

type TAction<T extends TModelList = TModelList> = new (
  ...args: TActionConstructorParams<T>
) => ActionProvider<T>;

export const buildActions = <
  T extends TModelList = TModelList,
  R extends TActionList<T> = TActionList<T>
>(
  actionList: Array<TAction<T>>,
  ...args: TActionConstructorParams<T>
): R => {
  const result: TActionList = {};

  actionList.forEach((Action) => {
    const action = new Action(...args);
    result[Action.name] = action;
  });

  return result as R;
};

export const getActionsFactory = <
  T extends TModelList = TModelList,
  R extends TActionList<T> = TActionList<T>
>(
  list: Array<TAction<T>>
) => {
  return (...args: TActionConstructorParams<T>) => buildActions<T, R>(list, ...args);
};
