// import { useHistory } from "react-router-dom";
import styled from "./SearchBox.module.scss";
// import SearchNweetsBox from "./SearchNweetsBox";
// import SearchUsersBox from "./SearchUsersBox";

export default function SearchBox({
  userResult,
  tweetResult,
  users,
  search,
  focus,
  user,
}: any) {
  // const history = useHistory();

  // const showMore = () => {
  //   history.push("/explore/tweets/");
  // };

  return (
    <>
      {focus && (
        <article className={styled.container}>
          {search === "" && (
            <div className={styled.notice}>
              <p>사용자, 키워드를 검색해보세요.</p>
              <span>(본인 정보는 노출되지 않습니다.)</span>
            </div>
          )}
          {search !== "" &&
            userResult?.length === 0 &&
            tweetResult?.length === 0 && (
              <div className={styled.notice}>
                <p>검색하신 결과가 없습니다.</p>
                <span>(본인 정보는 노출되지 않습니다.)</span>
              </div>
            )}
          <div className={styled.searchUser__container}>
            <div style={{ overflow: "hidden" }}>
              <>
                {userResult?.length !== 0 && (
                  <section className={styled.followBox}>
                    <div className={styled.followBox__name}>
                      <h2>유저</h2>
                    </div>
                    <ul className={styled.follows}>
                      {/* <SearchUsersBox userResult={userResult} /> */}
                    </ul>
                  </section>
                )}
                {userResult?.length !== 0 && tweetResult?.length !== 0 && (
                  <div className={styled.line} />
                )}
                {tweetResult?.length !== 0 && (
                  <section className={styled.followBox}>
                    <div className={styled.followBox__name}>
                      <h2>트윗</h2>
                    </div>
                    {/* <ul className={styled.follows}>
                      {tweetResult?.slice(0, 5).map((tweet, index) => (
                        <SearchNweetsBox
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
                          더 보기
                        </button>
                      )}
                    </ul> */}
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
