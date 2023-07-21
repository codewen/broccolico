
import { useState } from 'react';
import { Button, Modal } from 'flowbite-react';
import InviteForm, { FormField, FormValue } from '../components/InviteForm';

const Home = () => {

  const [openModal, setOpenModal] = useState<string | undefined>();

  const submitToServer = async (value: FormValue) => {
    const response = await fetch('https://l94wc2001h.execute-api.ap-southeast-2.amazonaws.com/prod/fake-auth', {
      method: 'POST',
      body: JSON.stringify({
        "name": value.fullName,
        "email": value.customerEmail
      })
    })
    if (response.status === 200)
      return null;
    else if (response.status === 400) {
      const errorMsg = await response.json();
      return errorMsg.errorMessage;
    }
  }
  const closeModel = () => {
    setOpenModal(undefined)
  }

  return (
    <div className={`flex min-h-screen flex-col items-center justify-center`}>
      <header className='border-gray-400 border-b-2 w-full md:px-40 px-8 py-5'>
        <h2 className='font-bold'>BROCCOLI & CO.</h2>
      </header>
      <h1 className='mt-auto text-3xl text-center'>A better way <br /> to enjoy every day.</h1>
      <p className='mt-4 mb-6'>Be the first to know when we launch.</p>
      <Button className='mb-auto' data-testid='home-page-button' color="light" onClick={() => setOpenModal('default')}>Request an invite</Button>
      <footer className='border-gray-400 border-t-2 w-full md:px-40 px-8 py-5 text-center'>
        Made with
        <svg className='inline-block mx-2' fill="#000000" width="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 20a1 1 0 0 1-.437-.1C11.214 19.73 3 15.671 3 9a5 5 0 0 1 8.535-3.536l.465.465.465-.465A5 5 0 0 1 21 9c0 6.646-8.212 10.728-8.562 10.9A1 1 0 0 1 12 20z" />
        </svg>
        in Melbourne. <br /> @ 2016 Broccoli & Co. All rights reserved.
      </footer>

      <Modal show={openModal === 'default'} onClose={() => setOpenModal(undefined)}>
        <Modal.Body>
          <InviteForm submitForm={submitToServer} closeModal={closeModel} />
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Home;
