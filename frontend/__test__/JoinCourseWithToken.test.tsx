import { render, act } from '@testing-library/react';
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

    const mockUserData = { course: [courseId] };
    const mockResponse = { ok: true };

    (api.getUserData as jest.Mock).mockResolvedValue(mockUserData);
    (api.joinCourseUsingToken as jest.Mock).mockResolvedValue(mockResponse);

    delete window.location;
    window.location = { href: '' } as any;

    await act(async () => {
      render(<JoinCourseWithToken token={token} course_id={courseId} />);
    });

    expect(api.getUserData).toHaveBeenCalled();
    expect(api.joinCourseUsingToken).toHaveBeenCalledWith(courseId, token);
    expect(window.location.href).toBe(`/course/${courseId}`);
  });
});