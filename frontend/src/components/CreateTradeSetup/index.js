import { Formik } from 'formik'
import setupValidations from './validation'
import { Form, Input, Button, Select } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useContract } from '../../contexts/contractContext'

const CreateTradeSetup = () => {
  const navigate = useNavigate()
  const { contract, currentUser } = useContract()
  const handleSubmit = async (values) => {
    const rr = values.side === "Long" 
    ? (values.takeProfitPrice - values.entryPrice) / (values.entryPrice - values.stopLossPrice) 
    : (values.entryPrice - values.takeProfitPrice) / (values.stopLossPrice - values.entryPrice)

    await contract.createSetup({
      traderAccId: currentUser.accountId,
      pair: values.pair,
      chart: values.chart,
      side: values.side,
      entryPrice: values.entryPrice,
      stopLossPrice: values.stopLossPrice,
      takeProfitPrice: values.takeProfitPrice,
      riskRewardRatio: (parseFloat(rr).toFixed(2)).toString(),
    },
    )
    navigate("/")
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "100px" }}>
      <Formik

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
          setFieldValue

        }) => (
          <Form layout="vertical" style={{ width: "40%" }}>
            <Form.Item
              label="Pair"

              help={touched.pair && errors.pair}
              validateStatus={touched.pair && errors.pair && 'error'}
              name="pair"
              initialValue={values.pair}
            >
              <Input
                placeholder={'Please type pair ex:(BTCUSDTPERP)'}
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

            <Form.Item
              label="Position Side"
              name="side"
              help={touched.side && errors.side}
              validateStatus={touched.side && errors.side && 'error'}
              initialValue={values.side}
            >
              <Select onChange={(value) => setFieldValue("side", value)} placeholder="Please select position side">
                <Select.Option value="Long">Long</Select.Option>
                <Select.Option value="Short">Short</Select.Option>
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
                disabled={!values.side ? true : false}
                placeholder={'Please type stop loss price'}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Item>
            <Form.Item
              label="Entry Price"
              help={touched.entryPrice && errors.entryPrice}
              validateStatus={touched.entryPrice && errors.entryPrice && 'error'}
              name="entryPrice"
              initialValue={values.entryPrice}
            >
              <Input
                disabled={values.side && values.stopLossPrice ? false : true}
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
                disabled={values.side && values.entryPrice ? false : true}
                placeholder={'Please type take profit price'}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Item>

            <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default CreateTradeSetup
