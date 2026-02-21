import type { ConditionObject, CqOperator } from './cq.js';

// where data array
type Data = string | number | boolean | Date | null | undefined;

export type DataObject<T = Data> = {
  [k: string | number]: T
};

export type DataArrayBase<T> = T[];
export type DataArray<T = DataObject> = DataArrayBase<T>;

// Da
export type DaSplit = (key: string) => [string, string];
export type DaSplitInit = (operator: CqOperator) => DaSplit;

export type DaParse = <T = DataObject>
  (object: any, contentType?: string) => DataArray<T>;

export type DaFilter = <T = DataObject>
  (data: DataArray<T>, condition: ConditionObject) => DataArray<T>;

export type Da = {
  split: DaSplitInit, parse: DaParse, filter: DaFilter,
};

// const
export declare const da: Da;

// shortcut

//export type DA<T = DataObject> = DataArray<T>;
