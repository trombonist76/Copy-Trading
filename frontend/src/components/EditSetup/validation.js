import { object, string, number,ref } from 'yup';

let setupValidations = object({
  side: string(),
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
  chart: string().required("Chart URL is a required field!"),
});

export default setupValidations

