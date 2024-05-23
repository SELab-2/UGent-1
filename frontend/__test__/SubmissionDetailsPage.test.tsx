import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import SubmissionDetailsPage from '@app/[locale]/components/SubmissionDetailsPage';

jest.mock('../lib/api', () => ({
    getSubmission: jest.fn().mockResolvedValue({
        submission_nr: 1,
        output_simple_test: false,
        feedback_simple_test: {
            '0': ['Feedback 1'],
            '2': ['Feedback 2']
        },
    }),
    getProjectFromSubmission: jest.fn().mockResolvedValue(456),
}));


describe('SubmissionDetailsPage', () => {
    test('renders submission details correctly', async () => {
        render(<SubmissionDetailsPage locale="en" submission_id={1}/>);

        expect(screen.getByRole('progressbar')).toBeInTheDocument();

        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

        // Ensure submission details are rendered
        expect(screen.getByText(/submission #/i)).toBeInTheDocument();
        expect(screen.getByText(/evaluation status/i)).toBeInTheDocument();
        expect(screen.getByText(/uploaded_files/i)).toBeInTheDocument();
        expect(screen.getByText(/feedback_simple_test_0/i)).toBeInTheDocument();
        expect(screen.getByText(/Feedback 1/i)).toBeInTheDocument();

        // Test the feedback for simple test "2"
        expect(screen.getByText(/feedback_simple_test_2/i)).toBeInTheDocument();
        expect(screen.getByText(/Feedback 2/i)).toBeInTheDocument();
    });
});
