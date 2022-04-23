import { useParams } from 'react-router-dom'
import { Formik } from 'formik'
import setupValidations from './validation'
import { Form, Input, Button,Select } from 'antd'
import { useContract } from '../../contexts/contractContext'
import { useEffect, useState } from 'react'

export default function EditSetup() {
  const [editedSetup,setEditedSetup] = useState()
  const [isLoading,setIsLoading] = useState(true)
  const { contract } = useContract()
  const { id } = useParams()

  useEffect(()=>{
    const timeout = setTimeout(() => {
      
      (async()=>{
      const setup = await contract?.getSetupById?.({id:parseInt(id)})
      setEditedSetup(setup)
    })()
    }, 2000);
    
    return () => {
      console.log("timeot çalıştı")
      clearTimeout(timeout)
    }
  })


  const handleSubmit = async (values) => {
    console.log('Trade Güncelleniyor...')
    const rr = values.side === "Long" 
    ? (values.takeProfitPrice - values.entryPrice) / (values.entryPrice - values.stopLossPrice) 
    : (values.entryPrice - values.takeProfitPrice) / (values.stopLossPrice - values.entryPrice)


    const setup = await contract.updateSetup({
      id: parseInt(id),
      updates: {
        chart: values.chart,
        entryPrice: values.entryPrice,
        stopLossPrice: values.stopLossPrice,
        takeProfitPrice: values.takeProfitPrice,
        riskRewardRatio: (parseFloat(rr).toFixed(2)).toString(),
      },
    })
    console.log(setup)
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "100px" }}>
  { editedSetup && <Formik
        initialValues={{}}
        validationSchema={setupValidations}
        onSubmit={(values) => {
          handleSubmit(values)
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form layout="vertical" style={{ width: "40%" }}>
            

            <Form.Item
              label="Position Side"
              name="side"
              help={touched.side && errors.side}
              validateStatus={touched.side && errors.side && 'error'}
              initialValue={values.side}
            >
              {console.log(editedSetup.side)}
              <Select disabled value={editedSetup.side} placeholder="Please select position side">
              </Select>
            </Form.Item>


            <Form.Item
              label="Stop Loss Price"
              help={touched.stopLossPrice && errors.stopLossPrice}
              validateStatus={
                touched.stopLossPrice && errors.stopLossPrice && 'error'
              }
              name="stopLossPrice"
              initialValue={values.stopLossPrice}
            >
              <Input
              
                placeholder={'Please type stop loss price'}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Item>
            <Form.Item
              label="Entry Price"
              help={touched.entryPrice && errors.entryPrice}
              validateStatus={
                touched.entryPrice && errors.entryPrice && 'error'
              }
              name="entryPrice"
              initialValue={values.entryPrice}
            >
              <Input
                disabled= {values.stopLossPrice ? false: true}
                placeholder={'Please type entry price'}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Item>
            <Form.Item
              label="Take Profit"
              help={touched.takeProfitPrice && errors.takeProfitPrice}
              validateStatus={
                touched.takeProfitPrice && errors.takeProfitPrice && 'error'
              }
              name="takeProfitPrice"
              initialValue={values.takeProfitPrice}
            >
              <Input
                disabled= {values.entryPrice ? false: true}
                placeholder={'Please type take profit price'}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Item>

            <Form.Item
              label="Chart URL"
              help={touched.chart && errors.chart}
              validateStatus={touched.chart && errors.chart && 'error'}
              name="chart"
              initialValue={values.chart}
            >
              <Input
                placeholder="Please type chart url"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Item>

            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>}
    </div>
  )
}
