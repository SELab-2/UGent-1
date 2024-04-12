"use client"
import {useEffect, useState} from 'react';
import {getUserData, joinCourseUsingToken} from '@lib/api';

const JoinCourseWithToken = ({token, course_id}: { token: any, course_id: any }) => {
    const [joined, setJoined] = useState(false);

    useEffect(() => {
        const join = async () => {
            try {
                const userData = await getUserData();
                if (!userData) {
                    new Error('User not logged in');
                }
                try {
                    const respone = await joinCourseUsingToken(course_id, token);
                    setJoined(true);
                    if (!respone.ok) {
                        new Error('Failed to join course');
                    }
                } catch (error) {
                    console.log(error)
                    // if user couldn't join the course, redirect to home page
                    if (!userData.course.includes(Number(course_id))) {
                        window.location.href = '/home';
                    }

                }
            } catch (error) {
                // this shouldn't happen
                console.error(error)
            }
        };
        join();
    }, []);

    if (joined) {
        window.location.href = '/home/' + course_id;
        return;
    }

    return null;
};

export default JoinCourseWithToken;