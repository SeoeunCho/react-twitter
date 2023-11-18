import CircleLoader from "components/loader/CircleLoader";
import useGetFbInfo from "hooks/useGetFbInfo";
import TweetListPage from "components/tweets/TweetListPage";
import useTranslation from "hooks/useTranslation";

export default function ProfileMyTweets({ myTweets, userObj }: any) {
  const { reTweets } = useGetFbInfo();
  const t = useTranslation();

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
                <h2>{t("NO_BOOKMARK_TWEET")}</h2>
                <p>{t("NO_MY_TWEET_LIST")}</p>
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
