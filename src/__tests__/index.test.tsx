import { render, screen, waitFor } from '@testing-library/react';
import Home from '../pages/index';
import '@testing-library/jest-dom';
import { within } from '@testing-library/dom'

describe('Home page', () => {
    it('home page render', () => {
        render(<Home />);
        expect(within(screen.getByTestId('home-page-button')).getByText('Request an invite')).toBeInTheDocument();
    })

});