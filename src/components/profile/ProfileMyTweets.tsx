import CircleLoader from "components/loader/CircleLoader";
import useGetFbInfo from "hooks/useGetFbInfo";
import TweetListPage from "components/tweets/TweetListPage";

export default function ProfileMyTweets({ myTweets, userObj }: any) {
  const { reTweets } = useGetFbInfo();

  return (
    <>
      {reTweets ? (
        <>
          {myTweets.length !== 0 ? (
            <div>
              {myTweets.map((myTweet: any, index: number) => (
                <TweetListPage
                  key={index}
                  tweetObj={myTweet}
                  reTweetsObj={reTweets}
                  userObj={userObj}
                  isOwner={myTweet.creatorId === userObj.uid}
                />
              ))}
            </div>
          ) : (
            <div className="noInfoBox">
              <div className="noInfo">
                <h2>아직 트윗이 없습니다</h2>
                <p>지금 일어나는 일을 트윗에 담아보세요.</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <CircleLoader />
      )}
    </>
  );
}
