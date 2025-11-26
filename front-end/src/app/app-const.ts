
//App const prefix
const PREFIX = "valdoz";


export const COMPANY = PREFIX + "company";

//logged in user prefix
export const CURRENT_USER = PREFIX + "currentUser";

export const CURRENT_BUSINESS_DAY = PREFIX + "current_BD";

//token data
const TOKEN_PREFIX = "_token_data.";
export const TOKEN_VALUE = PREFIX + TOKEN_PREFIX + "access_token";
export const TOKEN_EXPIRES_IN = PREFIX + TOKEN_PREFIX + "expires_in";
export const TOKEN_TYPE = PREFIX + TOKEN_PREFIX + "token_type";
export const TOKEN_REFRESH_VALUE = PREFIX + TOKEN_PREFIX + "refresh_token";
export const TOKEN_SCOPE = PREFIX + TOKEN_PREFIX + "scope";


export const CURRENT_URL_SESSION_VARNAME = 'appp-const.SESSION_VARABIABLE.URL_CURRENT_TARGET';



export enum DefaultOperationType {
  StockInitial = "STIN",
  Sale = "SALE",
  Transport = "TRAN",
  Invoice = "FACT",
  Purchase = "PURC",
  PurchaseReturn = "RTSA",
  ProductionOrder = "PORD",
  OrderReception = "RXOR",
  AuthorizeBudgetConsumsion="ABUC",
  ProductGift ="PRGI",
  ProductDamage ="PRDA",
}




export enum ExamenType {
  OPHTALMOLOGIE = "Ophtalmologie",
  LABORATOIRE = "Laboratoire",
  BLOC_OPERATOIRE = "Bloc opératoire"
}

export interface ExamenModel {
  examenID?: number;
  name?: string | null;
  code?: string | null;
  price?: string | null;
  type?: ExamenType | null;
}


export const EXAMENS: ExamenModel[] = [
  // Ophtalmologie
  { examenID: 1, name: "Consultation supplémentaire", type: ExamenType.OPHTALMOLOGIE, code: "CONSOPHTA", price: "12000" },
  { examenID: 2, name: "Réfraction sous cycloplégie", type: ExamenType.OPHTALMOLOGIE, code: "REFRCYCLO", price: "9000" },
  { examenID: 3, name: "Tonométrie", type: ExamenType.OPHTALMOLOGIE, code: "TONO", price: "7500" },
  { examenID: 4, name: "Gonioscopie", type: ExamenType.OPHTALMOLOGIE, code: "GONIO", price: "9500" },
  { examenID: 5, name: "Bilan orthoptique", type: ExamenType.OPHTALMOLOGIE, code: "ORTHOPT", price: "13500" },
  { examenID: 6, name: "Échographie ophtalmique", type: ExamenType.OPHTALMOLOGIE, code: "ECHOOPHTA", price: "22000" },
  { examenID: 7, name: "OCT", type: ExamenType.OPHTALMOLOGIE, code: "OCT", price: "37500" },
  { examenID: 8, name: "Fond d’œil", type: ExamenType.OPHTALMOLOGIE, code: "FONDOEIL", price: "10500" },
  { examenID: 9, name: "Kératométrie", type: ExamenType.OPHTALMOLOGIE, code: "KERATO", price: "7500" },
  { examenID: 10, name: "Pachymétrie", type: ExamenType.OPHTALMOLOGIE, code: "PACHY", price: "7500" },
  { examenID: 11, name: "Champ visuel", type: ExamenType.OPHTALMOLOGIE, code: "CHAMPVIS", price: "15000" },
  { examenID: 12, name: "Vision des couleurs", type: ExamenType.OPHTALMOLOGIE, code: "VISIONCOUL", price: "4500" },
  { examenID: 13, name: "Angiographie", type: ExamenType.OPHTALMOLOGIE, code: "ANGIO", price: "37500" },
  { examenID: 14, name: "Rétinographie", type: ExamenType.OPHTALMOLOGIE, code: "RETINO", price: "30000" },
  { examenID: 15, name: "Topographie corneenne", type: ExamenType.OPHTALMOLOGIE, code: "TOPOCOR", price: "27000" },

  // Laboratoire
  { examenID: 16, name: "NES", type: ExamenType.LABORATOIRE, code: "NESLAB", price: "4500" },
  { examenID: 17, name: "Glycémie à jeun", type: ExamenType.LABORATOIRE, code: "GLYCEJEUN", price: "3000" },
  { examenID: 18, name: "Glycémie glyquée", type: ExamenType.LABORATOIRE, code: "HBA1C", price: "6000" },
  { examenID: 19, name: "Tests de coagulation", type: ExamenType.LABORATOIRE, code: "COAGUL", price: "7500" },
  { examenID: 20, name: "Groupage sanguin", type: ExamenType.LABORATOIRE, code: "GROUPSANG", price: "4500" },
  { examenID: 21, name: "ECBU", type: ExamenType.LABORATOIRE, code: "ECBU", price: "6000" },
  { examenID: 22, name: "ECBU+ATB", type: ExamenType.LABORATOIRE, code: "ECBUATB", price: "7500" },
  { examenID: 23, name: "Cultures + ATB", type: ExamenType.LABORATOIRE, code: "CULTATB", price: "10500" },
  { examenID: 24, name: "TPHA", type: ExamenType.LABORATOIRE, code: "TPHA", price: "4500" },
  { examenID: 25, name: "Urée / Créatinine", type: ExamenType.LABORATOIRE, code: "URECREA", price: "6000" },
  { examenID: 26, name: "GE + TDR", type: ExamenType.LABORATOIRE, code: "GETDR", price: "3750" },
  { examenID: 27, name: "Chlamydia", type: ExamenType.LABORATOIRE, code: "CHLAMY", price: "7500" },
  { examenID: 28, name: "CRP", type: ExamenType.LABORATOIRE, code: "CRP", price: "3750" },

  // Bloc opératoire
  { examenID: 29, name: "Chirurgie cataracte", type: ExamenType.BLOC_OPERATOIRE, code: "CATARACTE", price: "225000" },
  { examenID: 30, name: "Chirurgie filtrante", type: ExamenType.BLOC_OPERATOIRE, code: "FILTRANT", price: "180000" },
  { examenID: 31, name: "Excision ptérygion", type: ExamenType.BLOC_OPERATOIRE, code: "PTERY", price: "75000" },
  { examenID: 32, name: "Cure chalazion", type: ExamenType.BLOC_OPERATOIRE, code: "CHALAZ", price: "60000" },
  { examenID: 33, name: "Chirurgie paupière", type: ExamenType.BLOC_OPERATOIRE, code: "PAUPIERE", price: "120000" },
  { examenID: 34, name: "Sondage lacrymal", type: ExamenType.BLOC_OPERATOIRE, code: "SONDLAC", price: "52500" },
  { examenID: 35, name: "Ablation tumeur conjonctive", type: ExamenType.BLOC_OPERATOIRE, code: "ABLTUM", price: "105000" },
];
