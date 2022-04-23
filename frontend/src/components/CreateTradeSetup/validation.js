import { object, string, number, ref, moreThan, lessThan } from 'yup';

let setupValidations = object({
  pair: string().required("Pair is a required field!"),
  chart: string().required("Chart URL is a required field!"),
  side: string().required("Position Side is a required field!"),
  stopLossPrice:number().min(0).positive().required("Stop Loss Price is a required field!"),
  entryPrice:number().min(0).when("side",{
    is: (value) => value && value === "Long",
    then: number().moreThan(ref('stopLossPrice')).required("Entry Price is a required field!"),
    otherwise: number().lessThan(ref('stopLossPrice')).required("Entry Price is a required field!"),
  }),
  
  takeProfitPrice:number().min(0).required("Take Profit Price is a required field!").when("side",{
    is: (value) => value && value === "Long",
    then: number().moreThan(ref("entryPrice")),
    otherwise:number().lessThan(ref("entryPrice"))
  }),
});

export default setupValidations