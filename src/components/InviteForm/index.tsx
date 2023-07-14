import { useState } from 'react';
import styles from './styles.module.css'
import { Button, TextInput } from 'flowbite-react';

interface IInviteFormProps {
  submitForm: (value: FormValue) => Promise<any>,
  closeModal: () => void
}
type ValidateResult = {
  message: string,
  fieldName: string[]
}
export type FormField = {
  type: string,
  name: string,
  placeholder: string,
  required: boolean,
}
export type FormValue = {
  fullName: string,
  customerEmail: string,
  emailConfirm: string,
}

const FORM_FIELDS: FormField[] = [{
  type: "text",
  name: "fullName",
  placeholder: "Full name",
  required: true
}, {
  type: "email",
  name: "customerEmail",
  placeholder: "Email",
  required: true
}, {
  type: "email",
  name: "emailConfirm",
  placeholder: "Confirm Email",
  required: true
}];

const InviteForm: React.FC<IInviteFormProps> = ({ submitForm, closeModal }: IInviteFormProps) => {

  const [values, setValues] = useState<FormValue>({
    fullName: "",
    customerEmail: "",
    emailConfirm: ""
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [alldone, setAlldone] = useState<boolean>(false);
  const [serverMessage, setServerMessage] = useState<string>('');
  const [validateResult, setValidateResult] = useState<ValidateResult>({
    message: "",
    fieldName: []
  });

  const changeHandler = (event: React.FormEvent<HTMLFormElement>) => {
    const inputTarget = event.target as HTMLInputElement;
    setValues(values => ({ ...values, [inputTarget.name]: inputTarget.value }));
  }

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerMessage('');
    if (validateForm()) {
      setSubmitting(true);
      submitForm(values).then((response) => {
        if (response.status === 200)
          setAlldone(true);
      }).catch((error) => {
        console.log(error);
        setServerMessage(error.response.data.errorMessage);
      }).finally(() => {
        setSubmitting(false);
      });
    }
  }

  const validateForm: () => boolean = () => {
    setValidateResult({
      message: "",
      fieldName: []
    })
    if (values.fullName.length < 3) {
      setValidateResult({
        message: "Full name needs to be at least 3 characters long",
        fieldName: ["fullName"]
      })
      return false;
    }
    if (values.customerEmail !== values.emailConfirm) {
      setValidateResult({
        message: "Email not matching",
        fieldName: ["customerEmail", "emailConfirm"]
      })
      return false;
    }
    return true;

  }

  const okHandler = () => {
    closeModal();
    setAlldone(false);
  }

  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm" data-testid="invite-form">
      <h2 className={`text-xl text-center italic mb-12 ${styles.header}`}>{alldone ? "All done!" : "Request an invite"}</h2>
      {alldone ?
        <>
          <p className='my-5 text-center'>You will be one of the first to experience Broccoli & Co. when we launch,</p>
          <Button data-testid='invite-form--ok' color="light" onClick={() => okHandler()} className='w-full'>OK</Button>
        </>
        :
        <form className="space-y-6" action="#" method="POST" onSubmit={e => submitHandler(e)} onChange={e => changeHandler(e)}>
          <div>
            {
              FORM_FIELDS.map((formField, index) => (
                <div className={`mt-2`} key={formField.name}>
                  <TextInput data-testid={`invite-form-input--${formField.name}`} name={formField.name} type={formField.type} placeholder={formField.placeholder} required={formField.required}
                    color={`${validateResult?.fieldName.indexOf(formField.name) !== -1 ? "failure" : ""}`}
                  />
                </div>
              ))
            }
          </div>
          <div className='h-4'>
            <p className='text-red-500' data-testid='invite-form-message'>{validateResult?.message}</p>
          </div>
          <div>
            <Button data-testid='invite-form-input--submit' color="light" type="submit" disabled={submitting}
              className={`w-full ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {submitting ? 'Sending, please wait...' : 'Send'}
            </Button>
            <div className='h-4'>
              <p className='text-red-500'>{serverMessage}</p>
            </div>
          </div>
        </form>
      }

    </div>
  )

}

export default InviteForm;