import {act, render} from '@testing-library/react';
import JoinCourseWithToken from '../app/[locale]/components/JoinCourseWithToken';
import * as api from '@lib/api';

jest.mock('../lib/api', () => ({
    getUserData: jest.fn(),
    joinCourseUsingToken: jest.fn(),
}));

describe('JoinCourseWithToken', () => {
    it('joins a course using a token', async () => {
        const token = 'test_token';
        const courseId = 1;

        const mockUserData = {course: [courseId]};
        const mockResponse = {ok: true};

        (api.getUserData as jest.Mock).mockResolvedValue(mockUserData);
        (api.joinCourseUsingToken as jest.Mock).mockResolvedValue(mockResponse);

        delete window.location;
        window.location = {href: ''} as any;

        await act(async () => {
            render(<JoinCourseWithToken token={token} course_id={courseId}/>);
        });

        expect(api.getUserData).toHaveBeenCalled();
        expect(api.joinCourseUsingToken).toHaveBeenCalledWith(courseId, token);
        expect(window.location.href).toBe(`/course/${courseId}`);
    });

    it('fails to join a course using a wrong token', async () => {
        const token = 'wrong_token';
        const courseId = 1;

        const mockUserData = {course: [2]};
        const mockResponse = {ok: false};

        (api.getUserData as jest.Mock).mockResolvedValue(mockUserData);
        (api.joinCourseUsingToken as jest.Mock).mockResolvedValue(mockResponse);

        await act(async () => {
            render(<JoinCourseWithToken token={token} course_id={courseId}/>);
        });

        expect(api.getUserData).toHaveBeenCalled();
        expect(api.joinCourseUsingToken).toHaveBeenCalledWith(courseId, token);
    });

    it('user not logged in', async () => {
        const token = 'wrong_token';
        const courseId = 1;
        const mockResponse = {ok: false};

        (api.getUserData as jest.Mock).mockResolvedValue(null);
        (api.joinCourseUsingToken as jest.Mock).mockResolvedValue(mockResponse);

        await act(async () => {
            render(<JoinCourseWithToken token={token} course_id={courseId}/>);
        });

        expect(api.getUserData).toHaveBeenCalled();
        expect(api.joinCourseUsingToken).toHaveBeenCalledWith(courseId, token);
    });


});