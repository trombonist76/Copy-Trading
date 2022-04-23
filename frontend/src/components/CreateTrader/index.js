import { Formik } from 'formik'
import traderValidations from './validation'
import { Form, Input, Button} from 'antd'
import {useNavigate} from 'react-router-dom'
import { useCurrentUser } from '../../contexts/userContext'
import { useContract } from '../../contexts/contractContext'

const CreateTrader = () => {
  const { contract } = useContract()
  const {setUserSignUp}= useCurrentUser()
  const navigate = useNavigate()

  const handleSubmit = async (values) => {
    console.log('Trader oluşturuluyor...')

    const traderData = {
      name: values.traderName,
      winrate: parseInt(values.traderWinrate)
    }

    await contract.createTrader({
      ...traderData
    },
    )

    setUserSignUp(true)
    navigate("/")
    console.log('Trader oluşturuldu')
  }
  return (
    <div style={{display:"flex",justifyContent:"center", alignItems:"center", marginTop:"100px"}}>
    <Formik
    initialValues={{}}
      validationSchema={traderValidations}
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
        <Form layout="vertical" style={{width:"30%"}}>
          <Form.Item
            label="Trader Name"
            help={touched.traderName && errors.traderName}
            validateStatus={touched.traderName && errors.traderName && 'error'}
            name="traderName"
            initialValue={values.traderName}
          >
            <Input
              placeholder={'Please type trader name'}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Form.Item>
          <Form.Item
            label="Trader Winrate"
            help={touched.traderWinrate && errors.traderWinrate}
            validateStatus={
              touched.traderWinrate && errors.traderWinrate && 'error'
            }
            name="traderWinrate"
            initialValue={values.traderWinrate}
          >
            <Input
              placeholder={'Please type winrate'}
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

export default CreateTrader
