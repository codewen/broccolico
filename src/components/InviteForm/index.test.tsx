
import { render, screen, waitFor } from '@testing-library/react';
import InviteForm from './index';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'

describe('InviteForm', () => {

    const submitFormMock = jest.fn(() => Promise.resolve({ status: 200 }));
    const closeModalMock = jest.fn();
    const user = userEvent.setup()

    afterEach(() => {
        submitFormMock.mockClear();
        closeModalMock.mockClear();
    });
    it('Sumbit with valid data and close popup', async () => {
        render(<InviteForm submitForm={submitFormMock} closeModal={closeModalMock} />);
        expect(screen.getByTestId('invite-form')).toBeInTheDocument()

        const NAME = 'Yao';
        const EMAIL = 'codewen@gmail.com';
        await user.type(screen.getByTestId("invite-form-input--fullName"), NAME);
        await user.type(screen.getByTestId("invite-form-input--customerEmail"), EMAIL);
        await user.type(screen.getByTestId("invite-form-input--emailConfirm"), EMAIL);

        await user.click(screen.getByTestId('invite-form-input--submit'));
        expect(submitFormMock).toHaveBeenCalledWith({
            "customerEmail": EMAIL,
            "emailConfirm": EMAIL,
            "fullName": NAME
        });

        await user.click(screen.getByTestId('invite-form--ok'));
        expect(closeModalMock).toBeCalled();
    })

    it('submit with incomplete data', async () => {
        render(<InviteForm submitForm={submitFormMock} closeModal={closeModalMock} />);
        expect(screen.getByTestId('invite-form')).toBeInTheDocument()

        const NAME = 'Yao2';
        const EMAIL = 'codewen@gmail.com';

        await user.type(screen.getByTestId("invite-form-input--fullName"), NAME);
        await user.click(screen.getByTestId('invite-form-input--submit'));
        expect(submitFormMock).toBeCalledTimes(0);

        await user.type(screen.getByTestId("invite-form-input--customerEmail"), EMAIL);
        await user.click(screen.getByTestId('invite-form-input--submit'));
        expect(submitFormMock).toBeCalledTimes(0);

        await user.type(screen.getByTestId("invite-form-input--emailConfirm"), EMAIL);
        await user.click(screen.getByTestId('invite-form-input--submit'));
        expect(submitFormMock).toBeCalledTimes(1);
    })

    it('submit with invalid data', async () => {

        render(<InviteForm submitForm={submitFormMock} closeModal={closeModalMock} />);

        const NAME = 'Ya';
        const EMAIL = 'codewen@gmail.com';

        await user.type(screen.getByTestId("invite-form-input--fullName"), NAME);
        await user.type(screen.getByTestId("invite-form-input--customerEmail"), EMAIL);
        await user.type(screen.getByTestId("invite-form-input--emailConfirm"), EMAIL);

        await user.click(screen.getByTestId('invite-form-input--submit'));
        expect(submitFormMock).toBeCalledTimes(0);
        expect(screen.getByTestId('invite-form-message').textContent).toBe('Full name needs to be at least 3 characters long')


        await user.clear(screen.getByTestId("invite-form-input--fullName"));
        await user.type(screen.getByTestId("invite-form-input--fullName"), NAME + 'o');
        expect(screen.getByTestId("invite-form-input--fullName")).toHaveValue('Yao');

        await user.clear(screen.getByTestId("invite-form-input--emailConfirm"));
        await user.type(screen.getByTestId("invite-form-input--emailConfirm"), EMAIL + 'm');
        await user.click(screen.getByTestId('invite-form-input--submit'));

        expect(submitFormMock).toBeCalledTimes(0);
        expect(screen.getByTestId('invite-form-message').textContent).toBe('Email not matching')

        await user.clear(screen.getByTestId("invite-form-input--emailConfirm"));
        await user.type(screen.getByTestId("invite-form-input--emailConfirm"), EMAIL);
        expect(screen.getByTestId("invite-form-input--emailConfirm")).toHaveValue(EMAIL);
        await user.click(screen.getByTestId('invite-form-input--submit'));

        expect(submitFormMock).toBeCalledWith({
            "customerEmail": EMAIL,
            "emailConfirm": EMAIL,
            "fullName": NAME + 'o'
        });
    })

});