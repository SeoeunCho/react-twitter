import { useNavigate } from "react-router-dom";
import styled from "./SearchBox.module.scss";
import SearchTweetsBox from "./SearchTweetsBox";
import SearchUsersBox from "./SearchUsersBox";
import useTranslation from "hooks/useTranslation";

export default function SearchBox({
  userResult,
  tweetResult,
  users,
  search,
  focus,
  userObj,
}: any) {
  const navigate = useNavigate();
  const t = useTranslation();

  const showMore = () => {
    navigate("/explore/tweets/");
  };

  return (
    <>
      {focus && (
        <article className={styled.container}>
          {search === "" && (
            <div className={styled.notification}>
              <p>{t("EXPLORE_KEYWORD")}</p>
              <span>{t("EXPLORE_NOT_REVEALED")}</span>
            </div>
          )}
          {search !== "" &&
            userResult?.length === 0 &&
            tweetResult?.length === 0 && (
              <div className={styled.notification}>
                <p>{t("EXPLORE_NO_MATCHED")}</p>
                <span>{t("EXPLORE_NOT_REVEALED")}</span>
              </div>
            )}
          <div className={styled.searchUser__container}>
            <div style={{ overflow: "hidden" }}>
              <>
                {userResult?.length !== 0 && (
                  <section className={styled.followBox}>
                    <div className={styled.followBox__name}>
                      <h2>{t("TAB_USER")}</h2>
                    </div>
                    <ul className={styled.follows}>
                      <SearchUsersBox userResult={userResult} />
                    </ul>
                  </section>
                )}
                {userResult?.length !== 0 && tweetResult?.length !== 0 && (
                  <div className={styled.line} />
                )}
                {tweetResult?.length !== 0 && (
                  <section className={styled.followBox}>
                    <div className={styled.followBox__name}>
                      <h2>{t("TAB_TWEET")}</h2>
                    </div>
                    <ul className={styled.follows}>
                      {tweetResult?.slice(0, 5).map((tweet: any) => (
                        <SearchTweetsBox
                          key={tweet.id}
                          users={users}
                          tweet={tweet}
                        />
                      ))}
                      {tweetResult.length >= 4 && (
                        <button
                          type="button"
                          className={styled.more}
                          onClick={showMore}
                        >
                          {t("BUTTON_MORE")}
                        </button>
                      )}
                    </ul>
                  </section>
                )}
              </>
            </div>
          </div>
        </article>
      )}
    </>
  );
}
