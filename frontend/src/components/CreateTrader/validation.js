import { object, string, number } from 'yup';

let traderValidations = object({

  traderName:string().required("Trader Name is a required field!"),
  traderWinrate:number().min(0).max(100).required("Winrate is a required field!"),
});

export default traderValidations