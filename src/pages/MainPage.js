import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react"
import { getTweets, checkFollow } from '../Services/api.js';
import styled from "styled-components";
import Visualization from "../Components/Visualization"
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import format from 'date-fns/format'
import { TailSpin } from 'react-loader-spinner'


const SpinnerContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 447.38px;
`;

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const Label = styled.div`
    color: black;
    font-size: 20px;
    margin-left: 60px;
    margin-top: 10px;
    margin-bottom: -20px;
    align-self: flex-start;
    margin-right: 30px;
`;


const LogoutBtn = styled.div`
    cursor: pointer;
    color: red;
    font-size: 18px;
    margin: 10px 10px 10px 10px;
    width: 100px;
    display: flex;
`;

const MainPage = () => {
    const navigate = useNavigate()
    const [tweets, setTweets] = useState(JSON.parse(localStorage.getItem('tweets')) || [])
    const [loading, setLoading] = useState(false);
    const [duration, setDuration] = useState('week');
    const [users, setUsers] = useState(JSON.parse(localStorage.getItem('users')) || {});
    const getTweetsForCachedUser = async () => {
        const userId = JSON.parse(localStorage.getItem('user')).providerData[0].uid;
        const accessToken = localStorage.getItem('accessToken');
        const accessTokenSecret = localStorage.getItem('accessTokenSecret');
        if (tweets?.length === 0) {
            setLoading(true)
        }
        const response = await getTweets({
            userId,
            accessToken,
            accessTokenSecret
        })
        localStorage.setItem('tweets', JSON.stringify(response))
        setTweets(response)
        setLoading(false)
    }

    useEffect(() => {
        getTweetsForCachedUser()
    }, [])

    const TweetsByweek = useMemo(() => {
        const tweetsByweek = {
            labels: [format(addDays(new Date(), -6), "ccc"), format(addDays(new Date(), -5), "ccc"), format(addDays(new Date(), -4), "ccc"), format(addDays(new Date(), -3), "ccc"), format(addDays(new Date(), -2), "ccc"), format(addDays(new Date(), -1), "ccc"), format(new Date(), "ccc")],
            sadness: [0, 0, 0, 0, 0, 0, 0],
            anger: [0, 0, 0, 0, 0, 0, 0],
            fear: [0, 0, 0, 0, 0, 0, 0],
            joy: [0, 0, 0, 0, 0, 0, 0],
            surprise: [0, 0, 0, 0, 0, 0, 0],
            disgust: [0, 0, 0, 0, 0, 0, 0],
            neutral: [0, 0, 0, 0, 0, 0, 0],
            status: { label: 'Neutral', duration: "Week" },
        }
        const totalNumberOflabels = {
            sadness: 0,
            anger: 0,
            fear: 0,
            joy: 0,
            surprise: 0,
            disgust: 0,
            neutral: 0
        }
        tweets.forEach((tweet) => {
            const result = formatDistanceToNowStrict(
                new Date(tweet.date)
            )
            if (!result.includes('months') && !result.includes('month') && !result.includes('years')) {
                if (result.includes('days')) {
                    const arr = result.split(' ')
                    if (arr[0] <= 6) {
                        tweetsByweek[tweet.label][6 - arr[0]] = tweetsByweek[tweet.label][6 - arr[0]] + 1
                        totalNumberOflabels[tweet.label] = totalNumberOflabels[tweet.label] + 1
                    }
                } else {
                    tweetsByweek[tweet.label][6] = tweetsByweek[tweet.label][6] + 1
                    totalNumberOflabels[tweet.label] = totalNumberOflabels[tweet.label] + 1
                }
            }
        })
        tweetsByweek.status.label = Object.keys(totalNumberOflabels).reduce((a, b) => totalNumberOflabels[a] > totalNumberOflabels[b] ? a : b)
        return tweetsByweek
    }, [tweets])

    const TweetsByMonth = useMemo(() => {
        const tweetsByMonth = {
            labels: [format(addDays(new Date(), -29), "d-L"), format(addDays(new Date(), -23), "d-L"), format(addDays(new Date(), -17), "d-L"), format(addDays(new Date(), -11), "d-L"), `${format(addDays(new Date(), -5), "d-L")}-now`],
            sadness: [0, 0, 0, 0, 0],
            anger: [0, 0, 0, 0, 0],
            fear: [0, 0, 0, 0, 0],
            joy: [0, 0, 0, 0, 0],
            surprise: [0, 0, 0, 0, 0],
            disgust: [0, 0, 0, 0, 0],
            neutral: [0, 0, 0, 0, 0],
            status: { label: 'Neutral', duration: "Month" },
        }
        const totalNumberOflabels = {
            sadness: 0,
            anger: 0,
            fear: 0,
            joy: 0,
            surprise: 0,
            disgust: 0,
            neutral: 0
        }
        tweets.forEach((tweet) => {
            const result = formatDistanceToNowStrict(
                new Date(tweet.date)
            )
            if (!result.includes('years') && !result.includes('months')) {
                totalNumberOflabels[tweet.label] = totalNumberOflabels[tweet.label] + 1
                if (result.includes('days')) {
                    const arr = result.split(' ')
                    if (arr[0] <= 5) {
                        tweetsByMonth[tweet.label][4] = tweetsByMonth[tweet.label][4] + 1
                    }
                    else if (arr[0] <= 11) {
                        tweetsByMonth[tweet.label][3] = tweetsByMonth[tweet.label][3] + 1
                    }
                    else if (arr[0] <= 17) {
                        tweetsByMonth[tweet.label][2] = tweetsByMonth[tweet.label][2] + 1
                    }
                    else if (arr[0] <= 23) {
                        tweetsByMonth[tweet.label][1] = tweetsByMonth[tweet.label][1] + 1
                    }
                    else {
                        tweetsByMonth[tweet.label][0] = tweetsByMonth[tweet.label][0] + 1
                    }
                } else {
                    tweetsByMonth[tweet.label][4] = tweetsByMonth[tweet.label][4] + 1
                }
            }
        })
        tweetsByMonth.status.label = Object.keys(totalNumberOflabels).reduce((a, b) => totalNumberOflabels[a] > totalNumberOflabels[b] ? a : b)
        return tweetsByMonth
    }, [tweets])

    const TweetsByYear = useMemo(() => {
        const tweetsByYear = {
            labels: [format(addMonths(new Date(), -11), "L-Y"), format(addMonths(new Date(), -10), "L-Y"), format(addMonths(new Date(), -9), "L-Y"), format(addMonths(new Date(), -8), "L-Y"), format(addMonths(new Date(), -7), "L-Y"), format(addMonths(new Date(), -6), "L-Y"), format(addMonths(new Date(), -5), "L-Y"), format(addMonths(new Date(), -4), "L-Y"), format(addMonths(new Date(), -3), "L-Y"), format(addMonths(new Date(), -2), "L-Y"), format(addMonths(new Date(), -1), "L-Y"), format(new Date(), "L-Y")],
            sadness: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            anger: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            fear: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            joy: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            surprise: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            disgust: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            neutral: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            status: { label: 'Neutral', duration: "Year" },
        }
        const totalNumberOflabels = {
            sadness: 0,
            anger: 0,
            fear: 0,
            joy: 0,
            surprise: 0,
            disgust: 0,
            neutral: 0
        }
        tweets.forEach((tweet) => {
            const result = formatDistanceToNowStrict(
                new Date(tweet.date)
            )
            if (!result.includes('years')) {
                totalNumberOflabels[tweet.label] = totalNumberOflabels[tweet.label] + 1
                if (result.includes('months')) {
                    const arr = result.split(' ')
                    tweetsByYear[tweet.label][11 - arr[0]] = tweetsByYear[tweet.label][11 - arr[0]] + 1
                } else {
                    tweetsByYear[tweet.label][11] = tweetsByYear[tweet.label][11] + 1
                }
            }
        })
        tweetsByYear.status.label = Object.keys(totalNumberOflabels).reduce((a, b) => totalNumberOflabels[a] > totalNumberOflabels[b] ? a : b)
        return tweetsByYear
    }, [tweets])

    const logout = useCallback(() => {
        localStorage.setItem('user', null)
        localStorage.setItem('tweets', null)
        navigate('/')
    }, [navigate])

    const handleDurationChange = (event) => {
        setDuration(event.target.value);
    };

    const userToUnfollow = useMemo(() => {
        let handle = ""
        let max = 0;
        for (const key in users) {
            const maxTemp = users[key]['sadness'] + users[key]['fear'] + users[key]['anger']
            if (maxTemp > max) {
                handle = key
            }
        }
        return handle
    }, [users])

    const deleteUnfollowedUsers = useCallback(async () => {
        const userId = JSON.parse(localStorage.getItem('user')).providerData[0].uid;
        const result = await checkFollow({ source_id: userId, screen_name: userToUnfollow.slice(1) })
        if (!result.following) {
            delete users[userToUnfollow]
            setUsers({ ...users })
        }
    }, [userToUnfollow, users])

    useEffect(() => {
        if (userToUnfollow !== "") {
            deleteUnfollowedUsers()
        }
    }, [userToUnfollow, deleteUnfollowedUsers])
    return (
        <div>
            <HeaderContainer>
                <Label>EmoTool</Label>
                <LogoutBtn onClick={logout}>Logout</LogoutBtn>
            </HeaderContainer>
            {loading && <SpinnerContainer><TailSpin
                height="150"
                width="150"
                color='grey'
                ariaLabel='loading'
            /></SpinnerContainer>}
            {!loading && <Visualization graphTweets={duration === "week" ? TweetsByweek : duration === "month" ? TweetsByMonth : TweetsByYear} duration={duration} handleDurationChange={handleDurationChange} />}
        </div>
    );
}

export default MainPage;