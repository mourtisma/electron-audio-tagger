import React from 'react';
import { render } from '@testing-library/react';
import HelloWorld from '../../hello-world';

test('renders a message', () => {
    const { getByText } = render(<HelloWorld />);
    expect(
        getByText('Welcome to your Electron application.'),
    ).toBeInTheDocument();
});
