// where condition query
export type ConditionSelect = string[];
export type Condition = {[key: string]: any};

export type ConditionString = string;

export type ConditionObject = {
  select?: ConditionSelect, where?: Condition, order?: Condition, limit?: Condition,
}

export type ConditionQuery = ConditionObject | ConditionString;

// Cq
export type CqParse = (string: ConditionString, ignore?: string) => ConditionObject;
export type CqString = (object: ConditionObject) => ConditionString;

export type CqOperators = ('=' | '!' | '<' | '>' | '<=' | '>=' | | '-' | '*'| '!*')[];

// deprecated
//type WolL = 'select' | 'where' | 'order' | 'limit';
//type WolS = 's' | 'w' | 'o' | 'l';

//export type CqKey = {[key in WolL | WolS]: string};
//export type CqR = {[key in WolS]: string};

//export type Cq = {
  //operators: CqOperators, key: CqKey, r: CqR, parse: CqParse, string: CqString, 
//};

export type Cq = {
  operators: CqOperators, key: CqKey, r: CqR, parse: CqParse, string: CqString, 
};

// const
export declare const cq: Cq;

// shortcut

//export type CO = ConditionObject;
//export type CS = ConditionString;

